export default function ColorInput({ label, name, value, onChange }) {
    return (
      <label className="flex flex-col items-center gap-1 cursor-pointer">
        <span className="text-[10px] font-medium text-gray-500 truncate max-w-full">
          {label}
        </span>
  
        <span
          className="block w-7 h-7 rounded-md border border-gray-200 shadow-sm"
          style={{ background: value || "#000000" }}
        />
  
        <input
          type="color"
          name={name}
          value={value || "#000000"}
          onChange={onChange}
          className="absolute opacity-0 pointer-events-none"
        />
      </label>
    );
  }