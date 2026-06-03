import Productos from "../components/Productos";
import Banner from "../components/banner/Banner";
import ProductosMasVendidos from "../components/ProductosMasVendidos";

function User() {
  return (
    <div>
      <Banner />
      <ProductosMasVendidos />
      <Productos />
    </div>
  );
}

export default User;