import OrdenarPor from "./OrdenarPor";
import FiltroPrecio from "./FiltroPrecio";
import FiltroDescuento from "./FiltroDescuento";
import FiltroColor from "./FiltroColor";
import FiltroMasVendidos from "./FiltroMasVendidos";

function ProductosFiltros({
  orden,
  setOrden,
  precioMin,
  setPrecioMin,
  precioMax,
  setPrecioMax,
  soloDescuento,
  setSoloDescuento,
  colorSeleccionado,
  setColorSeleccionado,
  coloresDisponibles,
  soloMasVendidos,
  setSoloMasVendidos,
  limpiarFiltros,
  setCurrentPage,
}) {
    return (
        <div className="flex flex-col gap-5">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Filtros
            </h3>
            <p className="text-xs text-gray-400">
              Refiná tu búsqueda
            </p>
          </div>
      
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Ordenar por
            </p>
            <OrdenarPor
              orden={orden}
              setOrden={setOrden}
              setCurrentPage={setCurrentPage}
            />
          </div>
      
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Precio
            </p>
            <FiltroPrecio
              precioMin={precioMin}
              setPrecioMin={setPrecioMin}
              precioMax={precioMax}
              setPrecioMax={setPrecioMax}
              setCurrentPage={setCurrentPage}
            />
          </div>
      
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Ofertas
            </p>
            <FiltroDescuento
              soloDescuento={soloDescuento}
              setSoloDescuento={setSoloDescuento}
              setCurrentPage={setCurrentPage}
            />
          </div>
      
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Color
            </p>
            <FiltroColor
              colorSeleccionado={colorSeleccionado}
              setColorSeleccionado={setColorSeleccionado}
              coloresDisponibles={coloresDisponibles}
              setCurrentPage={setCurrentPage}
            />
          </div>
      
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Popularidad
            </p>
            <FiltroMasVendidos
              soloMasVendidos={soloMasVendidos}
              setSoloMasVendidos={setSoloMasVendidos}
              setCurrentPage={setCurrentPage}
            />
          </div>
      
          <button
            type="button"
            onClick={limpiarFiltros}
            className="border-t border-gray-100 pt-4 text-sm text-gray-400 hover:text-gray-700 transition text-left"
          >
            Limpiar filtros
          </button>
        </div>
    );
}

export default ProductosFiltros;