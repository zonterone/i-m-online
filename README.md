# I'm Online?

A Raycast extension that checks your internet connectivity status and provides useful information in the menu bar.

## Features

- Displays internet connectivity status in the menu bar
- Shows your public IP address
- Monitors ping and packet loss to Cloudflare DNS (1.1.1.1)
- Integrates with Cloudflare WARP for VPN status and control
- Updates every 10 seconds

## Requirements

- Raycast
- macOS
- Cloudflare WARP (optional, for VPN functionality)

## Usage

After installation, the extension will appear in your menu bar with a lock icon that changes color based on your connection status:

- Green: Good connection
- Orange: Poor connection (high ping or packet loss)
- Red: No connection

Click on the icon to see more details about your connection and to control Cloudflare WARP if installed.
