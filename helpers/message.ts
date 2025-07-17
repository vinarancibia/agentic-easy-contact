import axios from "axios";
import { audioToText } from "./converter.js";
import FormData from "form-data";
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

type SendMessageProp = {
    accountId: number;
    conversationId: number
    message: string;
}

type SendFileProp = {
    accountId: number;
    conversationId: number;
    fileUrl: string;
}

type RequestFilterReturn = {
    accountId: number;
    conversationId: number;
    content: string;
    messageType: 'incoming' | 'outgoing';
    activeAgentBot: boolean;
}

const apiAccessToken = process.env.API_ACCESS_TOKEN;

export async function sendMessage({ accountId, conversationId, message }: SendMessageProp) {
    const url = `https://easycontact.top/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`;
    const form = new FormData();

    form.append('message_type', 'outgoing');
    form.append('content_type', 'text');
    form.append('content', message);

    if (url) {
        await axios.post(
            url,
            form, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'api_access_token': 'L5G12gAfw5ZAGPMyT6KrJhvN'
            }
        })
    }
}

export async function sendFile({ accountId, conversationId, fileUrl }: SendFileProp): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        console.log('<------------- sendFile ----------->');
        console.log('FILEURL: ', fileUrl);
        const url = `https://easycontact.top/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`;
        const form = new FormData();

        form.append('message_type', 'outgoing');
        form.append('content_type', 'text');
        form.append('content', '');

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const tmpDir = path.join(__dirname, '../tmp'); // Carpeta para archivos temporales.
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }

        if (url) {
            try {
                console.log('📎 Buscando o creando tmp')
                const fileExtension = path.extname(fileUrl).split('?')[0];
                const fileName = `file-${uuidv4()}${fileExtension}`;
                const filePath = path.join(tmpDir, fileName);

                console.log('🌐 Descargando archivo')
                const response = await axios.get(fileUrl, { responseType: 'stream' });
                const writer = fs.createWriteStream(filePath);

                console.log('📂 Guardando archivo en tmp')
                await new Promise<void>((res, rej) => {
                    response.data.pipe(writer);
                    writer.on('finish', res);
                    writer.on('error', rej);
                });
                form.append('attachments[]', fs.createReadStream(filePath), fileName);

                console.log('📨 Enviando el archivo al chat')
                await axios.post(
                    url,
                    form, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'api_access_token': apiAccessToken
                    }
                })
                console.log('✅ Se envio la imagen con exito');
                console.log('🗑️ Eliminando archivo de tmp')
                await fs.promises.unlink(filePath);
                resolve(true);
            } catch (error) {
                console.log('❌ Error al enviar el archivo ');
                console.log(error)
                reject(false);
            }
        } else {
            console.log('❌ No se pudo enviar el archivo por falta del URL de envio')
            reject(false);
        }
    });
}

export async function requestFilter(body: { [key: string]: any }): Promise<RequestFilterReturn> {
    const { account, conversation, message_type, content, attachments, active_agent_bot } = body;

    if (account && conversation && message_type && (message_type === 'incoming') && (content || attachments) && active_agent_bot) {
        const accountId = parseInt(account.id);
        const conversationId = parseInt(conversation.id);
        const messageType = 'incoming';

        if (content) return { accountId, conversationId, messageType, content: content.trim(), activeAgentBot: true };

        if (Array.isArray(attachments) && attachments.length !== 0) {
            if (attachments[0].file_type === "audio") {
                const transcription = await audioToText({ audioUrl: attachments[0].data_url });
                return { accountId, conversationId, messageType, content: transcription, activeAgentBot: true };
            }
        }
        return { accountId: 0, conversationId: 0, content: '', messageType: 'outgoing', activeAgentBot: false }
    }
    return { accountId: 0, conversationId: 0, content: '', messageType: 'outgoing', activeAgentBot: false }
}