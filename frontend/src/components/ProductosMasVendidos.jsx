import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PriceWhitDiscountOrNot from "../utilities/PriceWhitDiscountOrNot";

const API_URL = "http://localhost:5000/Pedidos/productosMasVendidos?limite=4";

function getImagenProducto(product) {
  const primeraImagen = product.imagenes?.[0];

  if (!primeraImagen) {
    return "http://localhost:5000/imgs/imagenes/default.jpg";
  }

  if (typeof primeraImagen === "string") {
    return `http://localhost:5000/imgs/imagenes/${primeraImagen}`;
  }

  if (primeraImagen.url) {
    return primeraImagen.url;
  }

  return "http://localhost:5000/imgs/imagenes/default.jpg";
}

const RANK_STYLES = {
  1: {
    badge: "bg-amber-400 text-amber-950",
    card: "border-amber-300 ring-1 ring-amber-200",
    bar: "bg-amber-400",
    label: "Más vendido",
  },
  2: {
    badge: "bg-slate-300 text-slate-800",
    card: "border-slate-200",
    bar: "bg-slate-300",
    label: "Top 2",
  },
  3: {
    badge: "bg-orange-300 text-orange-950",
    card: "border-orange-200",
    bar: "bg-orange-300",
    label: "Top 3",
  },
};

const DEFAULT_RANK = {
  badge: "bg-gray-100 text-gray-500",
  card: "border-gray-100",
  bar: "bg-gray-300",
  label: "Popular",
};

function ProductosMasVendidos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerMasVendidos = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        if (!res.ok) {
          console.error("Error al obtener productos más vendidos:", data);
          setProductos([]);
          return;
        }

        setProductos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error conectando con productos más vendidos:", error);
        setProductos([]);
      } finally {
        setCargando(false);
      }
    };

    obtenerMasVendidos();
  }, []);

  if (cargando) return null;
  if (productos.length === 0) return null;

  const productosRanking = productos.slice(0, 4);

  const maxVentas = Math.max(
    ...productosRanking.map((p) => Number(p.unidades_vendidas || 0)),
    1
  );

  return (
    <section className="w-full bg-white py-12">
      <div className="productos-container">
        <div className="flex items-end justify-between gap-4 mb-7">
          <div>
            <p className="text-xs font-bold text-amber-500 uppercase tracking-[0.22em] mb-2">
              Ranking
            </p>

            <h2 className="text-3xl font-bold text-gray-950 leading-tight">
              Más vendidos
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Los productos favoritos de nuestros clientes.
            </p>
          </div>

          <span className="hidden md:inline-flex text-xs font-medium text-gray-400 bg-gray-50 border border-gray-100 rounded-full px-3 py-1.5">
            Top 4 de ventas
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {productosRanking.map((product, index) => {
            const ranking = index + 1;
            const styles = RANK_STYLES[ranking] ?? DEFAULT_RANK;

            const porcentaje = Math.max(
              8,
              (Number(product.unidades_vendidas || 0) / maxVentas) * 100
            );

            return (
              <div
                key={product._id}
                onClick={() => navigate(`/Productos/viewproduct/${product._id}`)}
                className={`group relative bg-white rounded-2xl border ${styles.card} overflow-hidden cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="relative h-48 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
                  <span
                    className={`absolute top-3 left-3 z-10 w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${styles.badge}`}
                  >
                    #{ranking}
                  </span>

                  <span className="absolute top-3 right-3 z-10 text-[11px] font-semibold text-gray-400 bg-white/80 backdrop-blur px-2 py-1 rounded-full border border-gray-100">
                    {styles.label}
                  </span>

                  <img
                    src={getImagenProducto(product)}
                    alt={product.nombre_producto}
                    className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                  />

                  <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gray-100">
                    <div
                      className={`h-full ${styles.bar} transition-all duration-700`}
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 bg-white">
                  <PriceWhitDiscountOrNot product={product} />

                  <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-snug mt-2 group-hover:text-amber-600 transition-colors">
                    {product.nombre_producto}
                  </h3>

                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-gray-400">
                      {Number(product.unidades_vendidas).toLocaleString("es-AR")} vendidos
                    </p>

                    <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 rounded-full px-2 py-1">
                      {Math.round(porcentaje)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ProductosMasVendidos;