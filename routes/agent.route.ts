import { Router } from "express";
import { chatMaria } from "../controllers/agent.controller";
import multer from "multer";

const routerAgent = Router();
const upload = multer({ dest: 'tmp/' });

routerAgent.post('/maria', upload.any(), chatMaria);

export default routerAgent;