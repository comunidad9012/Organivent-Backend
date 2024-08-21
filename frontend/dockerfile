# Usar una imagen base de Node.js
FROM node:14

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Construir la aplicación para desarrollo
CMD ["npm", "start"]

# Exponer el puerto que el servidor web utilizará
EXPOSE 3000
