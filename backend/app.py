from flask import Flask, request, jsonify
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import bcrypt
import jwt
from flask_cors import CORS


load_dotenv()
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"]) # permitir dev frontend


MONGO_URI = os.getenv('MONGO_URI')
JWT_SECRET = os.getenv('JWT_SECRET') or 'dev_jwt_secret'
client = MongoClient(MONGO_URI)
db = client.get_default_database(sitio)
users = db.users


@app.route('/api/register', methods=['POST'])
def register():
data = request.get_json()
email = data.get('email')
password = data.get('password')
role = data.get('role','user')
if users.find_one({'email': email}):
return jsonify({'error':'usuario ya existe'}), 400
pw_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
users.insert_one({'email': email, 'password': pw_hash, 'role': role})
return jsonify({'ok':True}), 201


@app.route('/api/login', methods=['POST'])
def login():
data = request.get_json()
email = data.get('email')
password = data.get('password')
user = users.find_one({'email': email})
if not user: return jsonify({'error':'usuario no encontrado'}), 400
if not bcrypt.checkpw(password.encode(), user['password']):
return jsonify({'error':'contraseña inválida'}), 400
token = jwt.encode({'email': email, 'role': user.get('role','user')}, JWT_SECRET, algorithm='HS256')
return jsonify({'token': token})


@app.route('/api/me')
def me():
auth = request.headers.get('Authorization','')
if not auth.startswith('Bearer '): return jsonify({'error':'no autorizado'}),401
token = auth.split(' ',1)[1]
try:
payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
except Exception as e:
return jsonify({'error':'token inválido'}),401
return jsonify({'email': payload['email'], 'role': payload.get('role','user')})


@app.route('/health')
def health():
return jsonify({'status':'ok'})


if __name__=='__main__':
app.run(debug=True)