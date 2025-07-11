import { Request, Response } from "express";
import agentMaria from "../agents/maria";
import { sendMessageToChat } from "../helpers/message";
import { ContentStore } from "../interfaces/message";

const contentStore: ContentStore = {};

export const chatMaria = async (req: Request, res: Response) => {
    const { account, conversation, message_type, content } = req.body;
    const accountId = parseInt(account.id);
    const conversationId = parseInt(conversation.id);
    const key = `${accountId}:${conversationId}`;

    if (message_type === 'incoming') {
        // El content se carga en el contentStore e inicia el temporizador, este termina cuando dejan de llegar mensajes del mismo chat
        if (contentStore[key]) contentStore[key].content += ` ${content}`;
        else contentStore[key] = { content };
        if (contentStore[key].timer) clearTimeout(contentStore[key].timer);
        contentStore[key].timer = setTimeout(async() => {
            const result = await agentMaria.invoke(
                { messages: [{ role: "user", content: contentStore[key].content }] },
                { configurable: { thread_id: conversationId.toString() } }
            );
            const message = result.messages[result.messages.length - 1].content as string;
            // await sendMessageToChat({accountId, conversationId, message});
        
            console.log(`💬(${key}):`, contentStore[key].content);
            console.log("🤖:", message);
            contentStore[key].content = '';
        }, 5000);
        res.json({ message_type: 'incoming' });
    }else res.json({ message_type: 'outgoing' });
}
