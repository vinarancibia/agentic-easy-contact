import { Router } from "express";
import { chatAgent } from "../controllers/agent.controller";

const routerAgent = Router();

routerAgent.post('/maria', chatAgent);

export default routerAgent;