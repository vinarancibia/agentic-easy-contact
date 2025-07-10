import { Request, Response } from "express";
import agentMaria from "../agents/maria";


export const chatAgent = async (req: Request, res: Response) => {
    const { message, messages,  data} = req.body;

    console.log("------- DATA -------");
    console.log(data);
    console.log("------- DATA -------");


    // if (!message) {
    //     res.json({ msg: 'Por favor, envia un mensaje con la sintaxis correcta.' });
    //     return;
    // }
    // const result = await agentMaria.invoke(
    //     { messages: [{ role: "user", content: message }] },
    //     { configurable: { thread_id: "user1" } }
    // );

    // const msg = result.messages[result.messages.length - 1].content;

    //* {content}

    res.json({
        msg:"Msg Generico"
    })
}