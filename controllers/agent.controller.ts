import { Request, Response } from "express";
import agentMaria from "../agents/maria.js";
import { requestFilter, sendMessage } from "../helpers/message.js";
import { ContentStore } from "../interfaces/message.js";
import { monitorWebHook } from "../helpers/webhook.js";
import { getPromptAndToken } from "../helpers/configAgent.js";

const contentStore: ContentStore = {};

export const chatAgent = async (req: Request, res: Response) => {
    const {accountId, inboxId, conversationId, messageType, content, activeAgentBot} = await requestFilter(req.body);    
    // await monitorWebHook(req.body);
    const key = `${accountId}:${conversationId}`;
    
    if (messageType === 'incoming' && activeAgentBot && (content.trim() !== '')) {
        const {prompt, accessToken} = await getPromptAndToken({accountId, inboxId});
        if (contentStore[key]) contentStore[key].content += ` ${content}`;
        else contentStore[key] = { content };
        if (contentStore[key].timer) clearTimeout(contentStore[key].timer);
        contentStore[key].timer = setTimeout(async() => {
            const result = await agentMaria.invoke(
                { messages: [{ role: "user", content: contentStore[key].content }] },
                { configurable: { 
                    thread_id: key,
                    accountId,
                    conversationId,
                    accessToken,
                    dynamicPrompt: prompt
                } }
            );
            const message = result.messages[result.messages.length - 1].content as string;
            // await sendMessage({accountId, conversationId, message, accessToken});
            console.log(`💬(${key}):`, contentStore[key].content);
            console.log("🤖:", message);
            contentStore[key].content = '';
        }, 3000);
        res.json({ message_type: 'incoming' });
    }else res.json({ message_type: 'outgoing' });
}
