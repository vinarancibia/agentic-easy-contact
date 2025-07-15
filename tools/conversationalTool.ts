import { tool } from '@langchain/core/tools';
import axios from 'axios';
import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

export const contextMessageTool = tool(
    async (input, config) => {
        console.log('<------------- contextMessageTool ----------->');
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
            const { payload }:{payload: Array<Record<string, any>>} = response.data;
            let userMessages: string = '';
            for (let i = 0; i < payload.length; i++) {
                if(payload[i]?.sender?.type === 'contact')
                userMessages += payload[i].content + '\n';
            }
            return userMessages;
            
        } catch (error) {
            console.error('❌ Error al obtener contexto:');
            console.log(error);
            return 'Sin contexto'
        }
    },
    {
        name: 'context-message',
        description: "Usa esta herramienta para tener un contexto de la conversacion. Puedes identificar esto si el usuario te saluda con frases como 'hola', 'buenos días', 'buenas tardes', entre otras formas comunes de saludo. Usa solamente su nombre para saludarlo y de manera cordial. Por ejemplo: 'Hola Juan 😊, que gusto volver a hablar contigo ¿En que puedo ayudarte el dia de hoy?'"
    }
)

export const greetingsListTool = tool(
    async (input, config) => {
        console.log('<------------- greetingsListTool ----------->');
        const list = [
                `¡Hola! 😊 Soy Carolina, asesora comercial de EasyContact.
                Estoy para ayudarte a entender cómo nuestra plataforma puede simplificar tu atención al cliente y ahorrarte tiempo desde el primer día.`,
                `¡Hola! Soy Carolina, asesora en EasyContact 🚀  
                Estoy para ayudarte a conocer cómo centralizar todos tus canales de atención y automatizar lo repetitivo con IA.`,
                `¡Hola! Qué gusto saludarte 👋 Soy Carolina, asesora comercial de EasyContact.  
                ¿Querés que te muestre cómo podemos ayudarte a responder más rápido y organizar mejor tus conversaciones?`,
                `¡Hola! Soy Carolina, de EasyContact 😊  
                Estoy acá para acompañarte y mostrarte cómo podés mejorar la atención al cliente con una sola herramienta fácil de usar.`,
                `¡Hola! Gracias por escribirnos 🙌 Soy Carolina, asesora de EasyContact.  
                ¿Querés que te cuente cómo funciona y cómo podrías aprovecharlo en tu empresa?`
            ]
        const randomGreeting = list[Math.floor(Math.random() * list.length)];

        return randomGreeting;
    },
    {
        name:'greetings-list',
        description: 'Usa esta herramienta solamente cuando no tengas un contexto de la conversacio. Esta herramienta te dara un ejemplo de saludo que puedes usar'
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
