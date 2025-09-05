import axios from "axios";

import dotenv from 'dotenv';
dotenv.config();

export async function getPromptAndToken({accountId, inboxId}:{accountId:number, inboxId:number}): Promise<{agentBotId: string, prompt: string, accessToken: string}> {
    return new Promise(async (resolve, reject) => {
        console.log('<-------- Obteniendo 🧠 Prompt y 🔏 Access Token ---------->');
        try {
            const apiAccessTokenPrompt = process.env.API_ACCESS_TOKEN_PROMPT;
            const api = process.env.API_EASY_CONTACT;
            const url = `${api}/platform/api/v1/agent_bots/query?account_id=${accountId}&inbox_id=${inboxId}`;
            
            const response = await axios.get(url, {headers: {'api_access_token':apiAccessTokenPrompt}});
            const {prompt, access_token, id} = response.data;
    
            resolve({agentBotId: id, prompt: prompt? prompt.trim(): '', accessToken: access_token});
        } catch (err) {
            if (axios.isAxiosError(err)){
                console.log('Código de estado:', err.response?.status);
                console.log('Datos de error:', err.response?.data);
                console.log('Mensaje:', err.message);
            }
            reject('❌ Error al obtener 🧠 Prompt y 🔏 Access Token')           
        }
    });
}
