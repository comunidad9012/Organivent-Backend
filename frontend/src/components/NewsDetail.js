import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

function NewsDetail() {
  const [news, setNews] = useState({});
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:5000/news/viewNews/${id}`) //aca tambien puerto 3000?
      .then(response => response.json())
      .then(data => setNews(data))
      .catch(error => console.error('Error fetching data:', error));
  }, [id]);

  return (
    <div>
      <Helmet>
        <title>{news.titulo}</title>
        {/* corregir el nombre */}
      </Helmet>
      <h1>{news.titulo}</h1>
      <div dangerouslySetInnerHTML={{ __html: news.noticia }} />
    </div>
  );
}

export default NewsDetail;
