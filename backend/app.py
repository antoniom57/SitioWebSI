from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os, bcrypt, jwt, sys # <-- IMPORTANTE: He añadido 'sys'
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

MONGO_URI = os.getenv("MONGO_URI")
JWT_SECRET = os.getenv("SECRET_KEY", "devsecret")

# --- BLOQUE DE CONEXIÓN MODIFICADO ---
print(f"--- Intentando conectar con URI: {MONGO_URI} ---")

try:
    # Intentamos crear el cliente con un tiempo de espera de 10 segundos
    client = MongoClient(MONGO_URI, tls=True, serverSelectionTimeoutMS=10000)
    
    # Esta línea es CRÍTICA. Fuerza a pymongo a conectar AHORA MISMO.
    # Si hay un error, ocurrirá aquí y será capturado por el 'except'.
    client.server_info()
    
    print("--- ¡CONEXIÓN A MONGODB EXITOSA! ---")
    
    # Solo definimos 'db' y 'users' si la conexión fue exitosa
    db = client.get_default_database()
    users = db.users

except Exception as e:
    print("--- !!! ERROR DE CONEXIÓN A MONGODB !!! ---")
    print(f"El error detallado es: {e}")
    # Detenemos la aplicación para que el error sea claro y no continúe
    sys.exit(1)
# --- FIN DEL BLOQUE MODIFICADO ---


@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "user")

    if users.find_one({"email": email}):
        return jsonify({"error": "usuario ya existe"}), 400

    pw_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    users.insert_one({"email": email, "password": pw_hash, "role": role})
    return jsonify({"ok": True}), 201

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    user = users.find_one({"email": email})

    if not user or not bcrypt.checkpw(password.encode(), user["password"]):
        return jsonify({"error": "credenciales inválidas"}), 400

    token = jwt.encode({"email": email, "role": user.get("role", "user")}, JWT_SECRET, algorithm="HS256")
    return jsonify({"token": token})

@app.route("/api/me")
def me():
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        return jsonify({"error": "no autorizado"}), 401

    token = auth.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except Exception:
        return jsonify({"error": "token inválido"}), 401

    return jsonify({"email": payload["email"], "role": payload.get("role", "user")})

@app.route("/health")
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    # CORREGIDO: Escucha en 0.0.0.0 para ser accesible desde fuera del servidor
    app.run(host='0.0.0.0', port=5000, debug=True)

