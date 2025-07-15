import axios from "axios";
import { audioToText } from "./converter";
import FormData from "form-data";
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
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
    messageType: 'incoming' | 'outgoing'
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

export async function sendFile({ accountId, conversationId, fileUrl }: SendFileProp) {
    console.log('<------------- sendFile ----------->');
    console.log('FILEURL: ', fileUrl);
    const tmpDir = path.join(__dirname, '../tmp'); // Carpeta para archivos temporales.
    if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
    }
    const url = `https://easycontact.top/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`;
    const form = new FormData();

    form.append('message_type', 'outgoing');
    form.append('content_type', 'text');
    form.append('content', '');

    const fileExtension = path.extname(fileUrl).split('?')[0];
    const fileName = `file-${uuidv4()}${fileExtension}`;
    const filePath = path.join(tmpDir, fileName);


    if (url) {
        try {
            const response = await axios.get(fileUrl, { responseType: 'stream' });
            const writer = fs.createWriteStream(filePath);

            await new Promise<void>((resolve, reject) => {
                response.data.pipe(writer);
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
            form.append('attachments[]', fs.createReadStream(filePath), fileName);

            await axios.post(
                url,
                form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'api_access_token': apiAccessToken
                }
            })
            await fs.promises.unlink(filePath);
            console.log('✅ Se envio la imagen con exito ');
        } catch (error) {
            console.log('❌ Error al enviar el archivo ');
            console.log(error)
        }
    } else {
        console.log('❌ No se pudo enviar el archivo por falta del URL de envio')
    }
}

export async function requestFilter(body: { [key: string]: any }): Promise<RequestFilterReturn> {
    const { account, conversation, message_type, content, attachments } = body;

    if (account && conversation && message_type && (message_type === 'incoming') && (content || attachments)) {
        const accountId = parseInt(account.id);
        const conversationId = parseInt(conversation.id);
        const messageType = 'incoming';

        if (content) return { accountId, conversationId, messageType, content };

        if (Array.isArray(attachments) && attachments.length !== 0) {
            if (attachments[0].file_type === "audio") {
                const transcription = await audioToText({ audioUrl: attachments[0].data_url });
                return { accountId, conversationId, messageType, content: transcription };
            }
        }
        return { accountId: 0, conversationId: 0, content: '', messageType: 'outgoing' }
    }
    return { accountId: 0, conversationId: 0, content: '', messageType: 'outgoing' }
}