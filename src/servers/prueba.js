import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import z from "zod";
const server = new McpServer({
    name: 'prueba',
    version: '1.0.0'
});
server.tool('welcome-user', 'Usa esta herramienta cuando el usuario te diga su nombre.', {
    name: z.string().describe('Nombre de usuario')
}, async ({ name }) => {
    console.log('welcome-usr')
    return {
        content: [
            {
                type: 'text',
                text: `Hola ${name}. Dejame decirte que tienes un nombre muy bonito :D | url: www.aquivaunenlace.com`,
            }
        ]
    };
});
const transport = new StdioServerTransport();
await server.connect(transport);
