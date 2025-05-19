# Blueprint: Permite crear módulos separados para diferentes partes de la aplicación.
# request: Para acceder a los datos enviados en las solicitudes HTTP.
# current_app: Hace referencia a la aplicación Flask activa.

from flask import Blueprint, request, current_app, jsonify
from models.modelProductos import ProductosModel

Productos_bp = Blueprint('Productos', __name__, url_prefix='/Productos')

#para validar info de los productoss
def validate_product_data(data):
    required_fiedls=['nombre', 'precio','imagen_url']
    for field in required_fields:
        if not data.get(field):
            return False
        return True

@Productos_bp.post("/createProductos")
def create_Productos():
    data = request.json  #Obtiene los datos enviados en la solicitud como un diccionario JSON.
    
    #valida la data obligatoria
    if not validate_product_data(data):
        return jsonify({"message": "Error al crear producto, faltan campos obligatorios"}), 400

    #verificar url de la imagen
    if not data['imagen_url'].startswith('http'):
        return jsonify({"message": "Error al crear producto, la url de la imagen no es válida"}), 400
    try:
        Productos_model = ProductosModel(current_app) #Instancia el modelo de productos, conectándolo con la aplicación Flask activa.
        response = Productos_model.create_Productos(data)#Llama al método del modelo para crear el producto con los datos proporcionados.
        return jsonify(response)#Devuelve la respuesta al cliente.
    except Exception as e:
        return jsonify({"error": str(e)}), 500
            

@Productos_bp.get("/showProductos")
def show_Productos():
    try:
        Productos_model = ProductosModel(current_app)
        productos = Productos_model.show_Productos()
        return jsonify(productos)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@Productos_bp.get("/viewProductos/<id>")
def specific_product(id):
    try:
        Productos_model = ProductosModel(current_app)
        producto = Productos_model.view_product(id)
        if not producto:
            return jsonify({"message": "Producto no encontrado"}), 404
        return jsonify(producto)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@Productos_bp.post("/find_product")
def find_product():
    data = request.json
    if not data or 'palabra' not in data:
        return jsonify({"error": "No se proporcionó la palabra a buscar"}), 400
        
    try:
        palabra = data['palabra'].strip()
        if not palabra:
            return jsonify({"error": "La palabra de búsqueda no puede estar vacía"}), 400
            
        Productos_model = ProductosModel(current_app)
        resultados = Productos_model.find_Productos(palabra=palabra)
        return jsonify(resultados)
    except Exception as e:
        return jsonify({"error": str(e)}), 500