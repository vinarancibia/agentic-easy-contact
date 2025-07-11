import { Router } from "express";
import { chatMaria } from "../controllers/agent.controller";

const routerAgent = Router();

routerAgent.post('/maria', chatMaria);

export default routerAgent;