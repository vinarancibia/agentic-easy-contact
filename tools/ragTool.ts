import { tool } from "@langchain/core/tools";
import { QdrantVectorStore } from '@langchain/qdrant';
import { OpenAIEmbeddings } from "@langchain/openai";
import { z } from 'zod'
import { vectorStoreQdrant } from "../vector-store/qdrantConfig.js";

interface Result {
    content: string;
    pageNumber: number;
}
interface Collection {
    name: string
}

export const searchInfoOnCollection = tool(async (input, config) => {
    console.log('<------------- searchInfoOnCollection ----------->');
    const { collectionName, query } = input;
    const accountId = config.configurable?.accountId;
    const agentBotId = config.configurable?.agentBotId;
    const prefix = `${accountId}-${agentBotId}-`;
    const embeddings = new OpenAIEmbeddings({model: "text-embedding-3-large"});
    const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
        url: process.env.QDRANT_URL,
        collectionName: `${prefix}${collectionName}`
    })
    const response = await vectorStore.similaritySearch(query);
    const results: Result[] = response.map(r => ({content: r.pageContent, pageNumber: r.metadata.loc?.pageNumber}));

    return JSON.stringify(results);
}, {
    name: 'search-info-collection',
    description: `Esta herramienta busca información dentro de un archivo previamente cargado en la base de datos vectorial. Devuelve un arreglo de resultados, donde cada resultado contiene 'content' (el texto encontrado) y 'pageNumber' (el número de página en el documento). El agente debe usar esta herramienta cuando el usuario haga preguntas sobre el contenido de un archivo o documento específico. Al dar la respuesta, el agente debe basarse únicamente en los 'content' devueltos y siempre citar el número de página correspondiente a cada fragmento de información.`,
    schema: z.object({
        query: z.string().describe('Pregunta del usuario'),
        collectionName: z.string().describe('Nombre de la coleccion donde se encuentra la informacion')
    })
});

export const getCollectionsVectorStore = tool(async(input, config) => {
    console.log('<------------- getCollectionsVectorStore ----------->');
    const accountId = config.configurable?.accountId;
    const agentBotId = config.configurable?.agentBotId;
    const prefix = `${accountId}-${agentBotId}-`;
    try {
        const {collections}: {collections:Collection[]} = await vectorStoreQdrant.getCollections();
        const collectionNames = collections.map(c => c.name);
        const collectionFilter = collectionNames.filter(name => name.startsWith(prefix));
        const listCollection = collectionFilter.map(name => name.slice(prefix.length));
        return JSON.stringify({ files: [...listCollection] });
    } catch (err) {
        console.error(err);
        return JSON.stringify({ message: "Error al obtener las colecciones" });
    }
}, {
    name:'get-collections-vector-store',
    description:'Esta herramienta obtiene la lista de colecciones existentes en la base de datos vectorial. Cada colección corresponde a un archivo o documento que el usuario ha cargado previamente. El agente debe usarla cuando el usuario pregunte qué archivos, documentos o PDFs tiene cargados, qué información está disponible para consultar, o quiera ver el listado de contenidos existentes. El agente no debe usarla si la consulta no está relacionada con los archivos cargados en el sistema.'
});