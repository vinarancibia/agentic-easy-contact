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
        description: "Usa esta herramienta para tener un contexto de la conversacion. Puedes identificar esto si el usuario te saluda con frases como 'hola', 'buenos días', 'buenas tardes', entre otras formas comunes de saludo. Usa su nombre para saludarlo y de manera cordial preguntale en que le puedes ayudar el dia de hoy, por ejemplo: 'Hola Juan, que gusto volver a hablar contigo ¿En que puedo ayudarte el dia de hoy?'"
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


// const payload: [
//     {
//       id: 80944,
//       content: 'puedes mostrarme una imagen del fiat?',
//       inbox_id: 58,
//       conversation_id: 13108,
//       message_type: 0,
//       content_type: 'text',
//       status: 'sent',
//       content_attributes: [Object],
//       created_at: 1752542237,
//       private: false,
//       source_id: null,
//       sender: [Object]
//     },
//     {
//       id: 80945,
//       content: 'Aún no cuento con una imagen del Fiat Pulse Drive. \n' +
//         '\n' +
//         'Si necesitas más información sobre este modelo o quieres explorar otras opciones, ¡estaré encantada de ayudarte! 😊',
//       inbox_id: 58,
//       conversation_id: 13108,
//       message_type: 1,
//       content_type: 'text',
//       status: 'read',
//       content_attributes: {},
//       created_at: 1752542257,
//       private: false,
//       source_id: null,
//       sender: [Object]
//     },
//     {
//       id: 81201,
//       content: '¡Hola! 😊 Soy Carolina, asesora comercial de EasyContact.  \n' +
//         'Estoy aquí para ayudarte a entender cómo nuestra plataforma puede simplificar tu atención al cliente y ahorrarte tiempo desde el primer día. \n' +
//         '\n' +
//         '¿Me podrías contar el nombre de tu empresa y en qué rubro trabaja?',
//       inbox_id: 58,
//       conversation_id: 13108,
//       message_type: 1,
//       content_type: 'text',
//       status: 'read',
//       content_attributes: {},
//       created_at: 1752589773,
//       private: false,
//       source_id: null,
//       sender: [Object]
//     },
//     {
//       id: 81203,
//       content: 'Claro, puedo ayudarte con eso. 🚗 \n' +
//         '\n' +
//         '¿Tienes algún modelo o marca en mente que te gustaría considerar?',
//       inbox_id: 58,
//       conversation_id: 13108,
//       message_type: 1,
//       content_type: 'text',
//       status: 'read',
//       content_attributes: {},
//       created_at: 1752589810,
//       private: false,
//       source_id: null,
//       sender: [Object]
//     },
//     {
//       id: 81204,
//       content: 'Aquí tienes algunos de los autos que tenemos disponibles:\n' +
//         '\n' +
//         '1. **Ford EcoSport Titanium** 2022 - $18,500\n' +
//         '2. **Toyota Corolla SE** 2023 - $22,000\n' +
//         '3. **Honda Civic Touring** 2022 - $23,500\n' +
//         '4. **Toyota Rav4 XLE** 2023 - $29,000\n' +
//         '5. **Mazda 3 Hatchback** 2023 - $21,000\n' +
//         '6. **Chevrolet Onix Premier** 2023 - $16,500\n' +
//         '7. **Kia Seltos LX** 2023 - $22,500\n' +
//         '8. **Hyundai Tucson** 2023 - $28,000\n' +
//         '9. **Renault Kwid** 2022 - $9,800\n' +
//         '10. **Volkswagen Virtus Highline** 2023 - $19,500\n' +
//         '11. **Nissan Versa SR** 2023 - $17,900\n' +
//         '12. **Peugeot 208 Active** 2022 - $14,500\n' +
//         '13. **Fiat Pulse Drive** 2023 - $16,900\n' +
//         '14. **Suzuki Swift GLX** 2022 - $13,200\n' +
//         '15. **Jeep Renegade Longitude** 2023 - $26,500\n' +
//         '\n' +
//         '¿Hay algún modelo que te interese más o necesitas más información sobre alguno de ellos?',
//       inbox_id: 58,
//       conversation_id: 13108,
//       message_type: 1,
//       content_type: 'text',
//       status: 'read',
//       content_attributes: {},
//       created_at: 1752589845,
//       private: false,
//       source_id: null,
//       sender: [Object]
//     },
//     {
//       id: 81206,
//       content: '',
//       inbox_id: 58,
//       conversation_id: 13108,
//       message_type: 1,
//       content_type: 'text',
//       status: 'read',
//       content_attributes: {},
//       created_at: 1752589878,
//       private: false,
//       source_id: null,
//       sender: [Object],
//       attachments: [Array]
//     },
//     {
//       id: 81207,
//       content: 'Logré encontrar el auto que buscas: **Honda Civic Touring**, modelo 2022. Aquí tienes la imagen. \n' +
//         '\n' +
//         '¿Te gustaría saber más sobre este modelo o hay algo más en lo que pueda ayudarte?',
//       inbox_id: 58,
//       conversation_id: 13108,
//       message_type: 1,
//       content_type: 'text',
//       status: 'read',
//       content_attributes: {},
//       created_at: 1752589881,
//       private: false,
//       source_id: null,
//       sender: [Object]
//     },
//     {
//       id: 81208,
//       content: '',
//       inbox_id: 58,
//       conversation_id: 13108,
//       message_type: 1,
//       content_type: 'text',
//       status: 'read',
//       content_attributes: {},
//       created_at: 1752589928,
//       private: false,
//       source_id: null,
//       sender: [Object],
//       attachments: [Array]
//     },
//     {
//       id: 81209,
//       content: 'He encontrado el auto que buscas: **Renault Kwid**, modelo 2022. Aquí tienes la imagen. \n' +
//         '\n' +
//         '¿Te gustaría saber más sobre este modelo o hay algo más en lo que pueda ayudarte?',
//       inbox_id: 58,
//       conversation_id: 13108,
//       message_type: 1,
//       content_type: 'text',
//       status: 'read',
//       content_attributes: {},
//       created_at: 1752589931,
//       private: false,
//       source_id: null,
//       sender: [Object]
//     },
//     {
//       id: 81211,
//       content: '¡Hola! 😊 Soy Carolina, asesora comercial de EasyContact.  \n' +
//         'Estoy para ayudarte a entender cómo nuestra plataforma puede simplificar tu atención al cliente y ahorrarte tiempo desde el primer día. \n' +
//         '\n' +
//         '¿Me podrías contar el nombre de tu empresa y en qué rubro trabaja?',
//       inbox_id: 58,
//       conversation_id: 13108,
//       message_type: 1,
//       content_type: 'text',
//       status: 'read',
//       content_attributes: {},
//       created_at: 1752590344,
//       private: false,
//       source_id: null,
//       sender: [Object]
//     },
//     {
//       id: 81212,
//       content: 'No tengo información sobre tu identidad en este momento. Pero estoy aquí para ayudarte. ¿Te gustaría contarme el nombre de tu empresa y en qué sector trabajas? Esto me ayudará a ofrecerte una mejor asistencia. 😊',
//       inbox_id: 58,
//       conversation_id: 13108,
//       message_type: 1,
//       content_type: 'text',
//       status: 'read',
//       content_attributes: {},
//       created_at: 1752590385,
//       private: false,
//       source_id: null,
//       sender: [Object]
//     },
//     {
//       id: 81265,
//       content: '¡Hola! Soy Carolina, asesora comercial de EasyContact. ¿En qué puedo ayudarte hoy? 😊',
//       inbox_id: 58,
//       conversation_id: 13108,
//       message_type: 1,
//       content_type: 'text',
//       status: 'read',
//       content_attributes: {},
//       created_at: 1752593746,
//       private: false,
//       source_id: null,
//       sender: [Object]
//     },
//     {
//       id: 81266,
//       content: '¡Hola de nuevo! ¿Cómo puedo asistirte hoy? 😊',
//       inbox_id: 58,
//       conversation_id: 13108,
//       message_type: 1,
//       content_type: 'text',
//       status: 'read',
//       content_attributes: {},
//       created_at: 1752593779,
//       private: false,
//       source_id: null,
//       sender: [Object]
//     },
//     {
//       id: 81267,
//       content: 'No tengo acceso a tu información personal, pero estoy aquí para ayudarte con cualquier consulta que tengas. ¿Cómo te llamas y en qué puedo asistirte hoy? 😊',
//       inbox_id: 58,
//       conversation_id: 13108,
//       message_type: 1,
//       content_type: 'text',
//       status: 'read',
//       content_attributes: {},
//       created_at: 1752593801,
//       private: false,
//       source_id: null,
//       sender: [Object]
//     },
//     {
//       id: 81268,
//       content: '¡Hola! 😊 Soy Carolina, asesora comercial de EasyContact. Estoy aquí para ayudarte a entender cómo nuestra plataforma puede simplificar tu atención al cliente y ahorrarte tiempo desde el primer día.\n' +
//         '\n' +
//         '¿Me podrías contar el nombre de tu empresa y en qué rubro trabaja?',
//       inbox_id: 58,
//       conversation_id: 13108,
//       message_type: 1,
//       content_type: 'text',
//       status: 'read',
//       content_attributes: {},
//       created_at: 1752593832,
//       private: false,
//       source_id: null,
//       sender: [Object]
//     },
//     {
//       id: 81269,
//       content: '¡Encantada de conocerte, Rodrigo! 😊 \n' +
//         '\n' +
//         '¿Podrías contarme el nombre de tu empresa y en qué rubro trabaja? Esto me ayudará a ofrecerte una mejor asistencia.',
//       inbox_id: 58,
//       conversation_id: 13108,
//       message_type: 1,
//       content_type: 'text',
//       status: 'read',
//       content_attributes: {},
//       created_at: 1752593874,
//       private: false,
//       source_id: null,
//       sender: [Object]
//     },
//     {
//       id: 81270,
//       content: '¡Genial, Rodrigo! 🚗 \n' +
//         '\n' +
//         '¿Tienes en mente alguna marca o modelo específico que te gustaría explorar? O si prefieres, puedo mostrarte algunas opciones disponibles.',
//       inbox_id: 58,
//       conversation_id: 13108,
//       message_type: 1,
//       content_type: 'text',
//       status: 'read',
//       content_attributes: {},
//       created_at: 1752593904,
//       private: false,
//       source_id: null,
//       sender: [Object]
//     },
//     {
//       id: 81273,
//       content: '¡Hola! 😊 Soy Carolina, asesora comercial de EasyContact. Estoy aquí para ayudarte a entender cómo nuestra plataforma puede simplificar tu atención al cliente y ahorrarte tiempo desde el primer día.\n' +
//         '\n' +
//         '¿Me podrías contar el nombre de tu empresa y en qué rubro trabaja? Esto me ayudará a ofrecerte una mejor asistencia.',
//       inbox_id: 58,
//       conversation_id: 13108,
//       message_type: 1,
//       content_type: 'text',
//       status: 'read',
//       content_attributes: {},
//       created_at: 1752593991,
//       private: false,
//       source_id: null,
//       sender: [Object]
//     },
//     {
//       id: 81278,
//       content: 'Lamento no tener acceso a tu información personal, pero estoy aquí para ayudarte con cualquier consulta que tengas. 😊 \n' +
//         '\n' +
//         '¿Te gustaría contarme el nombre de tu empresa y en qué sector trabajas? Esto me permitirá ofrecerte una mejor asistencia.',
//       inbox_id: 58,
//       conversation_id: 13108,
//       message_type: 1,
//       content_type: 'text',
//       status: 'read',
//       content_attributes: {},
//       created_at: 1752594086,
//       private: false,
//       source_id: null,
//       sender: [Object]
//     },
//     {
//       id: 81282,
//       content: '¡Hola! 😊 Soy Carolina, asesora comercial de EasyContact. Estoy aquí para ayudarte a entender cómo nuestra plataforma puede simplificar tu atención al cliente y ahorrarte tiempo desde el primer día.\n' +
//         '\n' +
//         '¿Me podrías contar el nombre de tu empresa y en qué rubro trabaja? Esto me ayudará a ofrecerte una mejor asistencia.',
//       inbox_id: 58,
//       conversation_id: 13108,
//       message_type: 1,
//       content_type: 'text',
//       status: 'read',
//       content_attributes: {},
//       created_at: 1752594312,
//       private: false,
//       source_id: null,
//       sender: [Object]
//     }
//   ],
//   greatingsList: [
//     '¡Hola! 😊 Soy Carolina, asesora comercial de EasyContact. n\n' +
//       '                Estoy para ayudarte a entender cómo nuestra plataforma puede simplificar tu atención al cliente y ahorrarte tiempo desde el primer día.',
//     '¡Hola! Soy Carolina, asesora en EasyContact 🚀  \n' +
//       '                Estoy para ayudarte a conocer cómo centralizar todos tus canales de atención y automatizar lo repetitivo con IA.',
//     '¡Hola! Qué gusto saludarte 👋 Soy Carolina, asesora comercial de EasyContact.  \n' +
//       '                ¿Querés que te muestre cómo podemos ayudarte a responder más rápido y organizar mejor tus conversaciones?',
//     '¡Hola! Soy Carolina, de EasyContact 😊  \n' +
//       '                Estoy acá para acompañarte y mostrarte cómo podés mejorar la atención al cliente con una sola herramienta fácil de usar.',
//     '¡Hola! Gracias por escribirnos 🙌 Soy Carolina, asesora de EasyContact.  \n' +
//       '                ¿Querés que te cuente cómo funciona y cómo podrías aprovecharlo en tu empresa?'
//   ]
// }