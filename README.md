# rcp-cli

CLI tool to search and retrieve corporate entity information from the **Puerto Rico Department of State's Registry of Corporations (RCP)**.

## Features

- **Search** corporations by name or registration number
- **Info** — get detailed information about a specific corporation by ID
- JSON output by default (pipe-friendly)

## Installation

```bash
npm install -g rcp-cli
```

Or run directly:

```bash
npx rcp-cli search "Acme Corp"
```

## Usage

```
rcp <command> [options]

Commands:
  search <query>    Search corporations by name or registration number
  info <id>         Get detailed information about a corporation by its ID

Options:
  --json            Output as JSON (default: true)
  --help            Show help
```

### Examples

```bash
# Search for a corporation
rcp search "ABC Construction"

# Get info by corporation ID
rcp info 412345
```

## How it works

The RCP website (`rceapi.estado.pr.gov`) is protected by Cloudflare. This tool uses **Puppeteer** (headless browser) to bypass Cloudflare's challenge and then makes the actual API calls from within the browser context.

## License

MIT
