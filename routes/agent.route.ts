import { Router } from "express";
import { chatAgent } from "../controllers/agent.controller.js";
import multer from "multer";
import { main } from "../controllers/agent.remarketing.controller.js";

const routerAgent = Router();
const upload = multer({ dest: 'tmp/' });

routerAgent.post('/maria', upload.any(), chatAgent);

routerAgent.post('/remarketing', main);
    
export default routerAgent;