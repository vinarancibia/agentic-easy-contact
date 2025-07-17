import dotenv from 'dotenv';
dotenv.config();

const { QdrantClient }:any = await import("@qdrant/js-client-rest");

export const vectorStoreQdrant = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
});