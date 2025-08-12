import axios from "axios";

export async function monitorWebHook(body: any) {
    const WEBHOOK_URL = 'https://webhook.site/01dab459-653a-4a69-88db-e7e24ed44de3';
    try {
        await axios.post(WEBHOOK_URL, body, {
            headers: {"Content-Type": "application/json"}
        }) 
    } catch (error) {
        console.log(error);
    }
}