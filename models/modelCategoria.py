from pymongo import MongoClient
from bson.objectid import ObjectId

class Categoria:
    def __init__(self, db):
        self.categorias = db['Categoria']  

    def create_categoria(self, nombre_categoria, descripcion, subcategorias):
        categoria = {
            "nombre_categoria": nombre_categoria,
            "descripcion": descripcion,
            "subcategorias": subcategorias
        }
        return self.categorias.insert_one(categoria) 

    def update_categoria(self, categoria_id, update_fields):
        return self.categorias.update_one(
            {"_id": ObjectId(categoria_id)},
            {"$set": update_fields}
        )

    def delete_categoria(self, categoria_id):
        return self.categorias.delete_one({"_id": ObjectId(categoria_id)})

    def get_all_categorias(self):
        return list(self.categorias.find()) 

    def get_categoria_by_id(self, categoria_id):
        return self.categorias.find_one({"_id": ObjectId(categoria_id)})  
