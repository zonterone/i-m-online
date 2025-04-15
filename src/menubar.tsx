import { Icon, MenuBarExtra } from "@raycast/api";
import { useExec } from "@raycast/utils";
import MenubarCloudflareSection from "./menubar-cloudflare-section";
import MenubarStatusSection from "./menubar-status-section";
import {
  parseAvgPing,
  parsePacketLoss,
  parseCloudflareConnectionStatus,
  getConnectionStatus,
  getConnectionStatusColor,
} from "./utils";

export default function Menubar() {
  const {
    isLoading: pingLoading,
    data: pingData,
    error: pingError,
  } = useExec("ping", ["-q", "-c", "3", "-W", "2", "one.one.one.one"], {
    onError: () => {},
    keepPreviousData: false,
  });

  const {
    isLoading: warpLoading,
    data: warpData,
    error: warpError,
  } = useExec("warp-cli", ["status"], {
    onError: () => {},
    keepPreviousData: true,
  });

  const {
    isLoading: myIpLoading,
    data: myIp,
    error: myIpError,
  } = useExec("dig", ["+short", "myip.opendns.com", "@resolver1.opendns.com"], {
    onError: () => {},
    keepPreviousData: true,
  });

  const isLoading = pingLoading || warpLoading || myIpLoading;
  const pingOutput = pingError?.message || pingData;
  const warpOutput = warpError?.message || warpData;
  const myIpOutput = myIpError?.message || myIp;
  const avgPing = parseAvgPing(pingOutput);
  const packetLoss = parsePacketLoss(pingOutput);
  const connectionStatus = getConnectionStatus(packetLoss, avgPing);
  const connectionStatusColor = getConnectionStatusColor(connectionStatus);
  const isOnline = connectionStatus !== "offline";
  const cloudflareStatus = parseCloudflareConnectionStatus(warpOutput);

  return (
    <MenuBarExtra
      icon={{
        source: cloudflareStatus === "Connected" ? Icon.Lock : Icon.LockUnlocked,
        tintColor: connectionStatusColor,
      }}
      tooltip={isOnline ? "You're Online!" : "You're Offline!"}
      isLoading={isLoading}
    >
      {!!pingOutput && (
        <MenubarStatusSection avgPing={avgPing} isOnline={isOnline} packetLoss={packetLoss} myIp={myIpOutput} />
      )}

      {!!warpOutput && <MenubarCloudflareSection warpData={warpOutput} />}
    </MenuBarExtra>
  );
}
