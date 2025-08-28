import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt"
import { contextMessageTool, getCurrentDateTimeTool } from "../tools/conversationalTool.js";
import { BaseMessageLike } from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";
import { MessagesAnnotation } from "@langchain/langgraph";

const prompt = (
    state: typeof MessagesAnnotation.State,
    config: RunnableConfig
): BaseMessageLike[] => {
    const dynamicPrompt = config.configurable?.dynamicPrompt;
    return [{ role: "system", content: dynamicPrompt }, ...state.messages];
};

const llm = new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 });

const agentRemarketing = createReactAgent({
    llm,
    tools: [contextMessageTool, getCurrentDateTimeTool],
    prompt
})

export default agentRemarketing