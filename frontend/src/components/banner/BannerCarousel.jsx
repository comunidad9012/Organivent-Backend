import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API_URL = "http://localhost:5000/api/banners";

const TIEMPO_CAMBIO = 5000; // 5 segundos

function BannerCarousel() {
  const [banners, setBanners] = useState([]);
  const [actual, setActual] = useState(0);

  useEffect(() => {
    obtenerBanners();
  }, []);

  // ✅ Solo un mecanismo de auto-avance: setInterval
  useEffect(() => {
    if (banners.length <= 1) return;

    const intervalo = setInterval(() => {
      setActual((prev) => (prev + 1) % banners.length);
    }, TIEMPO_CAMBIO);

    return () => clearInterval(intervalo);
  }, [banners.length]);

  const obtenerBanners = async () => {
    try {
      const res = await fetch(`${API_URL}/`);
      const data = await res.json();

      const bannersOrdenados = data
        .filter(
          (banner) =>
            banner.activo === true ||
            banner.activo === "true" ||
            banner.activo === 1 ||
            banner.activo === "1"
        )
        .sort((a, b) => Number(a.orden || 0) - Number(b.orden || 0));

      // ✅ Sin duplicados
      setBanners(bannersOrdenados);
      setActual(0);

      console.log("Cantidad de banners activos:", bannersOrdenados.length);
      console.log("Banners:", bannersOrdenados);
    } catch (err) {
      console.error("Error al obtener banners:", err);
    }
  };

  const anterior = () => {
    setActual((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const siguiente = () => {
    setActual((prev) => (prev + 1) % banners.length);
  };

  if (banners.length === 0) return null;

  const banner = banners[actual];

  return (
    <section className="w-full max-w-6xl mx-auto px-6 mt-8">
      <div
        className="relative w-full h-[320px] rounded-3xl overflow-hidden shadow-sm border border-gray-100"
        style={{ backgroundColor: banner.color_fondo || "#F5ECD7" }}
      >
        {banner.imagen_url && (
          <img
            src={banner.imagen_url}
            alt={banner.titulo}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-black/25" />

        <div className="relative z-10 h-full flex flex-col justify-center px-12 max-w-xl">
          <h2
            className="text-4xl font-bold mb-3 leading-tight"
            style={{ color: banner.color_titulo || "#ffffff" }}
          >
            {banner.titulo}
          </h2>

          <p
            className="text-base mb-6 leading-relaxed"
            style={{ color: banner.color_descripcion || "#ffffff" }}
          >
            {banner.descripcion}
          </p>

          {banner.texto_boton && banner.link_boton && (
            <a
              href={banner.link_boton}
              className="w-fit px-5 py-2.5 rounded-lg text-sm font-semibold transition hover:scale-[1.02]"
              style={{
                backgroundColor: banner.color_boton || "#2A2218",
                color: banner.color_texto_boton || "#ffffff",
              }}
            >
              {banner.texto_boton}
            </a>
          )}
        </div>

        {banners.length > 1 && (
          <>
            <button
              type="button"
              onClick={anterior}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow transition"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={siguiente}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow transition"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {banners.map((bannerItem, index) => (
                <button
                  key={bannerItem._id || index}
                  type="button"
                  onClick={() => setActual(index)}
                  className={`h-2 rounded-full transition-all ${
                    actual === index ? "w-6 bg-white" : "w-2 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default BannerCarousel;