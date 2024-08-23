from flask_pymongo import PyMongo
from flask import Response
from bson import json_util
from bson.objectid import ObjectId
import re

class ClientModel:
    def __init__(self, app):
        self.mongo = PyMongo(app)

    def create_client(self, data):
        # Verificar si el DNI_cliente o email ya existe
        existing_client = self.mongo.db.Clientes.find_one({
            "$or": [
                {"DNI_cliente": data['DNI_cliente']},
                {"email": data['email']}
            ]
        })

        if existing_client:
            return {"contenido": "Este DNI o E-mail ya está registrado"}, 400
        
        client_data = {
            'nombre': data['nombre'],
            'DNI_cliente': data['DNI_cliente'],
            'nombre_usuario': data['nombre_usuario'],
            'Contraseña': data['Contraseña'],
            'email': data['email']
        }
        self.mongo.db.Clientes.insert_one(client_data)
        return {"contenido": "Usuario registrado con éxito"}, 201

# Esto lo podemos usar para que los admins vean los clientes que tienen y sacar datos de ellos

    def show_clients(self):
        clients = list(self.mongo.db.Clientes.find().sort('_id', -1))
        for item in clients:
            item['_id'] = str(item['_id'])
        response = json_util.dumps(clients)
        return Response(response, mimetype="application/json")

    def specific_client(self, id):
        client = self.mongo.db.Clientes.find_one({'_id': ObjectId(id)})
        response = json_util.dumps(client)
        return Response(response, mimetype="application/json")
    
    def find_client(self, palabra):
        regex = re.compile(f".*{re.escape(palabra)}.*", re.IGNORECASE)
        clients = list(self.mongo.db.Clientes.find({
            "$or": [
                {"nombre": regex},
                {"email": regex},
                {"nombre_usuario": regex}
            ]
        }).sort('_id', -1))
        
        for item in clients:
            item['_id'] = str(item['_id'])
        
        response = json_util.dumps(clients)
        return Response(response, mimetype="application/json")
