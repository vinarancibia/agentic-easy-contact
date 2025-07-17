import { Router } from "express";
import { addPdf, createCollection, getCollenctions } from "../controllers/rag.controller.js";
import multer from "multer";

const routerRag = Router();
const upload = multer({ dest: 'tmp/' });

routerRag.get('/', upload.any(), getCollenctions);
routerRag.post('/create-collection', upload.any(), createCollection);
routerRag.post('/add-pdf', upload.single('file'), addPdf);

export default routerRag;