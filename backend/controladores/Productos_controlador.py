# Blueprint: Permite crear módulos separados para diferentes partes de la aplicación.
# request: Para acceder a los datos enviados en las solicitudes HTTP.
# current_app: Hace referencia a la aplicación Flask activa.

from flask import Blueprint, request, current_app
from models.modelProductos import ProductosModel

Productos_bp = Blueprint('Productos', __name__, url_prefix='/Productos')

@Productos_bp.post("/createProductos")
def create_Productos():
    data = request.json  #Obtiene los datos enviados en la solicitud como un diccionario JSON.
    Productos_model = ProductosModel(current_app)  #Instancia el modelo de productos, conectándolo con la aplicación Flask activa.
    response = Productos_model.create_Productos(data) #Llama al método del modelo para crear el producto con los datos proporcionados.
    return response #Devuelve la respuesta al cliente.

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