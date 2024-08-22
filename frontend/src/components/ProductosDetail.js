import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

function ProductosDetail() {
  const [Productos, setProductos] = useState({});
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:5000/Productos/viewProductos/${id}`) //aca tambien puerto 3000?
      .then(response => response.json())
      .then(data => setProductos(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [id]);

  return (
    <div>
      <Helmet>
        <title>{Productos.titulo}</title>
        {/* corregir el nombre */}
      </Helmet>
      <h1>{Productos.titulo}</h1>
      <div dangerouslySetInnerHTML={{ __html: Productos.noticia }} />
    </div>
  );
}

export default ProductosDetail;
