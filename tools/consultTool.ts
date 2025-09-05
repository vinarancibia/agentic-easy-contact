import { z } from 'zod';
import { tool } from '@langchain/core/tools';
import { sendFile } from '../helpers/message.js';
import { catalogAutosTest } from '../test/catalogo.js';
import { RunnableConfig } from '@langchain/core/runnables';
import axios from 'axios';
import { Catalog } from '../interfaces/catalog.js';

export const consultCatalogTool = tool(
    async (input, config) => {
        console.log('<------------ consultCatalogTool ------------>');
        const accountId = config.configurable?.accountId;
        const agentBotId = config.configurable?.agentBotId;
        const accessToken = config.configurable?.accessToken;

        console.log('accessToken:', accessToken)

        const api = process.env.API_EASY_CONTACT;
        const url = `${api}/api/v1/accounts/${accountId}/catalogs?agent_bot_id=${agentBotId}`;
        const {data}:{data:Catalog[]} = await axios.get(url, {headers: {'api_access_token':accessToken}});
        
        if (data.length > 0) { // Se filtran los campos
            const dataFil = data.map(d => ({
                codigo: d.codigo,
                nombre: d.nombre,
                descripcion: d.descripcion,
                precio: d.precio,
                moneda: d.moneda,
                garantia: d.garantia
            }))
            return JSON.stringify(dataFil);
        }
        return 'Aun no tengo articulos en el catalogo';
    },
    {
        name: 'consult-catalog',
        description: `Esta herramienta obtiene desde la API la lista de productos o servicios del catálogo. La lista devuelve únicamente información básica de cada producto: nombre, código, descripción, precio, moneda y garantía. El agente debe usar esta herramienta cuando el usuario pregunte por los productos disponibles en el catálogo, quiera ver un listado general, consultar precios o comparar información básica entre productos. No debe usarse si el usuario solicita detalles avanzados que no forman parte de la información básica.`
    }
)

// export const consultCodeCatalogTool = tool(
//     async (input: Record<string, any>, config: RunnableConfig) => {
//         console.log('<------------ consultCodeCatalogTool ------------>');
//         const filesData = catalogAutosTest;
//         if (filesData.length > 0) {
//             const data = filesData.map(d => ({
//                 codigo: d.codigo,
//                 nombre: d.nombre,
//                 marca: d.marca,
//                 modelo: d.modelo
//             }))

//             return JSON.stringify(data);
//         }
//         return 'Aun no tengo articulos en el catalogo';
//     },
//     {
//         name: 'consult-code',
//         description: `Usa esta herramienta para obtener los datos de los autos, como el codigo, nombre, marca y modelo.`
//     }
// )

export const sendImageCatalogTool = tool(
    async (input: Record<string, any>, config: RunnableConfig) => {
        console.log('<------------- searchImageCatalogTool ----------->');
        const { codigo } = input;
        console.log('CODIGO:',codigo)
        const accountId = config.configurable?.accountId;
        const agentBotId = config.configurable?.agentBotId;
        const conversationId = config.configurable?.conversationId;
        const accessToken = config.configurable?.accessToken;

        const api = process.env.API_EASY_CONTACT;
        const url = `${api}/api/v1/accounts/${accountId}/catalogs?agent_bot_id=${agentBotId}`;
        const {data}:{data:Catalog[]} = await axios.get(url, {headers: {'api_access_token':accessToken}});

        // const filesData = catalogAutosTest;
        const item = data.find((a: any) => codigo.toLocaleLowerCase() === a.codigo.toLocaleLowerCase());

        if (item) {
            const result = await sendFile({ accountId, conversationId, accessToken,  fileUrl: item.imagen_url });
            return (result? 
                `Encontré la foto de ${item.nombre}. Si necesitas más información házmelo saber.`
                :
                `Lo siento, pero tuve problemas al compartir la imagen de ${item.nombre}.`) 
        }
        else{
            return 'Lo siento, pero no pude encontrar la imagen del auto que solicitas.';
        }
    },
    {
        name: 'send-image-catalog',
        description: 'Esta herramienta recibe el código de un producto y envía su imagen al usuario. Una vez realizada la acción, devuelve un mensaje indicando si la imagen fue enviada correctamente o si hubo un problema al compartirla. El agente debe usar esta herramienta cuando el usuario pida ver la foto de un producto del catálogo, y debe responder al usuario utilizando el mensaje que devuelve la herramienta.',
        schema: z.object({
            codigo: z.string().describe('Codigo del auto que esta en el catalogo')
        }),
        returnDirect: true
    }
);