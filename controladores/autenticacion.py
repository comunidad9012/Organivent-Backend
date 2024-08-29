from flask import Blueprint, request, jsonify, session
from werkzeug.security import check_password_hash
from models.modelClient import ClientModel

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    usuario = ClientModel().get_usuario_by_username(username)
    
    if usuario and check_password_hash(usuario['password'], password):
        session['user_id'] = str(usuario['_id'])
        session['is_admin'] = usuario.get('admin', False)
        return jsonify({'message': 'Login successful', 'is_admin': session['is_admin']})
    else:
        return jsonify({'message': 'Invalid credentials'}), 401
