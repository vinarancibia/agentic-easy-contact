import { Router } from "express";
import { chatAgent } from "../controllers/agent.controller.js";
import multer from "multer";

const routerAgent = Router();
const upload = multer({ dest: 'tmp/' });

routerAgent.post('/maria', upload.any(), chatAgent);

export default routerAgent;