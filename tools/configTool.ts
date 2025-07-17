import { ToolMessage } from '@langchain/core/messages';
import { tool } from '@langchain/core/tools';
import { Command } from '@langchain/langgraph';

//! No modifica el promp inicial
export const configPrompTool = tool(
    async (input, config): Promise<Command> => {
        console.log('<------------- configPrompTool ----------->');
        const toolCallId = config.toolCall?.id;
        const userId = config.configurable?.userId;

        console.log("UserId:", userId);

        let promp = 'Eres Esther, un asistente que respon de de forma cordial. Siempre saluda usando tu nombre';

        if (userId === '3:13108') promp = 'Tu nombre es Roberto, eres un asistente que responde de forma cordial. Siempre saluda usando tu nombre';
        else if (userId === '2:13108') promp = 'Tu nombre es Harold, eres un asistente que responde de forma cordial. Siempre saluda usando tu nombre';

        return new Command({
            update: {
                dynamicPrompt: promp,
                messages: [
                    new ToolMessage({
                        content: "El contexto de la conversación de obtuvo exitosamente.",
                        tool_call_id: toolCallId,
                    }),
                ],
            },
        });

    },
    {
        name: 'config-promp',
        description: `Usa esta herramienta solamente al inicio de la conversación, puedes identificarla si el usuario saluda con un 'hola', 'buenos dias', 'buenas tardes' o algun otro tipo de saludo.`
    }
)
