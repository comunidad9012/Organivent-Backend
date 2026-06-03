from flask_pymongo import PyMongo
from flask import Response
from bson import json_util
from bson.objectid import ObjectId
from datetime import datetime

class PedidosModel:
    ESTADOS_VALIDOS = ["Pendiente", "Aceptado", "Listo para la entrega", "Cancelado", "Entregado"]

    def __init__(self, app):
        self.mongo = PyMongo(app)


    def create_pedido(self, data):
        print("📦 Creando pedido en el modelo con datos del payload:", data)
        if 'usuarioId' in data and 'productos' in data and data['productos']:
            print("dentro del if")
            productos_finales = []
            total = 0

            for prod in data['productos']:
                producto_db = self.mongo.db.Productos.find_one({"_id": ObjectId(prod["productoId"])})
                print("dentor del for, se encontró el producto:", producto_db)
                if not producto_db:
                    continue

                precio_original = float(prod.get("precio_original", 0))
                precio_final = float(prod.get("precio_final", precio_original))
                print("precio original:", precio_original, "precio final:", precio_final)
                descuento = prod.get("descuento_aplicado")

                cantidad = prod.get("cantidad", 1)
                subtotal = precio_final * cantidad
                total += subtotal

                productos_finales.append({
                    "productoId": prod["productoId"],
                    "productoNombre": prod.get("nombre", producto_db.get("nombre_producto", "Producto sin nombre")),
                    "cantidad": cantidad,
                    "color": prod.get("color"),
                    "precio_original": precio_original,
                    "precio_final": precio_final,
                    "precio_unitario": precio_final,
                    "descuento_aplicado": descuento,
                    "subtotal": subtotal,
                    "imagenes": prod.get("imagenes", producto_db.get("imagenes", []))
                })
                print("Producto añadido al pedido:", productos_finales[-1])

            subtotal_productos = total
            descuento_cupon = float(data.get("descuento_cupon", 0) or 0)
            total_final = float(data.get("total", subtotal_productos) or subtotal_productos)

            if descuento_cupon > 0:
                total_final = max(subtotal_productos - descuento_cupon, 0)

            pedido_data = {
                'usuarioId': data['usuarioId'],
                'cliente_nombre': data.get('cliente_nombre'),
                'cliente_email': data.get('cliente_email'),
                'productos': productos_finales,

                # Totales
                'subtotal': subtotal_productos,
                'descuento_cupon': descuento_cupon,
                'total': total_final,

                # Cupón aplicado
                'cupon': data.get('cupon'),

                'estado': 'Pendiente',
                'fecha': datetime.now()
            }

            result = self.mongo.db.Pedidos.insert_one(pedido_data)

            # print("📧 cliente_email recibido:", data.get("cliente_email"))

            return {
                "mensaje": "Pedido creado exitosamente",
                "pedido_id": str(result.inserted_id),
                "cliente_email": pedido_data.get("cliente_email"),
                "cliente_nombre": pedido_data.get("cliente_nombre"),
                "total": total_final
            }
        else:
            return {"error": "Datos insuficientes para crear el pedido"}


    def show_pedidos(self):
        # Devuelve todos los pedidos (admin)
        pedidos = list(self.mongo.db.Pedidos.find().sort('_id', -1))
        return self._serialize_pedidos(pedidos)


    def _obtener_imagenes_producto(self, imagenes):
        imagenes_limpias = []

        if not imagenes:
            return imagenes_limpias

        for img in imagenes:
            # Si ya viene como objeto con url
            if isinstance(img, dict) and img.get("url"):
                imagenes_limpias.append({
                    "_id": str(img.get("_id", "")),
                    "filename": img.get("filename"),
                    "url": img.get("url")
                })
                continue

            # Si viene como ObjectId o string
            try:
                img_id = ObjectId(str(img))
            except Exception:
                continue

            imagen_db = self.mongo.db.Imagenes.find_one({"_id": img_id})

            if imagen_db:
                imagenes_limpias.append({
                    "_id": str(imagen_db["_id"]),
                    "filename": imagen_db.get("filename"),
                    "url": imagen_db.get("url")
                })

        return imagenes_limpias


    def productos_mas_vendidos(self, limite=8):
        pipeline = [
            {
                "$match": {
                    "estado": {"$ne": "Cancelado"}
                }
            },
            {
                "$unwind": "$productos"
            },
            {
                "$group": {
                    "_id": "$productos.productoId",
                    "unidades_vendidas": {
                        "$sum": "$productos.cantidad"
                    },
                    "total_recaudado": {
                        "$sum": "$productos.subtotal"
                    },
                    "imagenes_pedido": {
                        "$first": "$productos.imagenes"
                    }
                }
            },
            {
                "$sort": {
                    "unidades_vendidas": -1
                }
            },
            {
                "$limit": limite
            }
        ]

        ranking = list(self.mongo.db.Pedidos.aggregate(pipeline))
        productos_finales = []

        for item in ranking:
            producto_id = item["_id"]

            try:
                producto = self.mongo.db.Productos.find_one({
                    "_id": ObjectId(producto_id)
                })
            except Exception:
                producto = None

            if not producto:
                continue

            imagenes_limpias = self._obtener_imagenes_producto(
                producto.get("imagenes", [])
            )

            if not imagenes_limpias:
                imagenes_limpias = self._obtener_imagenes_producto(
                    item.get("imagenes_pedido", [])
                )

            productos_finales.append({
                "_id": str(producto["_id"]),
                "nombre_producto": producto.get("nombre_producto"),
                "descripcion": producto.get("descripcion"),
                "precio_venta": producto.get("precio_venta"),
                "precio_original": producto.get("precio_original", producto.get("precio_venta")),
                "precio_final": producto.get("precio_final", producto.get("precio_venta")),
                "imagenes": imagenes_limpias,
                "categoria": str(producto.get("categoria", "")),
                "unidades_vendidas": item.get("unidades_vendidas", 0),
                "total_recaudado": round(item.get("total_recaudado", 0), 2),
            })

        return productos_finales


    def show_pedidos_by_user(self, user_id):
        # Devuelve los pedidos de un usuario específico.
        pedidos = list(self.mongo.db.Pedidos.find({"usuarioId": user_id}).sort('_id', -1))
        return self._serialize_pedidos(pedidos)


    def _serialize_pedidos(self, pedidos):
        for pedido in pedidos:
            self._serialize_pedido(pedido)
        return Response(json_util.dumps(pedidos), mimetype="application/json")


    def _serialize_pedido(self, pedido):
        pedido['_id'] = str(pedido['_id'])
        pedido['usuarioId'] = str(pedido['usuarioId'])

        usuario = self.mongo.db.Clientes.find_one({"_id": ObjectId(pedido["usuarioId"])})
        pedido["usuarioNombre"] = usuario["nombre"] if usuario else "Usuario no encontrado"
        pedido["usuarioEmail"] = usuario["email"] if usuario else "Email no encontrado"

        for prod in pedido.get("productos", []):
            producto = self.mongo.db.Productos.find_one({"_id": ObjectId(prod["productoId"])})
            if producto:
                # ✅ Solo agrego info extra, no piso precios que ya estaban en el pedido
                prod["productoNombre"] = producto.get("nombre_producto", prod.get("productoNombre", "Producto sin nombre"))

                #lookup de imágenes
                image_ids = producto.get("imagenes", [])
                imgs = list(self.mongo.db.Imagenes.find({"_id": {"$in": image_ids}}))
                for img in imgs:
                    img["_id"] = str(img["_id"])
                prod["imagenes"] = imgs
            else:
                prod["productoNombre"] = "Producto no encontrado"
                prod["imagenes"] = []

            # Asegurarse de que el id siempre sea string
            prod["productoId"] = str(prod["productoId"])


        return pedido


    def get_pedido_by_id_raw(self, pedido_id):
        #   Obtiene un pedido sin serializar (dict de Mongo) o None
        try:
            return self.mongo.db.Pedidos.find_one({"_id": ObjectId(pedido_id)})
        except Exception:
            return None


    def delete_pedido(self, pedido_id):
        try:
            result = self.mongo.db.Pedidos.delete_one({"_id": ObjectId(pedido_id)})
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error al eliminar el pedido: {e}")
            return False


    def update_pedido(self, pedido_id, data):
        try:
            result = self.mongo.db.Pedidos.update_one(
                {"_id": ObjectId(pedido_id)},
                {"$set": data}
            )
            if result.matched_count > 0:
                return {"mensaje": "Pedido actualizado con éxito"}, 200
            else:
                return {"error": "No se encontró el pedido"}, 404
        except Exception as e:
            print(f"Error al actualizar el pedido: {e}")
            return {"error": "Error interno"}, 500


    def update_state(self, pedido_id, nuevo_estado):
        if nuevo_estado not in self.ESTADOS_VALIDOS:
            raise ValueError("Estado no reconocido.")

        pedido = self.mongo.db.Pedidos.find_one({"_id": ObjectId(pedido_id)})
        if not pedido:
            raise ValueError("Pedido no encontrado.")

        result = self.mongo.db.Pedidos.update_one(
            {"_id": ObjectId(pedido_id)},
            {"$set": {"estado": nuevo_estado}}
        )

        if result.modified_count == 0:
            raise ValueError("El estado no fue modificado.")
