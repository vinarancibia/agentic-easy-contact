import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Request, Response } from "express";
import { vectorStoreQdrant } from "../vector-store/qdrantConfig.js";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from '@langchain/qdrant';
import fs from 'fs';
import dotenv from 'dotenv';
import { Document } from "langchain/document";
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

// export const addPdf = async (req: Request, res: Response) => {
//     const { collectionName } = req.body;
//     try {
//         await vectorStoreQdrant.createCollection(collectionName, {
//             vectors: { size: 4, distance: "Dot" },
//         });
//         console.log(`Coleccion '${collectionName}' creada...`);
//         if (!req.file || !collectionName) {
//             return res.status(400).json({ error: 'No se recibio ningun archivo PDF.' });
//         }
//         const filePath = req.file.path;
//         const loader = new PDFLoader(filePath);
//         const docs = await loader.load();
//         const textSplitter = new RecursiveCharacterTextSplitter({
//             chunkSize: 1000,
//             chunkOverlap: 200
//         });
//         const chunks = await textSplitter.splitDocuments(docs);
//         const embeddings = new OpenAIEmbeddings({
//             model: "text-embedding-3-large",
//         });
//         const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
//             url: process.env.QDRANT_URL,
//             collectionName
//         })
//         await vectorStore.addDocuments(chunks);
//         await fs.promises.unlink(filePath);

//         res.json({
//             message: 'Archivo recibido y guardado correctamente.',
//             path: req.file.path
//         });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Error procesando el archivo PDF.' });
//     }
// }

function chunkArray<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export const addPdf = async (req: Request, res: Response) => {
  const { collectionName } = req.body;

  // Ajusta según tus pruebas/carga real
  const BATCH_SIZE = 50;
  const EMBEDDING_MODEL = "text-embedding-3-large";
  const VECTOR_DIM = 3072; // <- text-embedding-3-large
  const QDRANT_URL = process.env.QDRANT_URL!;
  let filePath: string | undefined;

  if (!req.file || !collectionName) {
    return res.status(400).json({ error: "No se recibió archivo o collectionName." });
  }

  try {
    filePath = req.file.path;
    const exists = await vectorStoreQdrant.getCollections();
    if (exists.collections.some((c:any) => c.name === collectionName)) {
      return res.status(400).json({
        error: `El identificador de la información ya está en uso. Usa otro identificador.`,
      });
    }

    // 1) Crea la colección con la dimensión correcta
    await vectorStoreQdrant.createCollection(collectionName, {
      vectors: { size: VECTOR_DIM, distance: "Cosine" },
    });
    console.log(`Colección '${collectionName}' asegurada...`);

    // 2) Carga y trocea el PDF (chunks más pequeños para reducir payload por vector)
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 700,
      chunkOverlap: 100,
    });
    const rawChunks = await textSplitter.splitDocuments(docs);

    // 3) Metadata “slim” para bajar bytes del payload
    const chunks = rawChunks.map(
      (d, i) =>
        new Document({
          pageContent: d.pageContent,
          metadata: {
            source: d.metadata?.source ?? req.file?.originalname ?? "upload",
            page: d.metadata?.loc?.pageNumber ?? d.metadata?.pdf?.pageNumber ?? null,
            idx: i,
          },
        })
    );

    // 4) Embeddings y VectorStore
    const embeddings = new OpenAIEmbeddings({ model: EMBEDDING_MODEL });
    const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
      url: QDRANT_URL,
      collectionName,
    });

    // 5) Inserta en lotes para no pasar el límite de ~32 MiB
    const lots = chunkArray(chunks, BATCH_SIZE);
    let inserted = 0;
    for (const lot of lots) {
      await vectorStore.addDocuments(lot);
      inserted += lot.length;
    }

    return res.status(201).json({
      message: "PDF procesado y embebido correctamente.",
      collectionName,
      chunksTotal: chunks.length,
      inserted,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error procesando el archivo PDF." });
  } finally {
    if (filePath) {
      try {
        await fs.promises.unlink(filePath);
      } catch (e) {
        console.warn("No se pudo eliminar el archivo temporal:", e);
      }
    }
  }
};