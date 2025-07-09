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