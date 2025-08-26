# DESARROLLO
## Instalacion de dependencias
- Antes de correr el proyecto es necesario hacer las instalaciones necesarias, para ello ejecuta el siguiente comando en la terminal, apuntando a la raíz del proyecto.
```bash
npm install
```


## Iniciar servidor
- Para correr esta aplicación se recomienda ejecutarla con 2 terminales. La primera ejecutara TypeScript y la segunda ejecutara JavaScript, ambas en modo observador.
```bash
#bash(1)
tsc --watch
```
```bash
#bash(2)
nodemon build/app.js
```

1. En el promp que revise el historial y lo use de contexto
2. Sacar promp de agente de soporte para probar.
3. Que el cliente pueda pasar una foto y que el agente pueda entender la imagen y extraiga la informacion para pasar la info al agente de soporte
4. que el promp sea parametrizable.
5. Agendar reuniones con Google Calendar (Ver MCP que manejen calendarios Google y Microsoft).


Para ejecutar el servicio en produccion
pm2 start npm --name agentic -- run start


npm run build
pm2 restart 0
