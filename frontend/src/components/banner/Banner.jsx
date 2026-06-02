//diseño del banner individual

import { useEffect, useRef, useState } from "react";
import "./Banner.css";

const API_URL = "http://localhost:5000/api/banners/activos";
const TIEMPO_CAMBIO = 5000;

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const [actual, setActual] = useState(0);
  const [visible, setVisible] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);

  const transitionRef = useRef(null);

  useEffect(() => {
    obtenerBanners();

    return () => {
      clearTimeout(transitionRef.current);
    };
  }, []);

  const obtenerBanners = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      const ordenados = data
        .filter(
          (banner) =>
            banner.activo === true ||
            banner.activo === "true" ||
            banner.activo === 1 ||
            banner.activo === "1"
        )
        .sort((a, b) => Number(a.orden || 0) - Number(b.orden || 0));

      console.log("Banners activos ordenados:", ordenados);

      setBanners(ordenados);
      setActual(0);

      setTimeout(() => {
        setVisible(true);
      }, 50);
    } catch (err) {
      console.error("Error al obtener banners:", err);
    }
  };

  const cambiarBanner = (index) => {
    if (banners.length <= 1) return;

    clearTimeout(transitionRef.current);

    setFadeIn(false);

    transitionRef.current = setTimeout(() => {
      setActual(index);
      setFadeIn(true);
    }, 300);
  };

  const siguiente = () => {
    cambiarBanner((actual + 1) % banners.length);
  };

  const anterior = () => {
    cambiarBanner((actual - 1 + banners.length) % banners.length);
  };

  useEffect(() => {
    if (banners.length <= 1) return;

    const intervalo = setInterval(() => {
      setActual((prev) => (prev + 1) % banners.length);
    }, TIEMPO_CAMBIO);

    return () => clearInterval(intervalo);
  }, [banners.length]);

  if (!banners.length) return null;

  const banner = banners[actual];

  return (
    <section
      className="banner-root"
      style={{ backgroundColor: banner.color_fondo || "#F5ECD7" }}
    >
      <div className="banner-noise" aria-hidden="true" />
      <div className="banner-accent-line" aria-hidden="true" />

      <div
        key={banner._id || actual}
        className={`banner-inner${visible ? " visible" : ""}${
          fadeIn ? "" : " fading"
        }`}
      >
        <div className="banner-text-col">
          <p className="banner-eyebrow">Colección</p>

          <h1
            className="banner-title"
            style={{ color: banner.color_titulo || "#2A2218" }}
          >
            {banner.titulo}
          </h1>

          {banner.descripcion && (
            <p
              className="banner-desc"
              style={{ color: banner.color_descripcion || "#5C4F3A" }}
            >
              {banner.descripcion}
            </p>
          )}

          {banner.texto_boton && banner.link_boton && (
            <a
              href={banner.link_boton}
              className="banner-cta"
              style={{
                backgroundColor: banner.color_boton || "#2A2218",
                color: banner.color_texto_boton || "#F5ECD7",
              }}
            >
              {banner.texto_boton}
              <span className="banner-cta-arrow" aria-hidden="true">
                →
              </span>
            </a>
          )}

          {banners.length > 1 && (
            <div className="banner-dots">
              {banners.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`banner-dot${actual === i ? " active" : ""}`}
                  onClick={() => cambiarBanner(i)}
                  aria-label={`Ir al banner ${i + 1}`}
                />
              ))}
            </div>
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

      {banners.length > 1 && (
        <>
          <button
            type="button"
            className="banner-nav banner-nav-prev"
            onClick={anterior}
            aria-label="Banner anterior"
          >
            ←
          </button>

          <button
            type="button"
            className="banner-nav banner-nav-next"
            onClick={siguiente}
            aria-label="Banner siguiente"
          >
            →
          </button>

          <div className="banner-progress">
            <div key={actual} className="banner-progress-bar" />
          </div>
        </>
      )}
    </section>
  );
}