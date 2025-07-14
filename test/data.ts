//* Al mandar un mensaje al agente, el mismo llega atraves del body de la siguiente manera
//? Mas info: https://developers.chatwoot.com/api-reference/messages/create-new-message?playground=open

const requestChat = {
    account: { id: 3, name: 'Control Facilito' },
    additional_attributes: {},
    content_attributes: { in_reply_to: null },
    content_type: 'text', // Tipo del mensaje
    content: 'hola desde el body 🫡 ', // Mensaje que el usuario envia
    active_agent_bot: true,
    conversation: {
        additional_attributes: {
            browser: [Object],
            referer: 'https://development.controlfacilito.com/index.html',
            initiated_at: [Object],
            browser_language: 'en'
        },
        active_agent_bot: true,
        can_reply: true,
        channel: 'Channel::WebWidget',
        contact_inbox: {
            id: 62117,
            contact_id: 52870,
            inbox_id: 58,
            source_id: '96e55744-c1c0-477b-86e4-ed125f7b071c',
            created_at: '2025-06-24T13:47:22.688Z',
            updated_at: '2025-06-24T13:47:22.688Z',
            hmac_verified: false,
            pubsub_token: '6H59it3frvA559wndg5NGvAT'
        },
        id: 13098,
        kanban_state: { id: null, name: null, color: null, order: null },
        inbox_id: 58,
        messages: [[Object]],
        labels: [],
        meta: {
            sender: [Object],
            assignee: null,
            team: null,
            hmac_verified: false
        },
        status: 'pending',
        custom_attributes: {},
        snoozed_until: null,
        unread_count: 10,
        first_reply_created_at: '2025-06-24T13:47:39.181Z',
        priority: null,
        waiting_since: 1752097545,
        agent_last_seen_at: 1750800976,
        contact_last_seen_at: 1752161433,
        last_activity_at: 1752161782,
        timestamp: 1752161782,
        created_at: 1750772853
    },
    created_at: '2025-07-10T15:36:22.262Z',
    id: 77287,
    inbox: { id: 58, name: 'Development test' },
    message_type: 'incoming', // Especifica si el mensaje es de entrada (outgoing) o de salida (incoming)
    private: false, // Bandera para identificar si es una nota privada
    sender: {
        account: { id: 3, name: 'Control Facilito' },
        additional_attributes: {},
        avatar: '',
        custom_attributes: {},
        email: null,
        id: 52870,
        identifier: null,
        name: 'solitary-forest-213',

        phone_number: null,
        thumbnail: ''
    },
    source_id: null,
    event: 'message_created'
}

