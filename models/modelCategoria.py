from pymongo import MongoClient
from bson.objectid import ObjectId

class Categoria:
    def __init__(self, mongo_uri):
        client = MongoClient(mongo_uri)
        self.db = client.get_database()  # Accede a la base de datos predeterminada
        self.categorias = self.db['Categoria']

    def create_categoria(self, nombre_categoria, descripcion, subcategorias):
        categoria = {
            "nombre_categoria": nombre_categoria,
            "descripcion": descripcion,
            "subcategorias": subcategorias
        }
        result = self.categorias.insert_one(categoria)
        return {'id': str(result.inserted_id)}, 201

    def update_categoria(self, nombre_categoria, update_fields):
        result = self.categorias.update_one(
            {"nombre_categoria": nombre_categoria},
            {"$set": update_fields}
        )
        return {'matched_count': result.matched_count, 'modified_count': result.modified_count}, 200

    def delete_categoria(self, nombre_categoria):
        result = self.categorias.delete_one({"nombre_categoria": nombre_categoria})
        return {'deleted_count': result.deleted_count}, 200

    def get_all_categorias(self):
        categorias = list(self.categorias.find())
        for categoria in categorias:
            categoria['_id'] = str(categoria['_id'])
        return categorias

    def get_categoria_by_nombre(self, nombre_categoria):
        categoria = self.categorias.find_one({"nombre_categoria": nombre_categoria})
        if categoria:
            categoria['_id'] = str(categoria['_id'])
        return categoria
