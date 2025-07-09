import express, {Application} from 'express';
import routerAgent from '../routes/agent.route';
import cors from 'cors';


class Server {
    private app: Application;
    private port: number;
    private apiPaths = {
        agent: '/api/agent'
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
        this.app.use(this.apiPaths.agent, routerAgent)
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('🤩 Servidor corriendo en el puertos 🤩: ', this.port);
        })
    }
}

export default Server;