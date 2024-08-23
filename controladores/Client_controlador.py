from flask import Blueprint, request, current_app
from models.modelClient import ClientModel

Client_bp = Blueprint('Client', __name__, url_prefix='/Client')

@Client_bp.post("/createClient")
def create_client():
    data = request.json
    client_model = ClientModel(current_app)
    response, status = client_model.create_client(data)
    return response, status

#usar para que el admin vea info de sus clientes

@Client_bp.get("/showClients")
def show_clients():
    client_model = ClientModel(current_app)
    response = client_model.show_clients()
    return response

@Client_bp.get("/viewClient/<id>")
def specific_client(id):
    client_model = ClientModel(current_app)
    response = client_model.specific_client(id)
    return response

@Client_bp.post("/find_client")
def find_client():
    data = request.json
    palabra = data['palabra']
    client_model = ClientModel(current_app)
    response = client_model.find_client(palabra=palabra)
    return response
