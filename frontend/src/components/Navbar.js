import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Productos from './Productos';
import ProductosDetail from './ProductosDetail';
import Create from './CreateProductos';
import SearchForm from './SearchForm';
import '../styles/index.css'; // Asegúrate de que esta ruta sea correcta

function Navbar() {
    const location = useLocation(); // Obtener la ubicación actual

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
            {location.pathname !== '/' && (
                <Link className="navbar-brand fancy" to="/">
                    {/* Inicio */}
                    <span className="top-key"></span>
                    <span className="text">Inicio</span>
                    <span className="bottom-key-1"></span>
                    <span className="bottom-key-2"></span>
                </Link>
            )}
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {location.pathname !== '/Productos/editor' && (
                            <li className="nav-item">
                                <Link className="nav-link active fancy" aria-current="page" to="/Productos/editor">
                                    {/* Crear noticia */}
                                    <span className="top-key"></span>
                                    <span className="text">Añadir producto</span>
                                    <span className="bottom-key-1"></span>
                                    <span className="bottom-key-2"></span>
                                </Link>
                            </li>
                        )}
                    </ul>
                    <SearchForm />
                    {/* Encontrar la forma de pasar el json a otro componente */}
                </div>
            </div>
        </nav>
    );
}

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path='/' element={<Productos />} />
                <Route path='/Productos/viewproduct/:id' element={<ProductosDetail />} />
                <Route path='/Productos/editor' element={<Create />} />
            </Routes>
        </Router>
    );
}

export default App;
