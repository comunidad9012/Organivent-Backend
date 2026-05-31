from datetime import datetime


def crear_banner_modelo(
    titulo,
    descripcion,
    texto_boton,
    link_boton,
    imagen_url=None,
    activo=True,
    orden=1,
    color_fondo=None,
    color_titulo=None,
    color_descripcion=None,
    color_boton=None,
    color_texto_boton=None
):
    return {
        "titulo": titulo,
        "descripcion": descripcion,
        "texto_boton": texto_boton,
        "link_boton": link_boton,
        "imagen_url": imagen_url,
        "activo": activo,
        "orden": orden,
        "color_fondo": color_fondo,
        "color_titulo": color_titulo,
        "color_descripcion": color_descripcion,
        "color_boton": color_boton,
        "color_texto_boton": color_texto_boton,
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
    orden=None,
    color_fondo=None,
    color_titulo=None,
    color_descripcion=None,
    color_boton=None,
    color_texto_boton=None
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

    if color_fondo is not None:
        data["color_fondo"] = color_fondo

    if color_titulo is not None:
        data["color_titulo"] = color_titulo

    if color_descripcion is not None:
        data["color_descripcion"] = color_descripcion

    if color_boton is not None:
        data["color_boton"] = color_boton

    if color_texto_boton is not None:
        data["color_texto_boton"] = color_texto_boton    

    data["updated_at"] = datetime.utcnow()

    return data