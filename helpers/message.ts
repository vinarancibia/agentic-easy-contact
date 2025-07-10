import axios from "axios";

interface SendMessageAtr{
    accountId: number;
    conversationId: number;
    message: string;
    filePath?: string;
}

export async function sendMessage({accountId, conversationId, message, filePath}:SendMessageAtr ) {
    const url = `https://easycontact.top/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`;
    const form = new FormData();

    form.append('message_type', 'outgoing');
    form.append('content_type', 'text');
    form.append('content', message);

    if(filePath) console.log('Se recibio un archivo');
    else form.append('attachments[]', '');

    try {
        await axios.post(
            url,
            form,
            {
                headers: {
                    'api_access_token': 'L5G12gAfw5ZAGPMyT6KrJhvN',
                },
            }
        );
        console.log('✅ Respuesta enviada');
    } catch (error) {
        console.error('❌ Error al enviar mensaje:', error);
    }
}