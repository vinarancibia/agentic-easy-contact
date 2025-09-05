import axios from "axios";

export async function monitorWebHook(body: any) {
    const WEBHOOK_URL = 'https://webhook.site/cb936549-47ef-44ce-955d-52a20272709c';
    try {
        await axios.post(WEBHOOK_URL, body, {
            headers: {"Content-Type": "application/json"}
        }) 
    } catch (error) {
        console.log(error);
    }
}