import { promptStore } from "../test/prompts.js";

export async function getPrompt(userId: string): Promise<string> {
    return new Promise((resolve) => {
        console.log('<-------- 🧠 Obteniendo prompt ---------->')

        let promp = promptStore.agenteVentasEasyContact;

        // if (userId === '1:13108') promp = 'Tu nombre es Roberto, eres un asistente que responde de forma cordial. Siempre saluda usando tu nombre';
        // else if (userId === '2:13108') promp = 'Tu nombre es Harold, eres un asistente que responde de forma cordial. Siempre saluda usando tu nombre';

        resolve(promp);
    });
}
