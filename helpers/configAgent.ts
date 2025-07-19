import axios from "axios";

import dotenv from 'dotenv';
dotenv.config();

export async function getPromptAndToken({accountId, inboxId}:{accountId:number, inboxId:number}): Promise<{prompt: string, accessToken: string}> {
    return new Promise(async (resolve) => {
        console.log('<-------- 🧠 Obteniendo prompt ---------->');
        const url = `https://easycontact.top/platform/api/v1/agent_bots/query?account_id=${accountId}&inbox_id=${inboxId}`;
        const apiAccessTokenPrompt = process.env.API_ACCESS_TOKEN_PROMPT;

        const response = await axios.get(url, {headers: {'api_access_token':apiAccessTokenPrompt}});
        const {prompt, access_token} = response.data;

        resolve({prompt: prompt? prompt.trim(): '', accessToken: access_token});
    });
}

// export async function getAccessToken({accountId, inboxId}:{accountId:number, inboxId:number}): Promise<string> {
//     return new Promise(async (resolve) => {
//         console.log('<-------- 🔏 Obteniendo Access Token ---------->');
//         const url = `https://easycontact.top/platform/api/v1/agent_bots/query?account_id=${accountId}&inbox_id=${inboxId}`;
//         const apiAccessTokenPrompt = process.env.API_ACCESS_TOKEN_PROMPT;

//         const response = await axios.get(url, {headers: {'api_access_token':apiAccessTokenPrompt}});
//         const {access_token} = response.data;

//         resolve(access_token);
//     });
// }
