function FiltroPrecio({
    precioMin,
    setPrecioMin,
    precioMax,
    setPrecioMax,
    setCurrentPage,
  }) {
    return (
      <div className="flex flex-col gap-2">
        <input
          type="number"
          value={precioMin}
          onChange={(e) => {
            setPrecioMin(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Mínimo"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
  
        <input
          type="number"
          value={precioMax}
          onChange={(e) => {
            setPrecioMax(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Máximo"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>
    );
  }
  
  export default FiltroPrecio;
