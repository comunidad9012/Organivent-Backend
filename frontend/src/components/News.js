import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

function News() {
  const [news, setNews] = useState([]);
  useEffect(() => {
    fetch('http://localhost:5000/news/showNews')
      .then((response) => response.json())
      .then((data) => setNews(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <Helmet>
        <title>Noticias</title>
      </Helmet>
      <div className='container text-center'> 
      <h1>Noticias</h1>
      <div className="row mx-auto d-flex justify-content-center align-items-center mt-4">
        {news.map((item, index) => (
          <React.Fragment key={item._id}>
            <div className="col-md-4 mi-clase-css mt-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{item.titulo}</h5>
                  <Link to={`/news/viewNew/${item._id}`}>Leer</Link>
                  <p className="card-text"><small className="text-body-secondary">{item.fecha}</small></p>
                </div>
                <div className="mt-auto">
                  <hr className="my-1"></hr>
                  <img src={item.miniatura} classname="card-img-bottom" alt="..." style={{ maxWidth: "100%", height: 200, objectFit: "contain" }} />
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

export default News;