import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Roles } from "../../models/roles";
import FavButton from "../FavButton";
import { SquarePen } from "lucide-react";
import PriceWhitDiscountOrNot from "../../utilities/PriceWhitDiscountOrNot";
import DeleteItem from "../../utilities/DeleteItem";

function ProductoCard({ product, setProductos }) {
  const navigate = useNavigate();
  const userState = useSelector((store) => store.user);

  function handleCardNav(e, id) {
    if (e.defaultPrevented) return;

    const targetEl = e.target instanceof Element ? e.target : null;
    if (targetEl && targetEl.closest("a, button, [data-no-nav]")) return;

    navigate(`/Productos/viewproduct/${id}`);
  }

  function handleCardKey(e, id) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(`/Productos/viewproduct/${id}`);
    }
  }

  return (
    <div
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden flex flex-col cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={(e) => handleCardNav(e, product._id)}
      onKeyDown={(e) => handleCardKey(e, product._id)}
    >
      <div className="relative aspect-square bg-white overflow-hidden group">
        <FavButton productId={product._id} data-no-nav />

        {product.colores?.length > 0 && (
          <p className="absolute top-2 left-2 z-10 text-xs bg-white/70 backdrop-blur-sm px-2 py-1 rounded-full text-gray-600">
            {product.colores.length} colores!
          </p>
        )}

        <img
          src={
            product.imagenes?.[0]?.url ||
            "http://localhost:5000/imgs/imagenes/default.jpg"
          }
          alt={product.nombre_producto}
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <div className="block flex-1 flex flex-col p-3 bg-gray-50">
        <PriceWhitDiscountOrNot product={product} />

        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug group-hover:text-black transition-colors min-h-[2.5rem]">
          {product.nombre_producto}
        </h3>

        {userState.rol === Roles.ADMIN && (
          <div className="mt-auto flex justify-end gap-2">
            <Link
              to={`/private/admin/Productos/update/${product._id}`}
              onClick={(e) => e.stopPropagation()}
              data-no-nav
              className="p-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white shadow"
            >
              <SquarePen size={18} />
            </Link>

            <DeleteItem
              item={product}
              itemName={product.nombre_producto}
              resource="Productos"
              setItems={setProductos}
              getId={(p) => p._id}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductoCard;