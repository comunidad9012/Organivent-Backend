import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

function Productos() {
  const [Productos, setProductos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/Productos/showProductos')
      .then((response) => response.json())
      .then((data) => setProductos(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <Helmet>
        <title>Productos</title>
      </Helmet>

      <div className='container text-center'>
        <h1>Productos</h1>
        <div className="row mx-auto d-flex justify-content-center align-items-center mt-4">
          {Productos.map((item, index) => (
            <React.Fragment key={item._id}>
              <div className="col-md-4 mi-clase-css mt-4">
                <div className="card h-100" style={{ width: "18rem" }}>
                  {/* aca no iria miniatura pero bueno asi quedo con el chat */}
                  <img src={item.miniatura || "../../imagenes/foto.png"} className="card-img-top" alt="..." />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{item.nombre_producto}</h5>
                    <p className="card-text">{item.descripcion}</p>
                    <p className="card-text">
                      {/* <small className="text-body-secondary">{item.fecha}</small> */}
                    </p>
                    <Link to={`/Productos/viewproduct/${item._id}`} className="mt-auto">Ver más</Link>
                  </div>
                </div>
              </div>
              {index % 3 === 2 && <div className="w-100"></div>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Productos;
