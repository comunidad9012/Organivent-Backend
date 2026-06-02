import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect, useMemo, useCallback } from "react";
import { ShoppingCart, Search, Heart, User } from 'lucide-react';

import Categorias from './Categorias';
import ProfileDropdown from "./ProfileDropdown";
import { useCart } from "./context/CartContext";
import store from "../redux/store";
import { Roles } from "../models/roles";
import { PrivateRoutes, PublicRoutes } from "../models/routes";
import '../styles/navbar.css';
import { Sparkles } from "lucide-react"; // iconito de brillito
import FavoritesButton from "./FavoritesButton";
import SearchBar from "./SearchBar";

// Componente para el logo
const Logo = () => (
  <Link to={`/${PublicRoutes.HOME}`} className="flex items-center gap-2.5 group shrink-0">
    {/* Círculo con brillo */}
    <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center shadow-sm group-hover:bg-amber-500 transition-colors duration-200">
      <Sparkles className="w-4 h-4 text-white" />
    </div>

    {/* Texto con efecto de brillito */}
    <span
      className="text-lg font-semibold text-gray-800 group-hover:text-amber-600 transition-colors duration-200"
      style={{ letterSpacing: '-0.01em' }}
    >
      Un destello más
    </span>
  </Link>
);

// Componente para enlaces de navegación
const NavLink = ({ to, children, isActive = false }) => (
  <Link
    to={to}
    className={`text-sm font-medium transition-colors duration-200 ${
      isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-800'
    }`}
  >
    {children}
  </Link>
);

// Componente para el botón del carrito
const CartButton = ({ totalItems, animate }) => (
  <Link to={`/private/${PrivateRoutes.CART}`}>
    <button
      className="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      aria-label={`Carrito de compras - ${totalItems} items`}
    >
      <ShoppingCart className="w-5 h-5 text-gray-600" />
      {totalItems > 0 && (
        <span
          className={`absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ${
            animate ? 'animate-bounce' : ''
          }`}
        >
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  </Link>
);

// Componente para acciones del usuario autenticado
const UserActions = ({ userRole, location, totalItems, animate }) => (
  <div className="flex items-center gap-1">

    {userRole === Roles.ADMIN && (
      <Link
        to="/private/admin"
        className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors duration-200 ${
          location.pathname === "/private/admin"
            ? "bg-amber-50 text-amber-700"
            : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
        }`}
      >
        Panel vendedor
      </Link>
    )}

    {userRole === Roles.USER && (
      <Link
        to={`/private/${PrivateRoutes.USER_PEDIDOS}`}
        className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors duration-200 ${
          location.pathname === `/private/${PrivateRoutes.USER_PEDIDOS}`
            ? "bg-amber-50 text-amber-700"
            : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
        }`}
      >
        Mis Pedidos
      </Link>
    )}

    <ProfileDropdown />

    {userRole === Roles.USER && <FavoritesButton />}

    {userRole === Roles.USER && (
      <CartButton totalItems={totalItems} animate={animate} />
    )}

  </div>
);

function Navbar() {
  const location = useLocation();
  const userState = useSelector(store => store.user);
  const [animate, setAnimate] = useState(false);
  const { cart } = useCart();

  // Memoizar cálculos pesados
  const totalItems = useMemo(() => 
    cart.reduce((acc, item) => acc + (item.quantity || 1), 0),
    [cart]
  );

  const isAuthenticated = useMemo(() => 
    userState.rol !== null,
    [userState.rol]
  );

  // Optimizar la animación del carrito
  const triggerCartAnimation = useCallback(() => {
    if (totalItems > 0) {
      setAnimate(true);
      const timeout = setTimeout(() => setAnimate(false), 600);
      return () => clearTimeout(timeout);
    }
  }, [totalItems]);

  useEffect(() => {
    const cleanup = triggerCartAnimation();
    return cleanup;
  }, [triggerCartAnimation]);

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white overflow-x-hidden">
      {/* Fila superior: logo + búsqueda + login */}
      <div className="px-6 py-2.5 flex items-center justify-between gap-4">
        <Logo />
        <div className="flex-1 max-w-md">
          <SearchBar />
        </div>
        {!isAuthenticated && (
          <Link
            to={`/${PublicRoutes.LOGIN}`}
            className="shrink-0 px-4 py-1.5 text-sm font-medium bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-colors duration-200"
          >
            Iniciar sesión
          </Link>
        )}
      </div>
 
      {/* Fila inferior: nav links + acciones */}
      <div className="px-6 py-1.5 flex items-center justify-between border-t border-gray-100">
        <div className="flex items-center gap-6">
          <NavLink
            to={`/${PublicRoutes.HOME}`}
            isActive={location.pathname === `/${PublicRoutes.HOME}`}
          >
            Inicio
          </NavLink>
          <NavLink to="#">Ofertas</NavLink>
          <Categorias />
        </div>
 
        {isAuthenticated && (
          <UserActions
            userRole={userState.rol}
            location={location}
            totalItems={totalItems}
            animate={animate}
          />
        )}
      </div>
    </div>
  );
  
}

export default Navbar;