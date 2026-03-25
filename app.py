from flask import Flask, request, jsonify, send_from_directory
import mysql.connector
from dotenv import load_dotenv
import random
import os

load_dotenv()

app = Flask(__name__, static_folder='public')

# Database connection
def get_db():
    return mysql.connector.connect(
        host=os.getenv('SQLHOST'),
        port=os.getenv('SQLPORT'),
        user=os.getenv('SQLUSER'),
        password=os.getenv('SQLPASSWORD'),
        database=os.getenv('SQLDATABASE')
    )
    
#Generate Serial ID for each user
def generate_serial_id():
    ID = ''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', k=10))
    
    db = get_db()
    cursor = db.cursor()
    
    cursor.execute("SELECT id FROM users WHERE id = %s", (ID,))
    if cursor.fetchone():
        return generate_serial_id()  # Generate a new ID if the current one exists

    return ID

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'error': 'Missing required fields'}), 400
    
    ID = generate_serial_id()

    db = get_db()
    cursor = db.cursor()

    # Check if user already exists
    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    if cursor.fetchone():
        return jsonify({'error': 'User already exists'}), 400

    # Insert new user
    cursor.execute("INSERT INTO users (ID, username, email, password) VALUES (%s, %s, %s, %s)", (ID, username, email, password))
    db.commit()

    return jsonify({'message': 'User created successfully'}), 201