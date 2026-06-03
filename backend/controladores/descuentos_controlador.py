from flask import Blueprint, request, current_app, jsonify
from models.modelDescuentos import Descuento
from datetime import datetime

Descuentos_bp = Blueprint("Descuentos", __name__, url_prefix="/Descuentos")


# Crear un descuento
@Descuentos_bp.post("/createDescuento")
def create_descuento():
    data = request.json
    if not data:
        return jsonify({"error": "Se requieren datos"}), 400

    try:
        descuento_model = Descuento(current_app)
        inserted_id = descuento_model.crear_descuento(data)
        return jsonify({"message": "Descuento creado con éxito", "id": inserted_id}), 201
    except Exception as e:
        return jsonify({"error": f"Error al crear el descuento: {str(e)}"}), 500

# Obtener todos los descuentos con detalles de productos y categorías
@Descuentos_bp.get("/showDescuentos")
def show_descuentos_con_detalles():
    descuento_model = Descuento(current_app)
    descuentos = descuento_model.obtener_todos_con_detalles() #esto es lo unico que lo diferencia

    # Convertir ObjectId y fechas
    for d in descuentos:
        d["_id"] = str(d["_id"])
        if "fecha_inicio" in d and d["fecha_inicio"]:
            d["fecha_inicio"] = d["fecha_inicio"].isoformat()
        if "fecha_fin" in d and d["fecha_fin"]:
            d["fecha_fin"] = d["fecha_fin"].isoformat()

    return jsonify(descuentos), 200

# Obtener solo descuentos activos
@Descuentos_bp.get("/activos")
def descuentos_activos():
    descuento_model = Descuento(current_app)
    activos = descuento_model.obtener_descuentos_activos()

    for d in activos:
        d["_id"] = str(d["_id"])
        if "fecha_inicio" in d and d["fecha_inicio"]:
            d["fecha_inicio"] = d["fecha_inicio"].isoformat()
        if "fecha_fin" in d and d["fecha_fin"]:
            d["fecha_fin"] = d["fecha_fin"].isoformat()

    return jsonify(activos), 200


@Descuentos_bp.post("/validarCupon")
def validar_cupon():
    data = request.json

    if not data:
        return jsonify({"error": "Se requieren datos"}), 400

    codigo = data.get("codigo", "").strip().upper()
    productos = data.get("productos", [])

    if not codigo:
        return jsonify({"error": "Ingresá un código de cupón"}), 400

    if not productos:
        return jsonify({"error": "El carrito está vacío"}), 400

    descuento_model = Descuento(current_app)
    cupon = descuento_model.obtener_por_codigo(codigo)

    if not cupon:
        return jsonify({"error": "Cupón inválido o inactivo"}), 404

    hoy = datetime.now()

    if cupon.get("fecha_inicio") and cupon["fecha_inicio"] > hoy:
        return jsonify({"error": "El cupón todavía no está disponible"}), 400

    if cupon.get("fecha_fin") and cupon["fecha_fin"] < hoy:
        return jsonify({"error": "El cupón está vencido"}), 400

    productos_cupon = [str(p) for p in cupon.get("productos", [])]
    categorias_cupon = [str(c) for c in cupon.get("categorias", [])]

    total_original = 0
    total_con_cupon = 0
    descuento_total = 0
    productos_aplicados = []

    for item in productos:
        producto_id = str(item.get("_id") or item.get("productoId"))
        categoria_id = str(item.get("categoria", ""))
        cantidad = int(item.get("quantity") or item.get("cantidad") or 1)

        precio_base = float(
            item.get("precio_final")
            or item.get("precio_venta")
            or item.get("precio_original")
            or 0
        )

        subtotal_original = precio_base * cantidad
        subtotal_final = subtotal_original

        aplica_por_producto = producto_id in productos_cupon
        aplica_por_categoria = categoria_id in categorias_cupon
        aplica_general = not productos_cupon and not categorias_cupon

        if aplica_general or aplica_por_producto or aplica_por_categoria:
            if cupon["tipo"] == "porcentaje":
                descuento_item = subtotal_original * (float(cupon["valor"]) / 100)
            elif cupon["tipo"] == "monto":
                descuento_item = min(float(cupon["valor"]), subtotal_original)
            else:
                descuento_item = 0

            subtotal_final = subtotal_original - descuento_item
            descuento_total += descuento_item

            productos_aplicados.append({
                "productoId": producto_id,
                "descuento": round(descuento_item, 2)
            })

        total_original += subtotal_original
        total_con_cupon += subtotal_final

    if descuento_total <= 0:
        return jsonify({"error": "El cupón no aplica a los productos del carrito"}), 400

    return jsonify({
        "ok": True,
        "codigo": cupon.get("codigo"),
        "nombre": cupon.get("nombre"),
        "tipo": cupon.get("tipo"),
        "valor": cupon.get("valor"),
        "descuento_total": round(descuento_total, 2),
        "total_original": round(total_original, 2),
        "total_final": round(total_con_cupon, 2),
        "productos_aplicados": productos_aplicados
    }), 200

# Eliminar un descuento
@Descuentos_bp.delete("/deleteDescuentos/<id>")
def delete_descuento(id):
    descuento_model = Descuento(current_app)
    if descuento_model.eliminar(id):
        return jsonify({"message": "Descuento eliminado con éxito"}), 200
    else:
        return jsonify({"error": "Descuento no encontrado"}), 404


@Descuentos_bp.get("/viewDiscount/<id>")
def specific_discount(id):
    descuento_model = Descuento(current_app)
    descuento = descuento_model.get_discount_by_id(id)
    # print("FUNCIONOOOO esto trae del descuento: ", descuento)

    if not descuento:
        return jsonify({"error": "Descuento no encontrado"}), 404

    return jsonify(descuento), 200


# controlador descuentos
@Descuentos_bp.put("/update/<id>")
def update_descuento(id):
    data = request.json
    descuento_model = Descuento(current_app)

    actualizado = descuento_model.actualizar(id, data)
    if actualizado:
        return jsonify({"message": "Descuento actualizado con éxito"}), 200
    else:
        return jsonify({"error": "No se encontró el descuento"}), 404

