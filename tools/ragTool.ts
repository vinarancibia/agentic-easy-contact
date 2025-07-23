import { tool } from "@langchain/core/tools";
import { QdrantVectorStore } from '@langchain/qdrant';
import { OpenAIEmbeddings } from "@langchain/openai";
import { z } from 'zod'
import { vectorStoreQdrant } from "../vector-store/qdrantConfig.js";

interface Result {
    content: string;
    pageNumber: number;
}

export const searchInfoOnCollection = tool(async (input) => {
    console.log('<------------- searchInfoOnCollection ----------->');
    const { collectionName, query } = input;
    const embeddings = new OpenAIEmbeddings({model: "text-embedding-3-large"});
    const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
        url: process.env.QDRANT_URL,
        collectionName
    })
    const response = await vectorStore.similaritySearch(query);
    const results: Result[] = response.map(r => ({content: r.pageContent, pageNumber: r.metadata.loc?.pageNumber}));

    return JSON.stringify(results);
}, {
    name: 'search-info-collection',
    description: 'Usa esta herramienta para consultar preguntas de un usuario que se tengan que buscar en colecciones especificas de la base de datos vectorial. Al final de cada respuesta indica el numero de pagina(s) de donde tomaste la respuesta.',
    schema: z.object({
        query: z.string().describe('Pregunta del usuario'),
        collectionName: z.string().describe('Nombre de la coleccion donde se encuentra la informacion')
    })
});

export const getCollectionsVectorStore = tool(async(input) => {
    console.log('<------------- getCollectionsVectorStore ----------->');
    try {
        const result = await vectorStoreQdrant.getCollections();
        return JSON.stringify({ colecciones: result.collections });
    } catch (err) {
        console.error(err);
        return JSON.stringify({ message: "Error al obtener las colecciones" });
    }
}, {
    name:'get-collections-vector-store',
    description:'Usa esta herramienta para acceder a la lista disponible de colecciones en la base de datos vectorial'
});