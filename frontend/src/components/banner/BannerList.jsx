// listado de banners

import { Image } from "lucide-react";
import BannerListItem from "./BannerListItem";

function BannerList({
  banners,
  abrirModalEditar,
  eliminarBanner,
  normalizarActivo,
}) {
  if (banners.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-300 gap-3">
        <Image size={40} strokeWidth={1.2} />
        <p className="text-sm">Todavía no hay banners creados.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 pr-2">
      {banners.map((banner) => (
        <BannerListItem
          key={banner._id}
          banner={banner}
          abrirModalEditar={abrirModalEditar}
          eliminarBanner={eliminarBanner}
          normalizarActivo={normalizarActivo}
        />
      ))}
    </div>
  );
}

export default BannerList;