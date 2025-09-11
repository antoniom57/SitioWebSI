from flask import Flask, jsonify
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)

# Conexión a MongoDB
client = MongoClient(os.getenv("MONGO_URI"))
db = client.get_database('sitio')  # usa la base de datos indicada en la URI

@app.route("/health")
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
