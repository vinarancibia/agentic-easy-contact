import { tool } from '@langchain/core/tools';
import { RunnableConfig } from '@langchain/core/runnables';


export const webInformationTool = tool(
    async (input: Record<string, any>, config: RunnableConfig) => {
        console.log('<------------ webInformationTool ------------>');
        const customAttributes = config.configurable?.customAttributes;   
        return JSON.stringify(customAttributes);
    },
    {
        name: 'web-information',
        description: `Usa esta herramienta cuando el usuario te pregunta “¿Que ves aquí?, ¿Dime que ves?, ¿Qué estas mirando?”  o alguna frase similar. Esta herramienta te dará información sobre el sitio web en que el usuario se encuentra actualmente.`
    }
)