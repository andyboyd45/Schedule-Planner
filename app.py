from flask import Flask, request, jsonify, send_from_directory
import mysql.connector
from dotenv import load_dotenv
import random
import os
import bcrypt

load_dotenv()

app = Flask(__name__, static_folder='public', static_url_path='/public')

@app.route('/')
def serve_index():
    return send_from_directory('public', 'index.html')

# Database connection
def get_db():
    return mysql.connector.connect(
        host=os.getenv('MYSQLHOST'),
        port=int(os.getenv('MYSQLPORT')),
        user=os.getenv('MYSQLUSER'),
        password=os.getenv('MYSQLPASSWORD'),
        database=os.getenv('MYSQL_DATABASE')
    )
    
#Generate Serial ID for each user
def generate_serial_id():
    ID = ''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', k=10))
    
    db = get_db()
    cursor = db.cursor()
    
    cursor.execute("SELECT ID FROM users WHERE ID = %s", (ID,))
    if cursor.fetchone():
        return generate_serial_id()  # Generate a new ID if the current one exists

    return ID

#Hashing password using bcrypt
def create_hashed_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

#Verifying password using bcrypt
def verify_password(password, hashed):
    return bcrypt.checkpw(password.encode('utf-8'), hashed)

#Sign up data sent to database
#TODO: Check if username is already takedn and send and error message
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    ID = generate_serial_id()
    hash_password = create_hashed_password(password)
    try:
        
        db = get_db()
        cursor = db.cursor()

        # Check if user already exists
        cursor.execute("SELECT ID FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({'error': 'User already exists'}), 400

        # Insert new user
        cursor.execute("INSERT INTO users (ID, username, email, password) VALUES (%s, %s, %s, %s)", (ID, username, email, hash_password))
        db.commit()

        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        print(e)
        return jsonify({'error': 'PYTHON ERROR: An error occurred while creating the user'}), 500
    finally:
        cursor.close()
        db.close()

#Login data verified with data and send user schedule data to frontend
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    try:
        db = get_db()
        cursor = db.cursor()
        
        #Finding user in database
        cursor.execute("SELECT password FROM users WHERE username = %s", (username,))
        hash_password = cursor.fetchone()
        if not hash_password: #Couldn't find password for username
            return jsonify({'error': 'User not found'}), 404
        
        #Check password is correct
        if verify_password(password, hash_password):
            #TODO: Send User's Planner data to frontend upon successful login
            return jsonify({'message': 'Login successful'}), 200 
        else:
            return jsonify({'error': 'Invalid password'}), 401
    except Exception as e:
        print(e)
        return jsonify({'error': 'PYTHON ERROR: An error occurred while logging in'}), 500
    
    finally:
        cursor.close()
        db.close()
        
        
    
    
    

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    app.run(host='0.0.0.0', port=port)