import { Link } from "react-router-dom";
import { PrivateRoutes } from "../models/routes";
import { Plus, Percent, ShoppingBag, Store } from "lucide-react";

const acciones = [
  {
    id: "producto",
    titulo: "Nuevo producto",
    descripcion: "Crea y publica nuevos productos en tu tienda.",
    boton: "Crear producto",
    icono: Plus,
    iconoBg: "#FEF9EC",
    iconoColor: "#B45309",
    to: `/private/admin/${PrivateRoutes.CREATE_PRODUCT}`,
  },
  {
    id: "descuentos",
    titulo: "Descuentos",
    descripcion: "Crea promociones por porcentaje o monto fijo.",
    boton: "Gestionar descuentos",
    icono: Percent,
    iconoBg: "#F5F3FF",
    iconoColor: "#7C3AED",
    to: `/private/admin/${PrivateRoutes.DESCUENTOS}`,
  },
  {
    id: "pedidos",
    titulo: "Pedidos",
    descripcion: "Administra y da seguimiento a los pedidos.",
    boton: "Ver pedidos",
    icono: ShoppingBag,
    iconoBg: "#EFF6FF",
    iconoColor: "#1D4ED8",
    to: `/private/admin/${PrivateRoutes.ADMIN_PEDIDOS}`,
  },
];

export default function SellerPanel({ onSelect }) {
  return (
    <section className="w-full max-w-4xl mx-auto px-6 py-10">

      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
          <Store className="w-7 h-7 text-amber-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Panel del vendedor
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Gestiona tu tienda, productos, pedidos y promociones.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {acciones.map((accion) => {
          const Icono = accion.icono;
          return (
            <article
              key={accion.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: accion.iconoBg }}
              >
                <Icono size={20} color={accion.iconoColor} />
              </div>

              <div className="flex flex-col gap-1 flex-1">
                <h3 className="text-base font-semibold text-gray-900">
                  {accion.titulo}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {accion.descripcion}
                </p>
              </div>

              <Link
                to={accion.to}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors w-fit"
              >
                {accion.boton}
                <span className="text-gray-400">→</span>
              </Link>
            </article>
          );
        })}
      </div>

    </section>
  );
}