export default function ColorInput({ label, name, value, onChange }) {
    return (
      <div>
        <p className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </p>
  
        <div className="flex items-center gap-3">
          <input
            type="color"
            name={name}
            value={value || "#000000"}
            onChange={onChange}
            className="w-14 h-12 p-1 border border-gray-300 rounded-lg bg-white cursor-pointer hover:shadow-md transition-all duration-200"
          />
  
          <input
            type="text"
            name={name}
            value={value || ""}
            onChange={onChange}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
            placeholder="#000000"
          />
        </div>
      </div>
    );
  }