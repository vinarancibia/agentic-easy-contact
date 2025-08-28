import { Request, Response } from "express";
import { getPromptAndToken } from "../helpers/configAgent.js";
import agentRemarketing from "../agents/remarketing.js";
import { MESSAGE_SUB_TYPE, sendMessage } from "../helpers/message.js";

export const main = async (req: Request, res: Response) => {
    const {
        account, inbox, conversation,
        behavior_remarketing
    } = req.body;
    const { accessToken } = await getPromptAndToken({ accountId: account.id, inboxId: inbox.id });
    const key = `${account.id}:${conversation.id}`;
    const result = await agentRemarketing.invoke(
        { messages: [] },
        {
            configurable: {
                thread_id: key,
                accountId: account.id,
                conversationId: conversation.id,
                dynamicPrompt: behavior_remarketing,
            }
        }
    );
    const message = result.messages[result.messages.length - 1].content as string;
    if (message !== '#') {
        await sendMessage({
            accountId: account.id,
            conversationId: conversation.id,
            message: message,
            accessToken,
            messageSubType: MESSAGE_SUB_TYPE.REMARKETING
        });
    }
    res.json({ ok: true });
}



