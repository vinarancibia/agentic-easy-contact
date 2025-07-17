import { Request, Response } from "express";
import { vectorStoreQdrant } from "../vector-store/qdrantConfig.js";
import fs from 'fs/promises';
import path from 'path';


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

export const addPdf = async (req: Request, res: Response) => {
    try {
        const filePath = req.file?.path;
        if (!filePath) {
            return res.status(400).json({ error: 'No se recibio ningun archivo PDF.' });
        }
        const dataBuffer = await fs.readFile(filePath);
        


    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error procesando el archivo PDF.' });
    }
}