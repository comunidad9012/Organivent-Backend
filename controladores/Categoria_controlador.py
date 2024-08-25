from flask import Blueprint, request, current_app
from models.modelCategoria import Categoria #lo cambie de CategoriaModel a Categoria

Categoria_bp = Blueprint('Categoria', __name__, url_prefix='/Categoria')

@Categoria_bp.get("/showCategorias")
def get_categorias():
    categoria_model = Categoria(current_app)
    response = categoria_model.get_all_categorias()
    return response

@Categoria_bp.get("/viewCategoria/<id>")
def get_categoria(id):
    categoria_model = Categoria(current_app)
    response = categoria_model.get_categoria_by_id(id)
    return response

@Categoria_bp.post("/createCategoria")
def create_categoria():
    data = request.json
    categoria_model = Categoria(current_app)
    response, status = categoria_model.create_categoria(data)
    return response, status

@Categoria_bp.put("/updateCategoria/<id>")
def update_categoria(id):
    data = request.json
    categoria_model = Categoria(current_app)
    response, status = categoria_model.update_categoria(id, data)
    return response, status

@Categoria_bp.delete("/deleteCategoria/<id>")
def delete_categoria(id):
    categoria_model = Categoria(current_app)
    response, status = categoria_model.delete_categoria(id)
    return response, status
