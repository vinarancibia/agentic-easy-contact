import { tool } from "@langchain/core/tools";
import { QdrantVectorStore } from '@langchain/qdrant';
import { OpenAIEmbeddings } from "@langchain/openai";
import { z } from 'zod'

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
    description: 'Usa esta herramienta para consultar preguntas de un usuario que se tengan que buscar en colecciones especificas de la base de datos vectorial. Cada respuesta vuelve con el numero de pagina del catalogo de donde fue extraida la informacion.',
    schema: z.object({
        query: z.string().describe('Pregunta del usuario'),
        collectionName: z.string().describe('Nombre de la coleccion donde se encuentra la informacion')
    })
})