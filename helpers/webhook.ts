import axios from "axios";

export async function monitorWebHook(body: any) {
    const WEBHOOK_URL = 'https://webhook.site/2c7a65e1-b645-40fd-b009-9ee4f2e0acec';
    try {
        await axios.post(WEBHOOK_URL, body, {
            headers: {"Content-Type": "application/json"}
        }) 
    } catch (error) {
        console.log(error);
    }
}