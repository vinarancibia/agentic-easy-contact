import { Router } from "express";
import { addPdf, createCollection, getCollenctions, searchInVectoreStore } from "../controllers/rag.controller.js";
import multer from "multer";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tmpDir = path.join(__dirname, '../tmp');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {cb(null, tmpDir)},
    filename: function (req, file, cb) {cb(null, `${Date.now()}-${file.originalname}`);}
})
const upload = multer({ storage});
const routerRag = Router();

routerRag.get('/', upload.any(), getCollenctions);
routerRag.post('/create-collection', upload.any(), createCollection);
routerRag.post('/search', searchInVectoreStore);
routerRag.post('/add-pdf', upload.single('file'), addPdf);

export default routerRag;