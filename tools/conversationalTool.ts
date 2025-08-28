import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { DateTime } from 'luxon';

import axios from 'axios';
import dotenv from 'dotenv';
import { Command, LangGraphRunnableConfig } from '@langchain/langgraph';
import { ToolMessage } from '@langchain/core/messages';
dotenv.config();


// Herramienta que el agente usa al inicio para tener un contexto de la conversacion.
export const contextMessageTool = tool(
    async (input, config) => {
        console.log('<------------- contextMessageTool ----------->');
        const accountId = config.configurable?.accountId;
        const conversationId = config.configurable?.conversationId;

        const api = process.env.API_EASY_CONTACT;
        const url = `${api}/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`;
        const apiAccessToken = process.env.API_ACCESS_TOKEN;

        try {
            const response = await axios.get(url, {
                headers: {
                    'api_access_token': apiAccessToken,
                    'Content-Type': 'application/json'
                }
            })
            const { payload }: { payload: Array<Record<string, any>> } = response.data;
            let contextMessages: string = '';
            let usersOutgoing = ["user", "agent_bot"]
            for (let i = 0; i < payload.length; i++) {
                if (payload[i]?.sender?.type === 'contact') contextMessages += 'usuario: ' + payload[i].content + '\n';
                else if (usersOutgoing.includes(payload[i]?.sender?.type)) contextMessages += 'tu: ' + payload[i].content + '\n';
            }
            return contextMessages;

        } catch (error) {
            console.error('❌ Error al obtener contexto:');
            return 'Sin contexto'
        }
    },
    {
        name: 'context-message',
        description: "Usa esta herramienta para obtener el contexto de la conversacion mediante un historial de conversacion con el usuario. Si no se encuentra nada relevante, solamente da un saludo cordial.",
    }
)

// Guarda el contexto en las configuraciones del agente.
export const contextMessageToolToConfig = tool(
    async ( input, config ): Promise<Command> => {
        console.log('<------------- contextMessageToolToConfig ----------->');
        const accountId = config.configurable?.accountId;
        const conversationId = config.configurable?.conversationId;
        // const userId = config.configurable?.userId;
        const toolCallId = config.toolCall?.id;

        const api = process.env.API_EASY_CONTACT;
        const url = `${api}/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`;
        const apiAccessToken = process.env.API_ACCESS_TOKEN;

        try {
            const response = await axios.get(url, {
                headers: {
                    'api_access_token': apiAccessToken,
                    'Content-Type': 'application/json'
                }
            })
            const { payload }: { payload: Array<Record<string, any>> } = response.data;
            let newContext: string = '';
            for (let i = 0; i < payload.length; i++) {
                if (payload[i]?.sender?.type === 'contact') newContext += 'usuario: ' + payload[i].content + '\n';
                else if (payload[i]?.sender?.type === 'user') newContext += 'tu: ' + payload[i].content + '\n';
            }
            return new Command({
                update: {
                    context: newContext,
                    messages: [
                        new ToolMessage({
                            content: "El contexto de la conversación de obtuvo exitosamente.",
                            tool_call_id: toolCallId,
                        }),
                    ],
                },
            });

        } catch (error) {
            console.error('❌ Error al obtener contexto:');
            console.log(error);
            return new Command({
                update: {
                    context: '',
                    messages: [
                        new ToolMessage({
                            content: "No se pudo obtener el contexto de la conversación.",
                            tool_call_id: toolCallId,
                        }),
                    ],
                },
            });
        }
    },
    {
        name: 'get-context',
        description: "Usa esta herramienta para obtener el contexto de la conversación."
    }
)

//! Modificar, ya que los saludos iniciales estan con Crolina, y eso tiene que ser dinamico
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
        name: 'greetings-list',
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

export const getCurrentDateTimeTool = tool(
    async () => {
        console.log('<------------- contextMessageTool ----------->');
        const now = DateTime.now().setZone('America/La_Paz');
        return `La fecha y hora actual en Bolivia es: ${now.toFormat("dd 'de' LLLL yyyy, HH:mm:ss")}`;
    },
    {
        name: 'get-current-datetime',
        description: 'Devuelve la fecha y hora actual considerando la zona horaria de Bolivia (UTC-4).',
        schema: z.object({})
    }
);

