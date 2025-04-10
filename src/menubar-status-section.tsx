import { MenuBarExtra } from "@raycast/api";

export default function MenubarStatusSection({
  myIp,
  isOnline,
  avgPing,
  packetLoss,
}: {
  myIp: string | undefined;
  isOnline: boolean;
  avgPing: string | null;
  packetLoss: string | null;
}) {
  return (
    <MenuBarExtra.Section title={isOnline ? "You're Online!" : "You're Offline!"}>
      {!!myIp && <MenuBarExtra.Item title={`My IP: ${myIp}`} />}
      {!!avgPing && <MenuBarExtra.Item title={`Avg Ping: ${avgPing}ms`} />}
      {!!packetLoss && <MenuBarExtra.Item title={`Packet Loss: ${packetLoss}%`} />}
      <MenuBarExtra.Item title={`Last Check: ${new Date().toLocaleTimeString()}`} />
    </MenuBarExtra.Section>
  );
}
