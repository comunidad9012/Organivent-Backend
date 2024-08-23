from flask_pymongo import PyMongo
from flask import Response
from bson import json_util
from bson.objectid import ObjectId
import re
    
class ProductosModel:
    def __init__(self, app):
        self.mongo = PyMongo(app)

    def create_Productos(self, data):
        if 'nombre_producto' in data:
            Productos_data = {
                'nombre_producto':data['nombre_producto'], 
                'descripcion':data['descripcion'],
                'precio_venta':data['precio_venta'],
                #'stock':data['stock'],
                'miniatura':data['miniatura']}
            self.mongo.db.Productos.insert_one(Productos_data)
            return {"contenido": "exitoso"}
        else:
            return {"contenido": "no funciona"}
        
    def show_Productos(self):
        Productos=list(self.mongo.db.Productos.find().sort('_id', -1))
        for item in Productos:
            item['_id'] = str(item['_id'])
        response=json_util.dumps(Productos)
        return Response(response, mimetype="application/json")

    def specific_product(self,id):
        Productos=self.mongo.db.Productos.find_one({'_id': ObjectId(id), })
        response=json_util.dumps(Productos)
        return Response(response, mimetype="application/json")
    
    def find_Productos(self, palabra):
        regex = re.compile(f".*{re.escape(palabra)}.*", re.IGNORECASE)
        Productos = list(self.mongo.db.Productos.find({
            "$or": [
                {"nombre_producto": regex}, #aca seguro cambia tambien
                {"noticia": regex} #serà descripcion aca? ESTOS SON LOS QUE BUSCAN NUNCA LO PROBE (re)
            ]
        }).sort('_id', -1))
        
        for item in Productos:
            item['_id'] = str(item['_id'])
        
        response = json_util.dumps(Productos)
        return Response(response, mimetype="application/json")