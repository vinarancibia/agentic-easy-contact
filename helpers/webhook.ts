import axios from "axios";

export async function monitorWebHook(body: any) {
    const WEBHOOK_URL = 'https://webhook.site/8fe9c968-efce-49a4-a9eb-e7c8ba66acb5';
    try {
        await axios.post(WEBHOOK_URL, body, {
            headers: {"Content-Type": "application/json"}
        }) 
    } catch (error) {
        console.log(error);
    }
}