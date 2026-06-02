//crear-editar banner 

import { X } from "lucide-react";
import BannerForm from "./BannerForm";

function BannerAdminModal({
  abierto,
  bannerEditando,
  cargando,
  cerrarModal,
  form,
  preview,
  fileRef,
  manejarCambio,
  manejarImagen,
  manejarSubmit,
}) {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-6">
      <div className="bg-white w-full max-w-[980px] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">
            {bannerEditando ? "Editar banner" : "Crear banner"}
          </h3>

          <button
            type="button"
            onClick={cerrarModal}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <BannerForm
            form={form}
            preview={preview}
            fileRef={fileRef}
            bannerEditando={bannerEditando}
            manejarCambio={manejarCambio}
            manejarImagen={manejarImagen}
            manejarSubmit={manejarSubmit}
          />

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={cerrarModal}
              className="text-sm font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-5 py-2.5 rounded-lg transition-colors duration-200"
            >
              Cancelar
            </button>

            <button
              type="submit"
              form="banner-form"
              disabled={cargando}
              className="text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-50 px-6 py-2.5 rounded-lg transition-colors duration-200"
            >
              {cargando
                ? "Guardando..."
                : bannerEditando
                ? "Guardar cambios"
                : "Crear banner"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BannerAdminModal;