import { useState, useEffect, useContext } from "react";
import { ShoppingCart } from "lucide-react";
import { FiltersContext } from "./context/filters.jsx";
import Paginacion from "./Paginacion.jsx";
import ProductoCard from "./productos/ProductoCard.jsx";
import OrdenarPor from "./filtros/OrdenarPor.jsx";

function Productos() {
  const [productos, setProductos] = useState([]);

  // paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { filters, setFilters } = useContext(FiltersContext);

  const [orden, setOrden] = useState("relevantes");

  useEffect(() => {
  const fetchProductos = async () => {
    try {
      let url;
      let data;

      if (filters.query.trim() !== "") {
        const response = await fetch("http://localhost:5000/Productos/find_product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ palabra: filters.query }),
        });
        data = await response.json();
      } else if (filters.id_categoria) {
        url = `http://localhost:5000/Productos/showProductosPorCategoria/${filters.id_categoria}`;
        const response = await fetch(url);
        data = await response.json();
      } else {
        url = "http://localhost:5000/Productos/showProductos";
        const response = await fetch(url);
        data = await response.json();
      }

      setProductos(data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  fetchProductos();
}, [filters.query, filters.id_categoria]);

  const productosOrdenados = [...productos].sort((a, b) => {
    const precioA = Number(a.precio_final ?? a.precio_venta ?? 0);
    const precioB = Number(b.precio_final ?? b.precio_venta ?? 0);

    const originalA = Number(a.precio_original ?? a.precio_venta ?? precioA);
    const originalB = Number(b.precio_original ?? b.precio_venta ?? precioB);

    const descuentoA = originalA - precioA;
    const descuentoB = originalB - precioB;

    if (orden === "menor_precio") return precioA - precioB;
    if (orden === "mayor_precio") return precioB - precioA;
    if (orden === "mayor_descuento") return descuentoB - descuentoA;

    return 0;
  });

  // paginación
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = productosOrdenados.slice(startIndex, endIndex);


  return (
    <section className="productos-section">
      <div className="productos-container">
        <h1 className="productos-title">Productos</h1>

        {/* Filtro Ordenar por */}
        <div className="flex justify-end mb-6">
          <OrdenarPor
            orden={orden}
            setOrden={setOrden}
            setCurrentPage={setCurrentPage}
          />
        </div>

        {/* Zona principal */}
      
        <div className="productos-grid-wrapper">
          {productos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {currentProducts.map((product) => (
                <ProductoCard
                  key={product._id}
                  product={product}
                  setProductos={setProductos}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart
                size={96}
                className="mx-auto text-gray-400 mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay productos disponibles
              </h3>
              <p className="text-gray-600">
                Intenta ajustar tus filtros o vuelve más tarde.
              </p>
            </div>
          )}
        </div>

        {/* Paginación */}
        <Paginacion
          totalItems={productosOrdenados.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </section>
  );       
}

export default Productos;
