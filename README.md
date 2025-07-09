# DESARROLLO
## Iniciar Proyecto
1. En el bash ejecuta `npm i`
2. Copia el archivo `.env.template` y cambia su nombre a `.env`. Despues agrega tu OpenAi Api Key. 
- Ejemplo:
```bash
#.env
OPENAI_API_KEY=PegaAquiTu-OpenAiApiKey
PORT=3000
```
3. Ejecuta el siguiente comando para levantar el proyecto en modo desarrollo. 
```bash
npx -y tsx src/main.ts
```