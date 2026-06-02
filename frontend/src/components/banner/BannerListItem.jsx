// tarjeta individual dentro del listado de banners

import { Pencil, Trash2, Image } from "lucide-react";

function BannerListItem({
  banner,
  abrirModalEditar,
  eliminarBanner,
  normalizarActivo,
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 hover:border-gray-200 hover:shadow-sm transition-all duration-200">
      {banner.imagen_url ? (
        <img
          src={banner.imagen_url}
          alt={banner.titulo}
          className="w-28 h-20 object-cover rounded-lg border border-gray-100 shrink-0"
        />
      ) : (
        <div className="w-28 h-20 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
          <Image size={20} className="text-gray-300" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h4 className="font-semibold text-gray-900 truncate">
            {banner.titulo}
          </h4>

          <span
            className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
              normalizarActivo(banner.activo)
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {normalizarActivo(banner.activo) ? "Activo" : "Inactivo"}
          </span>
        </div>

        <p className="text-sm text-gray-400 truncate">
          {banner.descripcion}
        </p>

        <p className="text-xs text-gray-300 mt-1 truncate">
          {banner.link_boton}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => abrirModalEditar(banner)}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-200"
        >
          <Pencil size={14} />
          Editar
        </button>

        <button
          type="button"
          onClick={() => eliminarBanner(banner._id)}
          className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors duration-200"
        >
          <Trash2 size={14} />
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default BannerListItem;