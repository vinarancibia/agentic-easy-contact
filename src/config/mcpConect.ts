import { MultiServerMCPClient } from "@langchain/mcp-adapters";

export const mcpClient = new MultiServerMCPClient({
    mcpServers: {
        "prueba": {
            command: "node",
            args: ["src/servers/prueba.js"],
            transport: "stdio"
        }
    }
})