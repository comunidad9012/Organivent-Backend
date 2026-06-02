// formulario para propiedades del banner

import { Image, ToggleLeft, ToggleRight } from "lucide-react";
import ColorInput from "../ColorInput";

const inputClass =
  "w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition placeholder:text-gray-300";

const Field = ({ label, hint, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-gray-700">
      {label}
      {hint && (
        <span className="ml-1.5 text-xs font-normal text-gray-400">
          {hint}
        </span>
      )}
    </label>
    {children}
  </div>
);

function BannerForm({
  form,
  preview,
  fileRef,
  bannerEditando,
  manejarCambio,
  manejarImagen,
  manejarSubmit,
}) {
  return (
    <form
      id="banner-form"
      onSubmit={manejarSubmit}
      className="grid grid-cols-[42%_58%] gap-5"
    >
      {/* Columna izquierda */}
      <div className="flex flex-col gap-3">
        <div className="w-full h-[190px] rounded-xl border border-gray-200 bg-white overflow-hidden flex items-center justify-center">
          {preview ? (
            <img
              src={preview}
              alt="Previsualización del banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-gray-300">
              <Image size={32} strokeWidth={1.2} />
              <span className="text-sm">Previsualización de imagen</span>
            </div>
          )}
        </div>

        <Field label="Imagen">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={manejarImagen}
            className="block w-full text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-2 bg-white
              file:mr-3 file:py-1.5 file:px-3
              file:rounded-md file:border-0
              file:text-xs file:font-semibold
              file:bg-amber-50 file:text-amber-700
              hover:file:bg-amber-100"
            required={!bannerEditando}
          />
        </Field>

        {bannerEditando && (
          <p className="text-xs text-gray-400 text-center -mt-1">
            Sin cambios se mantiene la imagen actual.
          </p>
        )}
      </div>

      {/* Columna derecha */}
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-[1fr_110px] gap-4 items-start pr-1">
          <div className="border border-gray-200 rounded-lg px-3 py-2.5">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Colores
            </p>

            <div className="grid grid-cols-5 gap-2">
              <ColorInput
                label="Fondo"
                name="color_fondo"
                value={form.color_fondo}
                onChange={manejarCambio}
              />

              <ColorInput
                label="Título"
                name="color_titulo"
                value={form.color_titulo}
                onChange={manejarCambio}
              />

              <ColorInput
                label="Descripción"
                name="color_descripcion"
                value={form.color_descripcion}
                onChange={manejarCambio}
              />

              <ColorInput
                label="Botón"
                name="color_boton"
                value={form.color_boton}
                onChange={manejarCambio}
              />

              <ColorInput
                label="Texto"
                name="color_texto_boton"
                value={form.color_texto_boton}
                onChange={manejarCambio}
              />
            </div>
          </div>

          <label className="flex flex-col items-center justify-center gap-1 py-3 cursor-pointer select-none h-full">
            <input
              type="checkbox"
              name="activo"
              checked={form.activo}
              onChange={manejarCambio}
              className="sr-only"
            />

            {form.activo ? (
              <ToggleRight size={26} className="text-amber-500" />
            ) : (
              <ToggleLeft size={26} className="text-gray-300" />
            )}

            <span className="text-xs font-semibold text-gray-600">
              {form.activo ? "Activo" : "Inactivo"}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-[1fr_120px] gap-3">
          <Field label="Título">
            <input
              type="text"
              name="titulo"
              value={form.titulo}
              onChange={manejarCambio}
              className={inputClass}
              placeholder="Ej: Tu día con más color"
              required
            />
          </Field>

          <Field label="Orden">
            <input
              type="number"
              name="orden"
              value={form.orden}
              onChange={manejarCambio}
              className={inputClass}
              min="1"
            />
          </Field>
        </div>

        <Field label="Descripción">
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={manejarCambio}
            className={`${inputClass} resize-none h-[64px]`}
            placeholder="Descripción breve del banner"
            required
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Texto del botón">
            <input
              type="text"
              name="texto_boton"
              value={form.texto_boton}
              onChange={manejarCambio}
              className={inputClass}
              placeholder="Ej: Ver productos"
              required
            />
          </Field>

          <Field label="Link del botón">
            <input
              type="text"
              name="link_boton"
              value={form.link_boton}
              onChange={manejarCambio}
              className={inputClass}
              placeholder="/productos"
              required
            />
          </Field>
        </div>
      </div>
    </form>
  );
}

export default BannerForm;