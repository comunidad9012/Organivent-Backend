import { useEffect, useState } from "react";
import "./Banner.css";

const API_URL = "http://localhost:5000/api/banners/activos";

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    obtenerBanner();
  }, []);

  useEffect(() => {
    if (!loading && banners.length) {
      const t = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(t);
    }
  }, [loading, banners]);

  const obtenerBanner = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setBanners(data);
    } catch (error) {
      console.error("Error al obtener el banner:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !banners.length) return null;

  const banner = banners[0];

  return (
    <section
      className="banner-root"
      style={{
      backgroundColor: banner.color_fondo,
    }}
    >
      <div className="banner-noise" aria-hidden="true" />
      <div className="banner-accent-line" aria-hidden="true" />

      <div className={`banner-inner${visible ? " visible" : ""}`}>
        <div className="banner-text-col">
          <p className="banner-eyebrow">Colección</p>

          <h1
            className="banner-title"
            style={{
              color: banner.color_titulo,
            }}
          >
            {banner.titulo}
          </h1>

          {banner.descripcion && (
            <p
              className="banner-desc"
              style={{
                color: banner.color_descripcion,
              }}
            >
              {banner.descripcion}
            </p>
          )}

          {banner.texto_boton && banner.link_boton && (
            <a
              href={banner.link_boton}
              className="banner-cta"
              style={{
                backgroundColor: banner.color_boton,
                color: banner.color_texto_boton,
              }}
            >
              {banner.texto_boton}
              <span className="banner-cta-arrow" aria-hidden="true">
                →
              </span>
            </a>
          )}
        </div>

        {banner.imagen_url && (
          <div className="banner-image-col">
            <div className="banner-image-frame">
              <span className="banner-corner banner-corner-tl" />
              <span className="banner-corner banner-corner-tr" />
              <span className="banner-corner banner-corner-bl" />
              <span className="banner-corner banner-corner-br" />
              <img src={banner.imagen_url} alt={banner.titulo} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}