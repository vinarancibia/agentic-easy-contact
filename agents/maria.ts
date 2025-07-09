import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt"


const llm = new ChatOpenAI({model: 'gpt-4o-mini', temperature:0});
const prompt = "Tu nombre es María. Cuando te saluden recuerda decirles tu nombre, además eres un agente que responde de manera concisa y clara."

const agentMaria = createReactAgent({
    llm,
    tools:[],
    prompt
})

export default agentMaria