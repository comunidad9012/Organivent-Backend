#!/bin/sh
# Esperar hasta que MongoDB esté disponible
while ! nc -z mongo 27017; do
  echo "Esperando a MongoDB..."
  sleep 5
done
echo "MongoDB está arriba"
