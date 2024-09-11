# Usa una imagen base de Python
FROM python:3.9

# Establece el directorio de trabajo
WORKDIR /app

# Copia el archivo requirements.txt y lo instala
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copia el resto de los archivos del proyecto
COPY . .

# Asegura que wait-for-mongo.sh tenga permisos de ejecución
RUN chmod +x ./wait-for-mongo.sh

# Instala netcat para que el script wait-for-mongo.sh funcione
RUN apt-get update && apt-get install -y netcat-openbsd

# Expone el puerto 5000
EXPOSE 5000

# Comando para ejecutar el script de espera antes de iniciar la aplicación
CMD ["sh", "-c", "./wait-for-mongo.sh && python main.py"]
