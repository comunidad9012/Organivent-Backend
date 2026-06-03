function FiltroColor({ colorSeleccionado, setColorSeleccionado, coloresDisponibles, setCurrentPage }) {
    return (
      <select
        value={colorSeleccionado}
        onChange={(e) => {
          setColorSeleccionado(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        <option value="">Todos los colores</option>
  
        {coloresDisponibles.map((color) => (
          <option key={color} value={color}>
            {color}
          </option>
        ))}
      </select>
    );
  }
  
  export default FiltroColor;