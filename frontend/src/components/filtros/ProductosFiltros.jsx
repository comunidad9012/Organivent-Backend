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
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <FiltroPrecio
          precioMin={precioMin}
          setPrecioMin={setPrecioMin}
          precioMax={precioMax}
          setPrecioMax={setPrecioMax}
          setCurrentPage={setCurrentPage}
        />

        <FiltroDescuento
          soloDescuento={soloDescuento}
          setSoloDescuento={setSoloDescuento}
          setCurrentPage={setCurrentPage}
        />

        <FiltroColor
          colorSeleccionado={colorSeleccionado}
          setColorSeleccionado={setColorSeleccionado}
          coloresDisponibles={coloresDisponibles}
          setCurrentPage={setCurrentPage}
        />

        <FiltroMasVendidos
          soloMasVendidos={soloMasVendidos}
          setSoloMasVendidos={setSoloMasVendidos}
          setCurrentPage={setCurrentPage}
        />

        <button
          type="button"
          onClick={limpiarFiltros}
          className="text-sm text-gray-400 hover:text-gray-700 transition"
        >
          Limpiar filtros
        </button>
      </div>

      <OrdenarPor
        orden={orden}
        setOrden={setOrden}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default ProductosFiltros;