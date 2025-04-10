import { Icon, MenuBarExtra } from "@raycast/api";
import { useExec } from "@raycast/utils";
import MenubarCloudflareSection from "./menubar-cloudflare-section";
import MenubarStatusSection from "./menubar-status-section";

export type CloudflareStatuses = "Connected" | "Connecting" | "Disconnected" | "Unable";

const parseAvgPing = (data: string | undefined) => {
  if (!data) return null;
  const avgPingRegex = /avg\/max\/stddev = [\d.]+\/([\d.]+)\/[\d.]+\/[\d.]+ ms/;
  const match = data.match(avgPingRegex);
  return match ? match[1] : null;
};

const parsePacketLoss = (data: string | undefined) => {
  if (!data) return null;
  const packetLossRegex = /([\d.]+)% packet loss/;
  const packetLossMatch = data.match(packetLossRegex);
  return packetLossMatch ? packetLossMatch[1] : null;
};

const parseCloudflareConnectionStatus = (string: string | undefined) => {
  if (!string) return "Unable";
  const statusRegex = /Status update: (\w+)/;
  const statusMatch = string.match(statusRegex);
  return statusMatch ? (statusMatch[1] as CloudflareStatuses) : "Unable";
};

const getConnectionStatus = (packetLoss: string | null, avgPing: string | null) => {
  if (!packetLoss || !avgPing || parseFloat(packetLoss) > 100) return "offline";
  if (parseFloat(packetLoss) > 3) return "bad";
  if (parseFloat(avgPing) > 200) return "bad";
  return "good";
};

const getConnectionStatusColor = (connectionStatus: ReturnType<typeof getConnectionStatus>) => {
  switch (connectionStatus) {
    case "good":
      return "#8AFF80";
    case "bad":
      return "#FFCA80";
    default:
      return "#FF9580";
  }
};

export default function Menubar() {
  const {
    isLoading: pingLoading,
    data: pingData,
    error: pingError,
  } = useExec("ping", ["-q", "-c", "3", "-W", "2", "one.one.one.one"], {
    onError: () => {},
    keepPreviousData: false,
  });

  const { isLoading: warpLoading, data: warpData } = useExec("warp-cli", ["status"]);

  const { isLoading: myIpLoading, data: myIp } = useExec("dig", [
    "+short",
    "myip.opendns.com",
    "@resolver1.opendns.com",
  ]);

  const isLoading = pingLoading || warpLoading || myIpLoading;
  const pingOutput = pingError?.message || pingData;
  const avgPing = parseAvgPing(pingOutput);
  const packetLoss = parsePacketLoss(pingOutput);
  const connectionStatus = getConnectionStatus(packetLoss, avgPing);
  const connectionStatusColor = getConnectionStatusColor(connectionStatus);
  const isOnline = connectionStatus !== "offline";
  const cloudflareStatus = parseCloudflareConnectionStatus(warpData);

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
        <MenubarStatusSection avgPing={avgPing} isOnline={isOnline} packetLoss={packetLoss} myIp={myIp} />
      )}

      {!!warpData && <MenubarCloudflareSection warpData={warpData} />}
    </MenuBarExtra>
  );
}
