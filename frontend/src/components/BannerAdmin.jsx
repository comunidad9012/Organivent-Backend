import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/banners";

function BannerAdmin() {
  const [banners, setBanners] = useState([]);

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    texto_boton: "",
    link_boton: "",
    activo: true,
    orden: 1,
  });

  const [imagen, setImagen] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [bannerEditando, setBannerEditando] = useState(null);

  useEffect(() => {
    obtenerBanners();
  }, []);

  const obtenerBanners = async () => {
    try {
      const res = await fetch(`${API_URL}/`);
      const data = await res.json();
      setBanners(data);
    } catch (error) {
      console.error("Error al obtener banners:", error);
    }
  };

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const abrirModalCrear = () => {
    setBannerEditando(null);
    setForm({
      titulo: "",
      descripcion: "",
      texto_boton: "",
      link_boton: "",
      activo: true,
      orden: 1,
    });
    setImagen(null);
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
    });

    setImagen(null);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setBannerEditando(null);
    setImagen(null);
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      const formData = new FormData();

      formData.append("titulo", form.titulo);
      formData.append("descripcion", form.descripcion);
      formData.append("texto_boton", form.texto_boton);
      formData.append("link_boton", form.link_boton);
      formData.append("activo", form.activo);
      formData.append("orden", form.orden);

      if (imagen) {
        formData.append("imagen", imagen);
      }

      const url = bannerEditando
        ? `${API_URL}/${bannerEditando._id}`
        : `${API_URL}/`;

      const method = bannerEditando ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error backend:", data.error || data);
        alert(data.error || "Error al guardar el banner");
        return;
      }

      alert(
        bannerEditando
          ? "Banner actualizado correctamente"
          : "Banner creado correctamente"
      );

      cerrarModal();
      obtenerBanners();
    } catch (error) {
      console.error("Error al guardar banner:", error);
      alert("Error al guardar el banner");
    } finally {
      setCargando(false);
    }
  };

  const eliminarBanner = async (id) => {
    const confirmar = confirm("¿Seguro que querés eliminar este banner?");

    if (!confirmar) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Error al eliminar el banner");
        return;
      }

      obtenerBanners();
    } catch (error) {
      console.error("Error al eliminar banner:", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex flex-col items-center gap-4 mb-8">
        <h2 className="text-3xl font-bold text-center">
          Banner del home
        </h2>

        <button
          onClick={abrirModalCrear}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Crear banner
        </button>
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 relative max-h-[80vh] overflow-y-auto">
            <button
              type="button"
              onClick={cerrarModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-center mb-6">
              {bannerEditando ? "Editar banner" : "Crear banner del home"}
            </h3>

            <form onSubmit={manejarSubmit} className="space-y-5">
              <div>
                <p className="block text-sm font-semibold text-gray-700 mb-2">
                  Título
                </p>
                <input
                  type="text"
                  name="titulo"
                  value={form.titulo}
                  onChange={manejarCambio}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Tu día con más color"
                  required
                />
              </div>

              <div>
                <p className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción
                </p>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={manejarCambio}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Descripción breve del banner"
                  rows="4"
                  required
                />
              </div>

              <div>
                <p className="block text-sm font-semibold text-gray-700 mb-2">
                  Texto del botón
                </p>
                <input
                  type="text"
                  name="texto_boton"
                  value={form.texto_boton}
                  onChange={manejarCambio}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Ver productos"
                  required
                />
              </div>

              <div>
                <p className="block text-sm font-semibold text-gray-700 mb-2">
                  Link del botón
                </p>
                <input
                  type="text"
                  name="link_boton"
                  value={form.link_boton}
                  onChange={manejarCambio}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="/productos o https://..."
                  required
                />
              </div>

              <div>
                <p className="block text-sm font-semibold text-gray-700 mb-2">
                  Imagen
                </p>

                {bannerEditando?.imagen_url && (
                  <img
                    src={bannerEditando.imagen_url}
                    alt={bannerEditando.titulo}
                    className="w-40 h-24 object-cover rounded-lg border mb-3"
                  />
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImagen(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 bg-gray-50"
                  required={!bannerEditando}
                />

                {bannerEditando && (
                  <p className="text-xs text-gray-500 mt-1">
                    Si no seleccionás una imagen nueva, se mantiene la actual.
                  </p>
                )}
              </div>

              <div>
                <p className="block text-sm font-semibold text-gray-700 mb-2">
                  Orden
                </p>
                <input
                  type="number"
                  name="orden"
                  value={form.orden}
                  onChange={manejarCambio}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="activo"
                  checked={form.activo}
                  onChange={manejarCambio}
                  className="!w-4 !h-4"
                />

                <span className="text-sm font-semibold text-gray-700">
                  Banner activo
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={cargando}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60"
                >
                  {cargando
                    ? "Guardando..."
                    : bannerEditando
                    ? "Guardar cambios"
                    : "Guardar banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h3 className="text-2xl font-bold text-center mb-6">
        Banners creados
      </h3>

      <div className="grid gap-4 mb-12">
        {banners.length === 0 && (
          <p className="text-gray-500 text-center">
            Todavía no hay banners creados.
          </p>
        )}

        {banners.map((banner) => (
          <div
            key={banner._id}
            className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-4">
              {banner.imagen_url && (
                <img
                  src={banner.imagen_url}
                  alt={banner.titulo}
                  className="w-32 h-24 object-cover rounded-lg border"
                />
              )}

              <div>
                <h4 className="font-bold text-lg">{banner.titulo}</h4>
                <p className="text-sm text-gray-600">{banner.descripcion}</p>

                <p className="text-sm mt-1">
                  Estado:{" "}
                  <span
                    className={
                      banner.activo ? "text-green-600" : "text-red-600"
                    }
                  >
                    {banner.activo ? "Activo" : "Inactivo"}
                  </span>
                </p>

                <p className="text-sm text-gray-500">
                  Link: {banner.link_boton}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => abrirModalEditar(banner)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
              >
                Editar
              </button>

              <button
                onClick={() => eliminarBanner(banner._id)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BannerAdmin;