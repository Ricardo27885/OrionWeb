# Usar imagen base de Node.js con Alpine (versión LTS)
FROM node:18-alpine

# Establecer directorio de trabajo dentro del contenedor
WORKDIR /api

# 1. Copiar archivos de dependencias primero para aprovechar caché de Docker
COPY package*.json ./

# 2. Instalar dependencias (producción)
RUN npm install

# 3. Copiar todo el código fuente de la aplicación
COPY . .


# Exponer el puerto de la aplicación (mismo que en tu server.js)
EXPOSE 8000

# Comando para iniciar la aplicación
CMD ["node", "server.js"]