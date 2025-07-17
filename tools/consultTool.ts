import { z } from 'zod';
import { tool } from '@langchain/core/tools';
import { sendFile } from '../helpers/message.js';
import { catalogAutosTest } from '../test/catalogo.js';
import { RunnableConfig } from '@langchain/core/runnables';

export const consultCatalogTool = tool(
    async (input, config) => {
        console.log('<------------ consultCodeCatalogTool ------------>');
        const filesData = catalogAutosTest;

        if (filesData.length > 0) { // Se filtran los campos
            const data = filesData.map(d => ({
                codigo: d.codigo,
                nombre: d.nombre,
                marca: d.marca,
                modelo: d.modelo,
                descripcion: d.descripcion,
                precio: d.precio,
                disponible: d.disponible
            }))

            return JSON.stringify(data);
        }
        return 'Aun no tengo articulos en el catalogo';
    },
    {
        name: 'consult-catalog',
        description: `Usa esta herramienta para obtener la lista de los autos que tienes a disposicion. Este catalogo contiene: 
        codigo = el codigo del auto (No se debe mostrar al usuario, solo usa este codigo cuando vayas a usar otra herramienta para buscar algo especifico del auto),
        nombre = El nombre del auto,
        marca = La marca del auto,
        modelo = El anio de fabricacion del auto,
        descripcion = Una breve descripcion del auto,
        precio = Precio en dolares americanos (USD),
        disponible = Cantidad de autos de este tipo en disposicion para su venta.
        Ten en cuenta que si te preguntan sobre los autos disponibles que tienes tu respuesta debe ser breve, es decir, no des mucho detalle, solo menciona la marca, nombre del auto y el modelo, de los que tengas a disposicion, por ejemplo: 'Ford-EcoSport Titanium modelo 2022'. Si el ususario te pregunta sobre el precio daselo de forma breve, por ejemplo: 'El EcoSport Titanium tiene un precio de 18500 USD'. Y si te pregunta sobre la cantidad disponible que tienes no le digas la cantidad exacta, preguntale cuantos necesita y dile si tenemos o no esa cantidad. Por ningun motivo compartas el url en tu respuesta.
        `
    }
)

export const consultCodeCatalogTool = tool(
    async (input: Record<string, any>, config: RunnableConfig) => {
        console.log('<------------ consultCodeCatalogTool ------------>');
        const filesData = catalogAutosTest;
        if (filesData.length > 0) {
            const data = filesData.map(d => ({
                codigo: d.codigo,
                nombre: d.nombre,
                marca: d.marca,
                modelo: d.modelo
            }))

            return JSON.stringify(data);
        }
        return 'Aun no tengo articulos en el catalogo';
    },
    {
        name: 'consult-code',
        description: `Usa esta herramienta para obtener los datos de los autos, como el codigo, nombre, marca y modelo.`
    }
)

export const consultImageCatalogTool = tool(
    async (input: Record<string, any>, config: RunnableConfig) => {
        console.log('<------------- searchImageCatalogTool ----------->');
        const { codigo } = input;
        console.log('CODIGO:',codigo)
        const accountId = config.configurable?.accountId;
        const conversationId = config.configurable?.conversationId;

        const filesData = catalogAutosTest;
        const auto = filesData.find((a: any) => codigo.toLocaleLowerCase() === a.codigo.toLocaleLowerCase());

        if (auto) {
            const result = await sendFile({ accountId, conversationId, fileUrl: auto.imagen });
            return (result? 
                `Encontré la foto del ${auto.nombre}. Si necesitas más información házmelo saber.`
                :
                `Lo siento, pero tuve problemas al compartir la imagen del ${auto.nombre}.`) 
        }
        else{
            return 'Lo siento, pero no pude encontrar la imagen del auto que solicitas.';
        }
    },
    {
        name: 'consult-image',
        description: 'Usa esta herramienta para buscar y enviar automaticamente la imagen de un auto usando el codigo que tiene en el catalogo.',
        schema: z.object({
            codigo: z.string().describe('Codigo del auto que esta en el catalogo')
        }),
        returnDirect: true
    }
);