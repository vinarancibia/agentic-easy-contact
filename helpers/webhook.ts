import axios from "axios";

export async function monitorWebHook(body: any) {
    const WEBHOOK_URL = 'https://webhook.site/9aa69484-a299-4adc-a318-b950568a49b2';
    try {
        await axios.post(WEBHOOK_URL, body, {
            headers: {"Content-Type": "application/json"}
        }) 
    } catch (error) {
        console.log(error);
    }
}