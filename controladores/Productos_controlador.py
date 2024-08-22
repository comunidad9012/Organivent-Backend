from flask import Blueprint, request, current_app
from models.modelProductos import ProductosModel

Productos_bp = Blueprint('Productos', __name__, url_prefix='/Productos')

@Productos_bp.post("/createProductos")
def create_Productos():
    data = request.json
    Productos_model = ProductosModel(current_app)
    response = Productos_model.create_Productos(data)
    return response

# arreglar que si o si tiene que tener contenido la noticia para crearla

@Productos_bp.get("/showProductos") #CAMBIE LA PETICION POST POR GET, YA QUE CON ESTO QUEREMOS TRAER LOS DATOS EN EL FRONT
def show_Productos():
    Productos_model=ProductosModel(current_app)
    response=Productos_model.show_Productos()
    return response

@Productos_bp.get("/viewProductos/<id>")
def specific_product(id):
    Productos_model=ProductosModel(current_app)
    response=(Productos_model.specific_product(id)).json
    return response

@Productos_bp.post("/find_product") #cambie por post para poder usar el formulario, si lo puedo arreglar la vuelvo a get
def find_product():
    data=request.json
    palabra = data['palabra'] 
    Productos_model = ProductosModel(current_app)
    response = Productos_model.find_Productos(palabra=palabra)
    return response