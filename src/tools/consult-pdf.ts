import { tool } from "@langchain/core/tools";
import { z } from 'zod'
import { vectorStore } from "../rag/load-pdf";

interface Result{
    content: string;
    pageNumber: number;
    pdfName: string | undefined;
}

export const getInfoPdfTool = tool(async (input) => {
    const response = await vectorStore.similaritySearch(input.query);
    const pdfName = (response[0].metadata.source as string).split('/').pop();
    const result: Result = {
        content: response[0].pageContent,
        pageNumber: response[0].metadata.loc.pageNumber,
        pdfName
    }
    return result;
},{
    name: 'get-info-pdf',
    description: 'Consulta informacion de autos o productos tramontina extraida de los catalogos originales. Cada respuesta vuelve con el numero de pagina del catalogo de donde fue extraida la informacion y el nombre del pdf consultado.',
    schema: z.object({
        query: z.string().describe('Pregunta del usuario')
    })
})

