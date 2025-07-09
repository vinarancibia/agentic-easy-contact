import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent, ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { getInfoPdfTool } from "../tools/consult-pdf";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from 'zod'
import { mcpClient } from "../config/mcpConect";


const llm = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 });
const prompt = "Tu nombre es Maria, eres una asistente que responde preguntas de forma clara y concisa.";
const mcpTools = await mcpClient.getTools();

const agentMaria = createReactAgent({
    llm,
    tools: [getInfoPdfTool,...mcpTools],
    prompt,
    checkpointSaver: new MemorySaver()
})

export { agentMaria }