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

  if (cargando) {
    return null;
  }

  if (productos.length === 0) {
    return null;
  }

  const maxVentas = Math.max(...productos.map((p) => Number(p.unidades_vendidas || 0)), 1);

  return (
    <section className="w-full bg-white py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-6">
          <p className="text-sm font-semibold text-amber-500 uppercase tracking-wide">
            Ranking
          </p>
          <h2 className="text-2xl font-bold text-gray-900">
            Productos más vendidos
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Los favoritos de nuestros clientes.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {productos.map((product, index) => {
            const ranking = index + 1;
            const porcentaje = Math.max(
              8,
              (Number(product.unidades_vendidas || 0) / maxVentas) * 100
            );

            const badgeClass =
              ranking === 1
                ? "bg-amber-400 text-white"
                : ranking === 2
                ? "bg-gray-300 text-gray-800"
                : ranking === 3
                ? "bg-orange-400 text-white"
                : "bg-gray-100 text-gray-600";

            const cardClass =
              ranking === 1
                ? "border-amber-400 shadow-md"
                : "border-gray-200 shadow-sm";

            return (
              <div
                key={product._id}
                onClick={() => navigate(`/Productos/viewproduct/${product._id}`)}
                className={`group bg-white rounded-xl border ${cardClass} overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300`}
              >
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <span
                    className={`absolute top-3 left-3 z-10 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${badgeClass}`}
                  >
                    #{ranking}
                  </span>

                  <img
                    src={getImagenProducto(product)}
                    alt={product.nombre_producto}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />

                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gray-100">
                    <div
                      className="h-full bg-amber-400"
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-gray-50">
                  <PriceWhitDiscountOrNot product={product} />

                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mt-2">
                    {product.nombre_producto}
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">
                    {product.unidades_vendidas} unidades vendidas
                  </p>
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