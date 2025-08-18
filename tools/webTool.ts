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
        description: `Esta herramienta provee información en tiempo real sobre el contenido que el usuario está viendo en pantalla. El agente debe usarla cuando el usuario haga preguntas directas relacionadas con métricas, cifras, resultados o cualquier dato visible en ese contexto. El propósito es que el agente pueda responder con precisión basándose en la información mostrada, en lugar de inventar o recurrir a conocimiento general. Ejemplos de uso: '¿Cuánto ganamos hoy?', 'Dime el total de ventas', 'Qué clientes aparecen en la lista', 'Cuántos registros hay aquí'. El agente no debe usar esta herramienta si la pregunta no está relacionada con lo que el usuario está visualizando actualmente.`
    }
)