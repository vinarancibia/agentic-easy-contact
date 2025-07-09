import { Request, Response } from "express";
import agentMaria from "../agents/maria";


export const chatAgent = async (req: Request, res: Response) => {
    const { message } = req.body;
    if (!message) {
        res.json({ msg: 'Por favor, envia un mensaje con la sintaxis correcta.' });
        return;
    }

    const result = await agentMaria.invoke(
        { messages: [{ role: "user", content: message }] },
        { configurable: { thread_id: "user1" } }
    );

    const msg = result.messages[result.messages.length - 1].content;

    res.json({
        msg
    })
}