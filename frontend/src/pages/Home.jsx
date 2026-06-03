import BannerCarousel from "../components/banner/BannerCarousel";
import Productos from "../components/Productos";
import ProductosMasVendidos from "../components/ProductosMasVendidos";


function Home() {
  return (
    <>
      <BannerCarousel />
      <ProductosMasVendidos />
      <Productos />
    </>
  );
}

export default Home;