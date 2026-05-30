import Productos from "../components/Productos";
import BannerAdmin from "../components/BannerAdmin";

function Admin() {
  return (
    <div className="px-6 py-8">
      <h1 className="text-4xl font-bold text-center mb-10">
        Usuario ADMIN
      </h1>

      <BannerAdmin />

      <Productos />
    </div>
  );
}

export default Admin;