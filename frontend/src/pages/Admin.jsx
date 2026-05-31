import { useState } from "react";
import SellerPanel from "../components/SellerPanel";
import Productos from "../components/Productos";
import BannerAdmin from "../components/BannerAdmin";

function Admin() {
  const [seccionActiva, setSeccionActiva] = useState(null);

  const renderSeccion = () => {
    if (!seccionActiva) return null;

    if (seccionActiva === "producto") {
      return (
        <section className="max-w-7xl mx-auto px-6 py-10">
          <div className="bg-white border rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-2">Nuevo producto</h2>
            <p className="text-gray-600 mb-4">
              Acá conectamos el formulario o modal de creación de productos.
            </p>

            <Productos />
          </div>
        </section>
      );
    }

    if (seccionActiva === "banner") {
      return (
        <section className="max-w-7xl mx-auto px-6 py-10">
          <div className="bg-white border rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Personalizar banner</h2>
            <BannerAdmin />
          </div>
        </section>
      );
    }

    if (seccionActiva === "descuentos") {
      return (
        <section className="max-w-7xl mx-auto px-6 py-10">
          <div className="bg-white border rounded-2xl p-8 text-center shadow-sm">
            <h2 className="text-2xl font-bold mb-2">Descuentos</h2>
            <p className="text-gray-600">
              Acá conectamos el componente de gestión de descuentos.
            </p>
          </div>
        </section>
      );
    }

    if (seccionActiva === "cupones") {
      return (
        <section className="max-w-7xl mx-auto px-6 py-10">
          <div className="bg-white border rounded-2xl p-8 text-center shadow-sm">
            <h2 className="text-2xl font-bold mb-2">Cupones</h2>
            <p className="text-gray-600">
              Acá conectamos el componente para crear y administrar cupones.
            </p>
          </div>
        </section>
      );
    }

    if (seccionActiva === "pedidos") {
      return (
        <section className="max-w-7xl mx-auto px-6 py-10">
          <div className="bg-white border rounded-2xl p-8 text-center shadow-sm">
            <h2 className="text-2xl font-bold mb-2">Pedidos</h2>
            <p className="text-gray-600">
              Acá conectamos la vista de pedidos del vendedor.
            </p>
          </div>
        </section>
      );
    }

    return null;
  };

  return (
    <div>
      <SellerPanel onSelect={setSeccionActiva} />

      {renderSeccion()}
    </div>
  );
}

export default Admin;