function FiltroDescuento({ soloDescuento, setSoloDescuento, setCurrentPage }) {
    return (
      <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
        <input
          type="checkbox"
          checked={soloDescuento}
          onChange={(e) => {
            setSoloDescuento(e.target.checked);
            setCurrentPage(1);
          }}
          className="accent-amber-500"
        />
        Solo con descuento
      </label>
    );
  }
  
  export default FiltroDescuento;