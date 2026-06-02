//logica del admin

import { useEffect, useState, useRef } from "react";
import { Plus } from "lucide-react";
import BannerAdminModal from "./BannerAdminModal";
import BannerList from "./BannerList";

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

// ✅ Helper: normalizar activo a booleano real
const normalizarActivo = (valor) => {
  if (valor === true || valor === "true" || valor === 1 || valor === "1") return true;
  return false;
};

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

      const bannersOrdenados = data.sort((a, b) => {
        return Number(a.orden || 0) - Number(b.orden || 0);
      });

      setBanners(bannersOrdenados);
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
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const abrirModalCrear = () => {
    setBannerEditando(null);
    setForm(FORM_DEFAULT);
    setImagen(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
    setModalAbierto(true);
  };

  const abrirModalEditar = (banner) => {
    setBannerEditando(banner);
    setForm({
      titulo: banner.titulo || "",
      descripcion: banner.descripcion || "",
      texto_boton: banner.texto_boton || "",
      link_boton: banner.link_boton || "",
      // ✅ Normalizamos activo a booleano real al cargar
      activo: normalizarActivo(banner.activo),
      orden: banner.orden || 1,
      color_fondo: banner.color_fondo || "#F5ECD7",
      color_titulo: banner.color_titulo || "#2A2218",
      color_descripcion: banner.color_descripcion || "#5C4F3A",
      color_boton: banner.color_boton || "#2A2218",
      color_texto_boton: banner.color_texto_boton || "#F5ECD7",
    });
    setImagen(null);
    setPreview(banner.imagen_url || null);
    if (fileRef.current) fileRef.current.value = "";
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setBannerEditando(null);
    setImagen(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === "activo") {
          formData.append(key, value ? "true" : "false");
        } else {
          formData.append(key, value);
        }
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
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
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
      <BannerList
        banners={banners}
        abrirModalEditar={abrirModalEditar}
        eliminarBanner={eliminarBanner}
        normalizarActivo={normalizarActivo}
      />

      {/* Modal */}
      <BannerAdminModal
        abierto={modalAbierto}
        bannerEditando={bannerEditando}
        cargando={cargando}
        cerrarModal={cerrarModal}
        form={form}
        preview={preview}
        fileRef={fileRef}
        manejarCambio={manejarCambio}
        manejarImagen={manejarImagen}
        manejarSubmit={manejarSubmit}
      />
    </div>
  );
}

export default BannerAdmin;