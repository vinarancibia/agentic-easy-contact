import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt"
import { Annotation, MemorySaver, MessagesAnnotation } from '@langchain/langgraph';
import { contextMessageTool, getCurrentDateTimeTool, greetingsListTool } from "../tools/conversationalTool.js";
import { consultCatalogTool, consultCodeCatalogTool, consultImageCatalogTool } from "../tools/consultTool.js";
import z from "zod";
import { RunnableConfig } from "@langchain/core/runnables";
import { BaseMessageLike } from "@langchain/core/messages";
import { configPrompTool } from "../tools/configTool.js";



// const responseFormat = z.object({
//     imageUrl: z.string().describe('URL valido la imagen obtenida. Si no tienes la url valida solo envia un mensaje vacio.')
// })

const CustomState = Annotation.Root({
  ...MessagesAnnotation.spec,
  cnotext: Annotation<string>(),
});

const prompt = (
    state: typeof MessagesAnnotation.State,
    config: RunnableConfig
): BaseMessageLike[] => {
    const dynamicPrompt = config.configurable?.dynamicPrompt;
    const systemMsg = dynamicPrompt;
    return [{ role: "system", content: systemMsg }, ...state.messages];
};

const llm = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 });

const agentMaria = createReactAgent({
    llm,
    tools:
        [
            contextMessageTool,
            getCurrentDateTimeTool,
            greetingsListTool,
            consultCatalogTool,
            consultImageCatalogTool,
            consultCodeCatalogTool
        ],
    prompt,
    checkpointSaver: new MemorySaver(),
    stateSchema: CustomState,
})

export default agentMaria