function FiltroMasVendidos({ soloMasVendidos, setSoloMasVendidos, setCurrentPage }) {
    return (
      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
        <input
          type="checkbox"
          checked={soloMasVendidos}
          onChange={(e) => {
            setSoloMasVendidos(e.target.checked);
            setCurrentPage(1);
          }}
          className="accent-amber-500"
        />
        Más vendidos
      </label>
    );
  }
  
  export default FiltroMasVendidos;