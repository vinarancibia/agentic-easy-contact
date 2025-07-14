import { z } from 'zod';
import { tool } from '@langchain/core/tools';
import fs from 'fs';
import path from 'path';

export const consultCatalogTool = tool(
    async (input, config) => {
        const filePath = path.join(__dirname, '..', 'test', 'catalogo-autos.json');
        const jsonString: string = fs.readFileSync(filePath, 'utf8');

        return jsonString;
    },
    {
        name: 'consult-catalog',
        description: `Usa esta herramienta para consultar el catalogo de autos que tienes a disposicion. Este catalogo contiene: 
        codigo = El codigo o identificador del auto,
        nombre = El nombre del auto,
        marca = La marca del auto,
        modelo = El anio de fabricacion del auto,
        descripcion = Una breve descripcion del auto,
        precio = Precio en dolares americanos (USD),
        imagen = Url de la imagen del auto,
        disponible = Cantidad de autos de este tipo en disposicion para su venta
        Ten en cuenta que si te preguntan sobre los autos disponibles que tienes tu respuesta debe ser breve, es decir, no des mucho detalle, solo menciona la marca, nombre del auto y su modelo, de los que tengas a disposicion, por ejemplo: 'Ford-EcoSport Titanium modelo 2022'. Si el ususario te pregunta sobre el precio daselo de forma breve, por ejemplo: 'El EcoSport Titanium tiene un precio de 18500 Bs'. Y si te pregunta sobre la cantidad disponible que tienes no le digas la cantidad exacta, preguntale cuantos necesita y dile si tenemos o no esa cantidad. Por ningun motivo compartas el url en tu respuesta.
        `
    }
)

export const searchImageCatalogTool = tool(
    async (input, config) => {
        const { codigo } = input;
        const autosFilePath = path.join(__dirname, "..", "test", "autos.json");
        const autosData = JSON.parse(fs.readFileSync(autosFilePath, "utf8"));
        const auto = autosData.find((a: any) => a.codigo === codigo);
        console.log(auto)

        if (auto) return `Encontré el auto que buscas: ${auto.nombre} ${auto.marca}, modelo ${auto.modelo}.`;
        else return  'Lo siento, no encontre la imagen del auto.';
    },
    {
        name: 'search-image',
        description: 'Usa esta herramienta para buscar la imagen de uno de los autos que se encuentran en el catalogo. Pero solo mencionale el nombre del auto, su marca y modelo, nada mas.',
        schema: z.object({
            codigo: z.string().describe('Codigo del auto que esta en el catalogo')
        })
    }
);