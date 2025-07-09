import 'dotenv/config'
import express, { Request, Response } from 'express';
import { agentMaria } from './robot/maria';

const PORT = process.env.PORT || '8080';
const app = express();

app.use(express.json());

app.get('/', (req:Request, res:Response) => {
    res.send(`Servidor corriendo en el puerto ${PORT}`)
})

app.post('/rag', async (req:Request, res:Response) =>{
    const {query} = req.body;

    res.json({response: `${query}`})
})

app.post('/chat', async (req:Request, res:Response) => {
    const {message} = req.body;
    const result = await agentMaria.invoke(
        {messages: [{ role: "user", content: message }]},
        {configurable: {thread_id:"user1"}}
    )
    // console.log(result.messages.at(-1));
    const {content} = result.messages[result.messages.length - 1];
    res.json({message: `${content}`})
})

app.listen(PORT, () => {
    console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
})
