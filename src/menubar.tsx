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
  parseConnectTime,
} from "./utils";

export default function Menubar() {
  const {
    isLoading: curlLoading,
    data: curlData,
    error: curlError,
  } = useExec(
    "curl",
    [
      "-s",
      "-o",
      "/dev/null",
      "-w",
      "'connect=%{time_connect} ttfb=%{time_starttransfer} total=%{time_total}'",
      "https://one.one.one.one",
    ],
    {
      onError: (error) => {
        console.error(error);
      },
      keepPreviousData: false,
    },
  );

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
  } = useExec("dig", ["+time=3", "+tries=1", "+short", "myip.opendns.com", "@resolver1.opendns.com"], {
    onError: () => {},
    keepPreviousData: true,
  });

  const isLoading = pingLoading || warpLoading || myIpLoading || curlLoading;
  const pingOutput = pingError?.message ? "error" : pingData;
  const warpOutput = warpError?.message ? "error" : warpData;
  const myIpOutput = myIpError?.message ? "error" : myIp;
  const curlOutput = curlError?.message ? "error" : curlData;
  const avgPing = parseAvgPing(pingOutput);
  const packetLoss = parsePacketLoss(pingOutput);
  const { connectTime, totalTime, ttfbTime } = parseConnectTime(curlOutput);
  const connectionStatus = getConnectionStatus(packetLoss, avgPing, connectTime);
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
        <MenubarStatusSection
          avgPing={avgPing}
          isOnline={isOnline}
          packetLoss={packetLoss}
          myIp={myIpOutput}
          connectTime={connectTime}
          totalTime={totalTime}
          ttfbTime={ttfbTime}
        />
      )}

      {!!warpOutput && <MenubarCloudflareSection warpData={warpOutput} />}
    </MenuBarExtra>
  );
}
