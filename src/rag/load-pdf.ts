import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import 'dotenv/config';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY


//* 1. Cargamos el PDF
const loader = new PDFLoader("assets/AF Frontier DC 4x2.pdf");
const docs = await loader.load();

//* 2. Dividir el PDF en chucks
const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100
});
const chunks = await textSplitter.splitDocuments(docs);

//* 3. Crear el vectorizador los chunks
const embeddings = new OpenAIEmbeddings({
    model:"text-embedding-3-large", 
    apiKey: OPENAI_API_KEY
})

//* 4. Guardar los vectores en VectorStore (FAISS)
const vectorStore = new FaissStore(embeddings, {});
await vectorStore.addDocuments(chunks);


// Agregando nuevo PDF
const loader2 = new PDFLoader("assets/Nissan Kicks.pdf");
const docs2 = await loader2.load();
const chunks2 = await textSplitter.splitDocuments(docs2);
await vectorStore.addDocuments(chunks2);

// Agregando nuevo PDF
const loader3 = new PDFLoader("assets/PROG-2025_ME_INDUSTRIAL.pdf");
const docs3 = await loader3.load();
const chunks3 = await textSplitter.splitDocuments(docs3);
await vectorStore.addDocuments(chunks3);

export { vectorStore }

//? Fuente: https://js.langchain.com/docs/tutorials/retrievers/
