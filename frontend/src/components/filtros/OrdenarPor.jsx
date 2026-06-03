function OrdenarPor({ orden, setOrden, setCurrentPage }) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Ordenar por</span>
  
        <select
          value={orden}
          onChange={(e) => {
            setOrden(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <option value="relevantes">Más relevantes</option>
          <option value="menor_precio">Menor precio</option>
          <option value="mayor_precio">Mayor precio</option>
          <option value="mayor_descuento">Mayor descuento</option>
        </select>
      </div>
    );
  }
  
  export default OrdenarPor;