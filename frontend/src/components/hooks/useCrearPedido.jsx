// hooks/useCrearPedido.js
// hooks/useCrearPedido.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useSelector } from "react-redux";
import { PrivateRoutes } from "../../models/routes";
import { toast } from "sonner";

function useCrearPedido() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { cart, dispatch } = useCart();
  const userState = useSelector((state) => state.user);

  const handleComprar = async (opciones = {}) => {
    if (opciones?.preventDefault) opciones.preventDefault();

    const {
      cupon = null,
      descuento_cupon = 0,
      total_final = null,
      subtotal_sin_cupon = null,
    } = opciones;

    setLoading(true);

    const subtotalCalculado = cart.reduce((acc, item) => {
      const precio = Number(
        item.precio_final ?? item.precio_venta ?? 0
      );
    
      return acc + precio * (item.quantity || 1);
    }, 0);

    const data = {
      usuarioId: userState.id,
      cliente_nombre: userState.nombre_usuario,
      cliente_email: userState.email,

      productos: cart.map((p) => {
        const precioOriginal = Number(
          p.precio_original ?? p.precio_venta ?? 0
        );
      
        const precioFinal = Number(
          p.precio_final ?? p.precio_venta ?? precioOriginal
        );
      
        return {
          productoId: p._id,
          nombre: p.nombre_producto,
          cantidad: p.quantity || 1,
          color: p.selectedColor || null,
      
          precio_original: precioOriginal,
          precio_final: precioFinal,
          descuento_aplicado: p.descuento_aplicado || null,
      
          precio_unitario: precioFinal,
          subtotal: precioFinal * (p.quantity || 1),
          imagenes: p.imagenes || [],
        };
      }),

      subtotal: subtotal_sin_cupon ?? subtotalCalculado,
      descuento_cupon: descuento_cupon || 0,
      total: total_final ?? subtotalCalculado,

      cupon: cupon
        ? {
            codigo: cupon.codigo,
            nombre: cupon.nombre,
            tipo: cupon.tipo,
            valor: cupon.valor,
            descuento_total: cupon.descuento_total,
          }
        : null,
    };

    try {
      const response = await fetch("http://localhost:5000/Pedidos/createPedido", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Error al crear el pedido");

      const result = await response.json();
      console.log("📦 Respuesta del servidor al crear pedido:", result);

      if (result.mensaje === "Pedido creado exitosamente") {
        toast.success("¡Pedido creado con éxito!");
        dispatch({ type: "CLEAR_CART" });

        setTimeout(() =>
          navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.COMPRA_FINALIZADA}`, {
            replace: true,
          })
        );
      } else {
        toast.error("Error al crear el pedido");
        console.error(
          "Error al crear el pedido: " + (result.error || "Respuesta inesperada")
        );
      }
    } catch (err) {
      console.error("Error al crear el pedido:", err);
      toast.error("Error al crear el pedido: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return { handleComprar, loading };
}

export default useCrearPedido;