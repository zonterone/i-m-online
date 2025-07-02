/**
 * Types for Cloudflare connection statuses
 */
export type CloudflareStatuses = "Connected" | "Connecting" | "Disconnected" | "Unable";

/**
 * Connection status types
 */
export type ConnectionStatus = "good" | "bad" | "offline";

/**
 * Parses the average ping from ping command output
 * @param data - Output from ping command
 * @returns Average ping value or null if not found
 */
export const parseAvgPing = (data: string | undefined): string | null => {
  if (!data) return null;
  const avgPingRegex = /avg\/max\/stddev = [\d.]+\/([\d.]+)\/[\d.]+\/[\d.]+ ms/;
  const match = data.match(avgPingRegex);
  return match ? match[1] : null;
};

/**
 * Parses packet loss percentage from ping command output
 * @param data - Output from ping command
 * @returns Packet loss percentage or null if not found
 */
export const parsePacketLoss = (data: string | undefined): string | null => {
  if (!data) return null;
  const packetLossRegex = /([\d.]+)% packet loss/;
  const packetLossMatch = data.match(packetLossRegex);
  return packetLossMatch ? packetLossMatch[1] : null;
};

/**
 * Parses Cloudflare connection status from warp-cli output
 * @param string - Output from warp-cli command
 * @returns Cloudflare connection status
 */
export const parseCloudflareConnectionStatus = (string: string | undefined): CloudflareStatuses => {
  if (!string) return "Unable";
  const statusRegex = /Status update: (\w+)/;
  const statusMatch = string.match(statusRegex);
  return statusMatch ? (statusMatch[1] as CloudflareStatuses) : "Unable";
};

/**
 * Determines connection status based on packet loss and average ping
 * @param packetLoss - Packet loss percentage
 * @param avgPing - Average ping in ms
 * @returns Connection status (good, bad, or offline)
 */
export const getConnectionStatus = (packetLoss: string | null, avgPing: string | null): ConnectionStatus => {
  if (!packetLoss || !avgPing || parseFloat(packetLoss) >= 90) return "offline";
  if (parseFloat(packetLoss) > 3) return "bad";
  if (parseFloat(avgPing) > 200) return "bad";
  return "good";
};

/**
 * Gets color for connection status
 * @param connectionStatus - Connection status
 * @returns Color for the status
 */
export const getConnectionStatusColor = (connectionStatus: ConnectionStatus): string => {
  switch (connectionStatus) {
    case "good":
      return "#8AFF80";
    case "bad":
      return "#FFCA80";
    default:
      return "#FF9580";
  }
};
