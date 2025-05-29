## Usage

MCP servers are configured differently depending on the client you are using. Below is how you would configure it for Claude Desktop.

Claude Desktop uses a configuration (claude.config.json) file to launch MCP servers. If the file does not exist in your PC, you need to create it manually. The location depends on your operating system:

- `%APPDATA%/claude/claude.config.json` (Windows)
- `~/.config/claude/claude.config.json` (Linux/macOS)

Add the following content to the file, replacing `<FULL_PATH_TO_REPO>` with the absolute path where you cloned this repository:

```json
{
  "mcpServers": {
    "todoapi-mcp": {
      "command": "node",
      "args": [
        "<FULL_PATH_TO_REPO>/TodoApi MCP/dist/server.js"
      ],
      "cwd": "<FULL_PATH_TO_REPO>/TodoApi MCP"
    }
  }
}
```

Run and build the MCP with the following commands:
- `npm install`
- `npm run build`

Requirements:

-Node.js installed (node -v)
-dist/server.js built
-The Todo API running locally via HTTPS (e.g., https://localhost:7027) 

For instructions on how to run the Todo API that this MCP interacts with, check the [README in the TodoApi folder](../TodoApi/README.md).


After launching Claude Desktop, it will automatically start the MCP server.




