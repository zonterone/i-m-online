import { MenuBarExtra } from "@raycast/api";

export default function MenubarStatusSection({
  myIp,
  isOnline,
  avgPing,
  packetLoss,
  connectTime,
  totalTime,
  ttfbTime,
}: {
  myIp: string | undefined;
  isOnline: boolean;
  avgPing: string | null;
  packetLoss: string | null;
  connectTime: number | null;
  totalTime: number | null;
  ttfbTime: number | null;
}) {
  return (
    <MenuBarExtra.Section title={isOnline ? "You're Online!" : "You're Offline!"}>
      {!!myIp && <MenuBarExtra.Item title={`My IP: ${myIp}`} />}
      {!!connectTime && <MenuBarExtra.Item title={`Connect Time: ${connectTime.toFixed(2)}ms`} />}
      {!!ttfbTime && <MenuBarExtra.Item title={`TTFB: ${ttfbTime.toFixed(2)}ms`} />}
      {!!totalTime && <MenuBarExtra.Item title={`Total Time: ${totalTime.toFixed(2)}ms`} />}
      {!!avgPing && <MenuBarExtra.Item title={`Avg Ping: ${avgPing}ms`} />}
      {!!packetLoss && <MenuBarExtra.Item title={`Packet Loss: ${packetLoss}%`} />}
      <MenuBarExtra.Item title={`Last Check: ${new Date().toLocaleTimeString()}`} />
    </MenuBarExtra.Section>
  );
}
