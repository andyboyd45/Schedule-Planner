from flask import Flask, request, jsonify, send_from_directory
import mysql.connector
from dotenv import load_dotenv
import random
import os
import bcrypt
import gunicorn

load_dotenv()

app = Flask(__name__, static_folder='public', static_url_path='/public')

@app.route('/')
def serve_index():
    return send_from_directory('public', 'index.html')

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

#Signing up data sent to database
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'error': 'Missing required fields'}), 400
    
    ID = generate_serial_id()
    hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    try:
        
        db = get_db()
        cursor = db.cursor()

        # Check if user already exists
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({'error': 'User already exists'}), 400

        # Insert new user
        cursor.execute("INSERT INTO users (ID, username, email, password) VALUES (%s, %s, %s, %s)", (ID, username, email, hash))
        db.commit()

        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        print(e)
        return jsonify({'error': 'An error occurred while creating the user'}), 500
    finally:
        cursor.close()
        db.close()

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)