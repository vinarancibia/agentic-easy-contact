import { Request, Response } from "express";
import agentMaria from "../agents/maria";
import { requestFilter, sendMessage } from "../helpers/message";
import { ContentStore } from "../interfaces/message";
import { monitorWebHook } from "../helpers/webhook";

const contentStore: ContentStore = {};

export const chatMaria = async (req: Request, res: Response) => {
    const {accountId, conversationId, messageType, content} = await requestFilter(req.body);
    // await monitorWebHook(req.body);
    const key = `${accountId}:${conversationId}`;

    if (messageType === 'incoming') {
        if (contentStore[key]) contentStore[key].content += ` ${content}`;
        else contentStore[key] = { content };
        if (contentStore[key].timer) clearTimeout(contentStore[key].timer);
        contentStore[key].timer = setTimeout(async() => {
            const result = await agentMaria.invoke(
                { messages: [{ role: "user", content: contentStore[key].content }] },
                { configurable: { 
                    thread_id: conversationId,
                    accountId,
                    conversationId
                } }
            );
            const message = result.messages[result.messages.length - 1].content as string;
            // const {imageUrl} = result.structuredResponse;
            await sendMessage({accountId, conversationId, message});

            console.log(`💬(${key}):`, contentStore[key].content);
            console.log("🤖:", message);

            
            // console.log('<------------ structuredResponse ---------------->')
            // console.log(imageUrl)
            // console.log('<------------ structuredResponse ---------------->')

            contentStore[key].content = '';
        }, 5000);
        res.json({ message_type: 'incoming' });
    }else res.json({ message_type: 'outgoing' });
}
