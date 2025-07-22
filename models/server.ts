import express, {Application} from 'express';
import routerAgent from '../routes/agent.route.js';
import cors from 'cors';
import routerRag from '../routes/rag.route.js';


class Server {
    private app: Application;
    private port: number;
    private apiPaths = {
        agent: '/api/agent',
        rag: '/api/rag'
    }

    constructor(){
        this.app = express();
        this.port = process.env.PORT? Number(process.env.PORT): 8080;

        this.middleware();
        this.routes();
    }

    middleware(){
        this.app.use(cors());
        this.app.use(express.json());
    }

    routes(){
        this.app.use(this.apiPaths.agent, routerAgent);
        this.app.use(this.apiPaths.rag, routerRag);
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('✅ Servidor corriendo en el puertos: ', this.port);
        })
    }
}

export default Server;