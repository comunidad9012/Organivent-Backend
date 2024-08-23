import { useState, useRef, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { showSuccessMessage, showErrorMessage, closeMessage } from './messages';
import { Helmet } from 'react-helmet';
import '../styles/CreateProductos.css';

function Create() {
  const [nombre_producto, setnombre_producto] = useState(''); //no larga error pero no lo muestra
  const [descripcion, setContent] = useState('');
  const [precio_venta, setprecio_venta] = useState('');
  const editorRef = useRef(null);
  const [miniatura, setMiniatura] = useState('');
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(false); // Estado para manejar la carga

  useEffect(() => {
    fetch('http://localhost:5000/imgs/gallery')
      .then(response => response.json())
      .then(data => setImagenes(data))
      .catch(error => console.error('Error fetching images:', error));
  }, []);

  const handleEditorChange = (content, editor) => {
    setContent(content);
  };

  const handlenombre_productoChange = (event) => {
    setnombre_producto(event.target.value);
  };

  const handleprecio_ventaChange = (event) => { //aca
    setprecio_venta(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const fechaAct = new Date().toLocaleDateString();

    const data = {
      nombre_producto,
      descripcion,
      precio_venta, //aca
      fecha: fechaAct,
      miniatura
    };

    setLoading(true); // Mostrar el mensaje de carga

    fetch('http://localhost:5000/Productos/createProductos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setLoading(false); // Ocultar el mensaje de carga
      showSuccessMessage('Producto cargado con éxito!');
    })
    .catch(error => {
      console.error('Error:', error);
      setLoading(false); // Ocultar el mensaje de carga
      showErrorMessage('Error al cargar el producto: ' + error.message);
    });
  };

  function Click() {
    showSuccessMessage("¡Operación exitosa!");
    closeMessage('message-success');
  }

  const handleMiniaturaSelect = (imgUrl) => {
    setMiniatura(imgUrl);
  };

  return (
    <div>
      <Helmet>
        <title>Añadir producto</title>
      </Helmet>
      <form onSubmit={handleSubmit}>
        <div className="container text-center col-md-8 mt-4 mb-4">
          <label htmlFor="nombre_producto"><h5>Nombre del producto</h5></label>
          <input type="text" className="form-control" id="nombre_producto" value={nombre_producto} onChange={handlenombre_productoChange} required />
          <br></br>
          <h5 className='mt-2'>Descripción</h5>
        </div>
        <div className="container text-center col-md-8 mt-4 mb-4">
          <Editor
            apiKey='1hyldt9u4byda8tjkhrxwy3zqocdzt2fujo24fy4spgi9wmc'
            onInit={(evt, editor) => editorRef.current = editor}
            init={{
              height: 500,
              menubar: true,
              language: 'es',
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | formatselect | bold italic forecolor | ' +
                'alignleft aligncenter alignright alignjustify | ' +
                'bullist numlist outdent indent | removeformat | image | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
              images_upload_url: 'http://localhost:5000/imgs/upload',
              automatic_uploads: true,
              file_picker_types: 'image',
              file_picker_callback: (cb, value, meta) => {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');

                input.onchange = function() {
                  const file = this.files[0];

                  const formData = new FormData();
                  formData.append('file', file);

                  fetch('http://localhost:5000/imgs/upload', {
                    method: 'POST',
                    body: formData
                  })
                  .then(response => response.json())
                  .then(data => {
                    if (data.location) {
                      cb(data.location, { title: file.name });
                    } else {
                      console.error('Error: la respuesta no contiene la URL de la imagen.');
                      showErrorMessage('Error: la respuesta no contiene la URL de la imagen.');
                    }
                  })
                  .catch(error => {
                    console.error('Error:', error);
                    showErrorMessage('Error al subir la imagen: ' + error.message);
                  });
                };

                input.click();
              }
            }}
            onEditorChange={handleEditorChange}
          />
        <br></br>
        <label htmlFor="precio_venta"><h5>Precio</h5></label>
          <input type="number" className="form-control" id="precio_venta" value={precio_venta} onChange={handleprecio_ventaChange} required />
        </div>
        <div className="container text-center mt-2">
          {/* Ocultar el botón mientras loading es true */}
          {!loading && (
            <button type="submit" className="btn btn-success" onClick={Click}>
              Cargar producto
            </button>
          )}
        </div>
        {/* Indicador de carga */}
        {loading && 
          <div className="banter-loader">
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
            <div className="banter-loader__box"></div>
          </div>
        }
        {/* Mensaje de éxito (oculto inicialmente) */}
        <div
          id="message-success"
          className="alert alert-success"
          style={{ display: "none" }}
        >
          <span className="close-btn" onClick={() => closeMessage('message-success')}>
            ×
          </span>
          <span id="success-message" />
        </div>
        {/* Mensaje de error (oculto inicialmente) */}
        <div
          id="message-error"
          className="alert alert-danger"
          style={{ display: "none" }}
        >
          <span className="close-btn" onClick={() => closeMessage('message-error')}>
            ×
          </span>
          <span id="error-message" />
        </div>
        <div className="container text-center col-md-8 mt-4 mb-4">
          <h5 className='mt-2'>Seleccionar miniatura</h5>
          <div className="gallery">
            {imagenes.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={`Miniatura ${index}`}
                className={`miniatura ${miniatura === img.url ? 'selected' : ''}`}
                onClick={() => handleMiniaturaSelect(img.url)}
                style={{ width: '100px', cursor: 'pointer', margin: '10px' }}
              />
            ))}
          </div>
          {miniatura && (
            <div>
              <h5>Miniatura seleccionada:</h5>
              <img src={miniatura} alt="Miniatura seleccionada" style={{ width: '200px' }} />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default Create;
