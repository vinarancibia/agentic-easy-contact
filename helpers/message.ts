import axios from "axios";
import { audioToText } from "./converter.js";
import FormData from "form-data";
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

export const MESSAGE_SUB_TYPE = {
    NONE: "none",
    REMARKETING: "remarketing"
} as const;

type SendMessageProp = {
    accountId: number;
    conversationId: number;
    message: string;
    messageSubType?: string; 
    accessToken: string;
}

type SendFileProp = {
    accountId: number;
    conversationId: number;
    fileUrl: string;
    accessToken: string;
}

type RequestFilterReturn = {
    accountId: number;
    inboxId: number;
    conversationId: number;
    content: string;
    messageType: 'incoming' | 'outgoing';
    activeAgentBot: boolean;
    customAttributes: {pageUrl:string, todoText: string, pageTitle:string, htmlExcerpt: string};
}

export async function sendMessage({ accountId, conversationId, message, accessToken, messageSubType = MESSAGE_SUB_TYPE.NONE }: SendMessageProp) {
    const url = `https://easycontact.top/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`;
    // const accessToken = await getAccessToken({accountId, inboxId});
    const form = new FormData();

    form.append('message_type', 'outgoing');
    form.append('message_sub_type', messageSubType);
    form.append('content_type', 'text');
    form.append('content', message);

    if (url) {
        await axios.post(
            url,
            form, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'api_access_token': accessToken
            }
        })
    }
}

export async function sendFile({ accountId, conversationId, fileUrl, accessToken }: SendFileProp): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        console.log('<------------- sendFile ----------->');
        console.log('FILEURL: ', fileUrl);
        const url = `https://easycontact.top/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`;
        // const accessToken = await getAccessToken({accountId, inboxId});
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
                        'api_access_token': accessToken
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
    const { account, conversation, message_type, content, attachments, active_agent_bot, inbox, sender } = body;
    const customAttributes: {pageUrl:string, todoText: string, pageTitle:string, htmlExcerpt: string} = 
    {
        pageUrl:'',
        todoText:'',
        pageTitle:'',
        htmlExcerpt:'' 
    }

    if (account && conversation && message_type && (message_type === 'incoming') && (content || attachments) && active_agent_bot) {
        const accountId = parseInt(account.id);
        const inboxId = parseInt(inbox.id);
        const conversationId = parseInt(conversation.id);
        const messageType = 'incoming';
        const {custom_attributes} = sender;
        if(custom_attributes){
            const {page_url, todo_text, page_title, html_excerpt} = custom_attributes;
            customAttributes.pageUrl = page_url || '';
            customAttributes.todoText = todo_text || '';
            customAttributes.pageTitle = page_title || '';
            customAttributes.htmlExcerpt = html_excerpt || '';
        }
        
        if (content) return { accountId, inboxId, conversationId, messageType, content: content.trim(), activeAgentBot: true, customAttributes };

        if (Array.isArray(attachments) && attachments.length !== 0) {
            if (attachments[0].file_type === "audio") {
                const transcription = await audioToText({ audioUrl: attachments[0].data_url });
                return { accountId, inboxId, conversationId, messageType, content: transcription, activeAgentBot: true, customAttributes };
            }
        }
        return { accountId: 0, inboxId:0, conversationId: 0, content: '', messageType: 'outgoing', activeAgentBot: false, customAttributes }
    }
    return { accountId: 0, inboxId:0, conversationId: 0, content: '', messageType: 'outgoing', activeAgentBot: false, customAttributes }
}