from flask_pymongo import PyMongo

class UserModel:
    def __init__(self, app):
        self.mongo = PyMongo(app)

    def create_user(self, name, user, password, email):
        
        datos = {
            "user": user,
            "password": password,
            "name": name,
            "email": email
        }

        self.mongo.db.users.insert_one(datos)

        return {"respuesta": "Usuario creado exitosamente"}




    