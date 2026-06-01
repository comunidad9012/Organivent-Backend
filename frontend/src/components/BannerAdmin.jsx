import { useEffect, useState, useRef } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Image,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";
import ColorInput from "./ColorInput";

const API_URL = "http://localhost:5000/api/banners";

const FORM_DEFAULT = {
  titulo: "",
  descripcion: "",
  texto_boton: "",
  link_boton: "",
  activo: true,
  orden: 1,
  color_fondo: "#F5ECD7",
  color_titulo: "#2A2218",
  color_descripcion: "#5C4F3A",
  color_boton: "#2A2218",
  color_texto_boton: "#F5ECD7",
};

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

function BannerAdmin() {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState(FORM_DEFAULT);
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [bannerEditando, setBannerEditando] = useState(null);

  const fileRef = useRef(null);

  useEffect(() => {
    obtenerBanners();
  }, []);

  const obtenerBanners = async () => {
    try {
      const res = await fetch(`${API_URL}/`);
      const data = await res.json();
      setBanners(data);
    } catch (err) {
      console.error("Error al obtener banners:", err);
    }
  };

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const manejarImagen = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImagen(file);

    const reader = new FileReader();

    reader.onload = () => {
      setPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const abrirModalCrear = () => {
    setBannerEditando(null);
    setForm(FORM_DEFAULT);
    setImagen(null);
    setPreview(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }

    setModalAbierto(true);
  };

  const abrirModalEditar = (banner) => {
    setBannerEditando(banner);

    setForm({
      titulo: banner.titulo || "",
      descripcion: banner.descripcion || "",
      texto_boton: banner.texto_boton || "",
      link_boton: banner.link_boton || "",
      activo: banner.activo ?? true,
      orden: banner.orden || 1,
      color_fondo: banner.color_fondo || "#F5ECD7",
      color_titulo: banner.color_titulo || "#2A2218",
      color_descripcion: banner.color_descripcion || "#5C4F3A",
      color_boton: banner.color_boton || "#2A2218",
      color_texto_boton: banner.color_texto_boton || "#F5ECD7",
    });

    setImagen(null);
    setPreview(banner.imagen_url || null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }

    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setBannerEditando(null);
    setImagen(null);
    setPreview(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (imagen) {
        formData.append("imagen", imagen);
      }

      const url = bannerEditando
        ? `${API_URL}/${bannerEditando._id}`
        : `${API_URL}/`;

      const res = await fetch(url, {
        method: bannerEditando ? "PUT" : "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al guardar el banner");
        return;
      }

      cerrarModal();
      obtenerBanners();
    } catch (err) {
      console.error("Error al guardar banner:", err);
      alert("Error al guardar el banner");
    } finally {
      setCargando(false);
    }
  };

  const eliminarBanner = async (id) => {
    if (!confirm("¿Seguro que querés eliminar este banner?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Error al eliminar el banner");
        return;
      }

      obtenerBanners();
    } catch (err) {
      console.error("Error al eliminar banner:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Banners del home
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Administrá los banners que aparecen en la página principal.
          </p>
        </div>

        <button
          onClick={abrirModalCrear}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors duration-200"
        >
          <Plus size={16} />
          Crear banner
        </button>
      </div>

      {/* Lista */}
      {banners.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-300 gap-3">
          <Image size={40} strokeWidth={1.2} />
          <p className="text-sm">Todavía no hay banners creados.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 pr-2">
          {banners.map((banner) => (
            <div
              key={banner._id}
              className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
            >
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
                      banner.activo
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {banner.activo ? "Activo" : "Inactivo"}
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
                  onClick={() => abrirModalEditar(banner)}
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-200"
                >
                  <Pencil size={14} />
                  Editar
                </button>

                <button
                  onClick={() => eliminarBanner(banner._id)}
                  className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors duration-200"
                >
                  <Trash2 size={14} />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <div className="bg-white w-full max-w-[980px] rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                {bannerEditando ? "Editar banner" : "Crear banner"}
              </h3>

              <button
                onClick={cerrarModal}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5">
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

                  {bannerEditando && !imagen && (
                    <p className="text-xs text-gray-400 text-center -mt-1">
                      Sin cambios se mantiene la imagen actual.
                    </p>
                  )}
                </div>

                {/* Columna derecha */}
                <div className="flex flex-col gap-3">
                  {/* Activo + colores */}
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

                  {/* Campos */}
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
      )}
    </div>
  );
}

export default BannerAdmin;