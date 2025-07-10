import { Request, Response } from "express";
import agentMaria from "../agents/maria";
import { sendMessage } from "../helpers/message";


export const chatAgent = async (req: Request, res: Response) => {
    const { account, conversation, message_type, content, content_type } = req.body;
    const accountId = parseInt(account.id);
    const conversationId = parseInt(conversation.id);
    console.log('Prueba...')

    if (message_type === 'incoming') {
        const result = await agentMaria.invoke(
            { messages: [{ role: "user", content }] },
            { configurable: { thread_id: conversationId.toString() } }
        );
        const message = result.messages[result.messages.length - 1].content as string;
        
        await sendMessage({accountId, conversationId, message});
    }
}