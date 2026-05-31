from flask import Blueprint, request, jsonify, current_app
from bson import ObjectId
from datetime import datetime
from werkzeug.utils import secure_filename
import uuid

from utils.minio_client import client
from models.modelBanner import crear_banner_modelo, actualizar_banner_modelo


Banner_bp = Blueprint("Banner_bp", __name__, url_prefix="/api/banners")


BUCKET_NAME = "product-images"


def convertir_banner(banner):
    banner["_id"] = str(banner["_id"])

    if "created_at" in banner:
        banner["created_at"] = banner["created_at"].isoformat()

    if "updated_at" in banner:
        banner["updated_at"] = banner["updated_at"].isoformat()

    return banner


@Banner_bp.route("/", methods=["GET"])
def obtener_banners():
    try:
        banners = list(
            current_app.mongo.db.banners.find().sort("orden", 1)
        )

        banners = [convertir_banner(banner) for banner in banners]

        return jsonify(banners), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@Banner_bp.route("/activos", methods=["GET"])
def obtener_banners_activos():
    try:
        banners = list(
            current_app.mongo.db.banners.find({"activo": True}).sort("orden", 1)
        )

        banners = [convertir_banner(banner) for banner in banners]

        return jsonify(banners), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@Banner_bp.route("/", methods=["POST"])
def crear_banner():
    try:
        titulo = request.form.get("titulo")
        descripcion = request.form.get("descripcion")
        texto_boton = request.form.get("texto_boton")
        link_boton = request.form.get("link_boton")
        activo = request.form.get("activo", "true") == "true"
        orden = int(request.form.get("orden", 1))
        color_fondo = request.form.get("color_fondo")
        color_titulo = request.form.get("color_titulo")
        color_descripcion = request.form.get("color_descripcion")
        color_boton = request.form.get("color_boton")
        color_texto_boton = request.form.get("color_texto_boton")

        imagen = request.files.get("imagen")
        imagen_url = None

        if imagen:
            filename = secure_filename(imagen.filename)
            extension = filename.rsplit(".", 1)[-1]
            object_name = f"banners/{uuid.uuid4()}.{extension}"

            client.put_object(
                BUCKET_NAME,
                object_name,
                imagen.stream,
                length=-1,
                part_size=10 * 1024 * 1024,
                content_type=imagen.content_type
            )

            imagen_url = f"http://localhost:9000/{BUCKET_NAME}/{object_name}"

        nuevo_banner = crear_banner_modelo(
            titulo=titulo,
            descripcion=descripcion,
            texto_boton=texto_boton,
            link_boton=link_boton,
            imagen_url=imagen_url,
            activo=activo,
            orden=orden,
            color_fondo=color_fondo,
            color_titulo=color_titulo,
            color_descripcion=color_descripcion,
            color_boton=color_boton,
            color_texto_boton=color_texto_boton
        )

        resultado = current_app.mongo.db.banners.insert_one(nuevo_banner)

        return jsonify({
            "mensaje": "Banner creado correctamente",
            "id": str(resultado.inserted_id)
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@Banner_bp.route("/<banner_id>", methods=["PUT"])
def actualizar_banner(banner_id):
    try:
        titulo = request.form.get("titulo")
        descripcion = request.form.get("descripcion")
        texto_boton = request.form.get("texto_boton")
        link_boton = request.form.get("link_boton")
        color_fondo = request.form.get("color_fondo")
        color_titulo = request.form.get("color_titulo")
        color_descripcion = request.form.get("color_descripcion")
        color_boton = request.form.get("color_boton")
        color_texto_boton = request.form.get("color_texto_boton")

        activo = request.form.get("activo")
        if activo is not None:
            activo = activo == "true"

        orden = request.form.get("orden")
        if orden is not None:
            orden = int(orden)

        imagen = request.files.get("imagen")
        imagen_url = None

        if imagen:
            filename = secure_filename(imagen.filename)
            extension = filename.rsplit(".", 1)[-1]
            object_name = f"banners/{uuid.uuid4()}.{extension}"

            client.put_object(
                BUCKET_NAME,
                object_name,
                imagen.stream,
                length=-1,
                part_size=10 * 1024 * 1024,
                content_type=imagen.content_type
            )

            imagen_url = f"http://localhost:9000/{BUCKET_NAME}/{object_name}"

        data = actualizar_banner_modelo(
            titulo=titulo,
            descripcion=descripcion,
            texto_boton=texto_boton,
            link_boton=link_boton,
            imagen_url=imagen_url,
            activo=activo,
            orden=orden,
            color_fondo=color_fondo,
            color_titulo=color_titulo,
            color_descripcion=color_descripcion,
            color_boton=color_boton,
            color_texto_boton=color_texto_boton
        )

        current_app.mongo.db.banners.update_one(
            {"_id": ObjectId(banner_id)},
            {"$set": data}
        )

        return jsonify({"mensaje": "Banner actualizado correctamente"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@Banner_bp.route("/<banner_id>", methods=["DELETE"])
def eliminar_banner(banner_id):
    try:
        current_app.mongo.db.banners.delete_one({"_id": ObjectId(banner_id)})

        return jsonify({"mensaje": "Banner eliminado correctamente"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500