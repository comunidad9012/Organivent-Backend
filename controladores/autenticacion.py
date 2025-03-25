from flask import Blueprint, request, jsonify, session, current_app

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    client_model = ClientModel(current_app)
    usuario = client_model.get_usuario_by_username(username)
    
    if usuario and check_password_hash(usuario['Contraseña'], password):
        session['user_id'] = str(usuario['_id'])
        session['is_admin'] = usuario.get('admin', False)
        return jsonify({'message': 'Login successful', 'is_admin': session['is_admin']}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401
