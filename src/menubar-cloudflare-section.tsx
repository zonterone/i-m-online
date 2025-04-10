import { MenuBarExtra, open } from "@raycast/api";
import { useExec } from "@raycast/utils";
import { CloudflareStatuses } from "./menubar";

const parseCloudflareConnectionStatus = (string: string | undefined) => {
  if (!string) return "Unable";
  const statusRegex = /Status update: (\w+)/;
  const statusMatch = string.match(statusRegex);
  return statusMatch ? (statusMatch[1] as CloudflareStatuses) : "Unable";
};

const cloudflareActionByStatus = new Map<CloudflareStatuses, string>([
  ["Connected", "Disconnect"],
  ["Disconnected", "Connect"],
  ["Connecting", "Connecting"],
  ["Unable", "Disconnect"],
]);

export default function MenubarCloudflareSection({ warpData }: { warpData: string }) {
  const { revalidate: connect } = useExec("warp-cli", ["connect"], {
    keepPreviousData: false,
    execute: false,
  });

  const { revalidate: disconnect } = useExec("warp-cli", ["disconnect"], {
    keepPreviousData: false,
    execute: false,
  });

  const cloudflareStatus = parseCloudflareConnectionStatus(warpData);

  const cloudflareHandler = (status: Exclude<CloudflareStatuses, "Connecting" | "Unable">) => {
    status === "Connected" ? disconnect() : connect();
  };

  return (
    <>
      <MenuBarExtra.Section title={`WARP: ${cloudflareStatus}`}>
        <MenuBarExtra.Item
          title={cloudflareActionByStatus.get(cloudflareStatus) ?? "Unknown"}
          onAction={
            cloudflareStatus && cloudflareStatus !== "Connecting" && cloudflareStatus !== "Unable"
              ? () => cloudflareHandler(cloudflareStatus)
              : undefined
          }
        />
        <MenuBarExtra.Item title="Open App" onAction={() => open("_", "/Applications/Cloudflare WARP.app")} />
      </MenuBarExtra.Section>

      <MenuBarExtra.Section>
        <MenuBarExtra.Item title="Cloudflare Speedtest" onAction={() => open("https://speed.cloudflare.com/")} />
      </MenuBarExtra.Section>
    </>
  );
}
