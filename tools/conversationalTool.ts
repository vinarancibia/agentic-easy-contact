import { tool } from '@langchain/core/tools';
import axios from 'axios';
import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

export const contextMessageTool = tool(
    async (input, config) => {
        const { accountId, conversationId } = config.configurable;
        const url = `https://easycontact.top/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`;
        const apiAccessToken = process.env.API_ACCESS_TOKEN;
        try {
            const response = await axios.get(url, {
                headers: {
                    'api_access_token': apiAccessToken,
                    'Content-Type': 'application/json'
                }
            })
            const { data } = response;
            return JSON.stringify(data);
        } catch (error) {
            console.error('❌ Error al obtener mensajes:', error);
            return `No se encontro un historial de la conversacion`;
        }
    },
    {
        name: 'context-message',
        description: 'Usa esta herramienta al inicio de una conversacio, es decir, cuando detectes algun tipo de saludo por parte del usuario. Esta herramienta te mostrara el historial de conversaciones que tuviste con el usuario. Si te dijo su nombre usalo para respondele, si antes tuvo alguna duda o problema y no se termino resolviendo preguntale como le fue con ese problema, o si necesita mas ayuda al respecto, si encuentras algo relevante en la conversacion puedes usarlo para darle una respuesta mas personalizada. En caso de no tener un historial previo simplemente saluda de forma cordial.'
    }
)

export const userInfoTool = tool(
    async (input, config) => {
        const { accountId, conversationId } = config.configurable;
        return `El ID de tu cuenta es *${accountId}* y el de esta conversacion es *${conversationId}*`;
    },
    {
        name: 'user-info',
        description: 'Usa esta herramienta cuando el usuario te pida su informacion.',
        schema: z.object({})
    }
);
