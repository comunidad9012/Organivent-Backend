from flask import Blueprint, request, current_app
from models.modelCategoria import Categoria

Categoria_bp = Blueprint('Categoria', __name__, url_prefix='/Categoria')

@Categoria_bp.get("/showCategorias")
def get_categorias():
    # Accede a mongo a través de current_app
    categoria_model = Categoria(current_app.config['MONGO_URI'])  # Inicializa con la URI de MongoDB
    response = categoria_model.get_all_categorias()
    return response

@Categoria_bp.get("/viewCategoria/<nombre_categoria>")
def get_categoria(nombre_categoria):
    # Accede a mongo a través de current_app
    categoria_model = Categoria(current_app.config['MONGO_URI'])  # Inicializa con la URI de MongoDB
    response = categoria_model.get_categoria_by_nombre(nombre_categoria)
    return response

@Categoria_bp.post("/createCategoria")
def create_categoria():
    data = request.json
    # Accede a mongo a través de current_app
    categoria_model = Categoria(current_app.config['MONGO_URI'])  # Inicializa con la URI de MongoDB
    response, status = categoria_model.create_categoria(data['nombre_categoria'], data['descripcion'], data['subcategorias'])
    return response, status

@Categoria_bp.put("/updateCategoria/<nombre_categoria>")
def update_categoria(nombre_categoria):
    data = request.json
    # Accede a mongo a través de current_app
    categoria_model = Categoria(current_app.config['MONGO_URI'])  # Inicializa con la URI de MongoDB
    response, status = categoria_model.update_categoria(nombre_categoria, data)
    return response, status

@Categoria_bp.delete("/deleteCategoria/<nombre_categoria>")
def delete_categoria(nombre_categoria):
    # Accede a mongo a través de current_app
    categoria_model = Categoria(current_app.config['MONGO_URI'])  # Inicializa con la URI de MongoDB
    response, status = categoria_model.delete_categoria(nombre_categoria)
    return response, status
