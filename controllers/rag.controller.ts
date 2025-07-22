import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Request, Response } from "express";
import { vectorStoreQdrant } from "../vector-store/qdrantConfig.js";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from '@langchain/qdrant';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config()

export const getCollenctions = async (req: Request, res: Response) => {
    try {
        const result = await vectorStoreQdrant.getCollections();
        res.json({ colecciones: result.collections });
    } catch (err) {
        console.error(err);
        res.json({ message: "Error al obtener las colecciones" });
    }
}

export const createCollection = async (req: Request, res: Response) => {
    const { nameCollection } = req.body;

    try {
        await vectorStoreQdrant.createCollection(nameCollection, {
            vectors: { size: 4, distance: "Dot" },
        });
        res.json({ message: `La coleccion ${nameCollection} se creo exitosamente` });
    } catch (err) {
        console.error(err);
        res.json({ message: "Error al crear la coleccion" });
    }
}

export const searchInVectoreStore = async (req: Request, res: Response) => {
    const { query, collectionName } = req.body;
    try {
        const embeddings = new OpenAIEmbeddings({
            model: "text-embedding-3-large",
        });
        const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
            url: process.env.QDRANT_URL,
            collectionName
        })
        const result = await vectorStore.similaritySearch(query)
        return res.json({ query, result })
    } catch (error) {
        return res.status(500).json({ error: 'Error al hacer la busqueda.' });
    }
}

export const addPdf = async (req: Request, res: Response) => {
    const { collectionName } = req.body;
    try {
        if (!req.file || !collectionName) {
            return res.status(400).json({ error: 'No se recibio ningun archivo PDF.' });
        }
        const filePath = req.file.path;
        const loader = new PDFLoader(filePath);
        const docs = await loader.load();
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200
        });
        const chunks = await textSplitter.splitDocuments(docs);
        const embeddings = new OpenAIEmbeddings({
            model: "text-embedding-3-large",
        });
        const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
            url: process.env.QDRANT_URL,
            collectionName
        })
        await vectorStore.addDocuments(chunks);
        await fs.promises.unlink(filePath);

        res.json({
            message: 'Archivo recibido y guardado correctamente.',
            path: req.file.path
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error procesando el archivo PDF.' });
    }
}