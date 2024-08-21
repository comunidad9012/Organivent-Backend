import os
from dotenv import load_dotenv
from flask import Flask, send_from_directory
from controladores.user_controlador import user_bp
from controladores.news_controlador import news_bp
from controladores.img_controlador import imgs_bp
from flask_cors import CORS
from flask_pymongo import PyMongo

load_dotenv()

app = Flask(__name__, static_folder='../images', static_url_path='/images') #reemplace el directorio de el front antiguo por una carpeta con imagenes
cors_app = CORS(app)


app.config['MONGO_URI']= os.getenv('MONGOURL')
mongo = PyMongo(app)

app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), '../images')

app.config['CORS_HEADERS'] = 'Content-Type'
app.config['Access-Control-Allow-Credentials'] = "true"

app.register_blueprint(user_bp)
app.register_blueprint(news_bp)
app.register_blueprint(imgs_bp)

@app.route('/images/<path:filename>') #tuve que agregar la ruta aca para que funcione, despues veo si la puedo cambiar con un bp
def serve_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == "__main__":
    app.run(debug=True)
