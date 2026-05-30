from datetime import datetime


def crear_banner_modelo(
    titulo,
    descripcion,
    texto_boton,
    link_boton,
    imagen_url=None,
    activo=True,
    orden=1
):
    return {
        "titulo": titulo,
        "descripcion": descripcion,
        "texto_boton": texto_boton,
        "link_boton": link_boton,
        "imagen_url": imagen_url,
        "activo": activo,
        "orden": orden,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }


def actualizar_banner_modelo(
    titulo=None,
    descripcion=None,
    texto_boton=None,
    link_boton=None,
    imagen_url=None,
    activo=None,
    orden=None
):
    data = {}

    if titulo is not None:
        data["titulo"] = titulo

    if descripcion is not None:
        data["descripcion"] = descripcion

    if texto_boton is not None:
        data["texto_boton"] = texto_boton

    if link_boton is not None:
        data["link_boton"] = link_boton

    if imagen_url is not None:
        data["imagen_url"] = imagen_url

    if activo is not None:
        data["activo"] = activo

    if orden is not None:
        data["orden"] = orden

    data["updated_at"] = datetime.utcnow()

    return data