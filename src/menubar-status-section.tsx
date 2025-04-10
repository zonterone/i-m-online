import { MenuBarExtra } from "@raycast/api";

export default function MenubarStatusSection({
  isOnline,
  avgPing,
  packetLoss,
}: {
  isOnline: boolean;
  avgPing: string | null;
  packetLoss: string | null;
}) {
  return (
    <MenuBarExtra.Section title={isOnline ? "You're Online!" : "You're Offline!"}>
      <MenuBarExtra.Item title={`Last Check: ${new Date().toLocaleTimeString()}`} />
      {!!avgPing && <MenuBarExtra.Item title={`Avg Ping: ${avgPing}ms`} />}
      {!!packetLoss && <MenuBarExtra.Item title={`Packet Loss: ${packetLoss}%`} />}
    </MenuBarExtra.Section>
  );
}
