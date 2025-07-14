import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt"
import { MemorySaver } from '@langchain/langgraph';
import { contextMessageTool, userInfoTool } from "../tools/conversationalTool";
import { consultCatalogTool, consultCodeCatalogTool, searchImageCatalogTool } from "../tools/consultTool";
import z from "zod";


const llm = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 });
const prompt = "Tu nombre es María. Cuando te saluden recuerda decirles tu nombre, además eres un agente que responde de manera concisa y clara.";
// const responseFormat = z.object({
//     imageUrl: z.string().describe('URL valido la imagen obtenida. Si no tienes la url valida solo envia un mensaje vacio.')
// })

const agentMaria = createReactAgent({
    llm,
    tools:
        [
            userInfoTool,
            // contextMessageTool,
            consultCatalogTool,
            searchImageCatalogTool,
            consultCodeCatalogTool
        ],
    prompt,
    checkpointSaver: new MemorySaver(),
    // responseFormat
})

export default agentMaria