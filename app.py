from flask import Flask, request, jsonify, send_from_directory, session
import mysql.connector
from dotenv import load_dotenv
import random
import os
import bcrypt
import json

load_dotenv()

app = Flask(__name__, static_folder='public', static_url_path='/public')

app.secret_key = os.getenv('SECRET_KEY')

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
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

#Default event types for each user
def event_types():
    return [
        {"name": "work", "color": "#1a73e8", "default": True},
        {"name": "health", "color": "#34a853", "default": True},
        {"name": "fitness", "color": "#e8710a", "default": True},
        {"name": "personal", "color": "#9c27b0", "default": True}
    ]

#Sign up data sent to database
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    ID_user = generate_serial_id()
    hash_password = create_hashed_password(password)

    db = None
    cursor = None 
    try:
        
        db = get_db()
        cursor = db.cursor()

        # Check if user already exists
        cursor.execute("SELECT ID FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({'error': 'User already exists'}), 400
        
        cursor.execute("SELECT username FROM users WHERE username = %s", (username,))
        if cursor.fetchone():
            return jsonify({'error': 'Username already taken'}),401

        # Insert new user into users database
        cursor.execute("INSERT INTO users (ID, username, email, password) VALUES (%s, %s, %s, %s)", (ID_user, username, email, hash_password))
        db.commit()
        
        #Insert new user into planner database with default values
        ID_planner = generate_serial_id()
        cursor.execute("INSERT INTO planner (ID, user_ID, planner_data, event_types) VALUES (%s, %s, %s, %s)", (ID_planner, ID_user, '{}', json.dumps(event_types())))
        db.commit()

        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        print(e)
        return jsonify({'error': 'PYTHON ERROR: An error occurred while creating the user'}), 500
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

#Login data verified with data and send user schedule data to frontend
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    db = None
    cursor = None    
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True, buffered=True)
        
        #grabs info
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()
        #Finding user in database
        if not user:
            return jsonify({'error': 'User not found'}), 404

        #Finding user in database
        hash_password = user['password']

        
        #Check password is correct
        if verify_password(password, hash_password):
            session['user_id'] = user['ID']
            session['username'] = username
            return jsonify({'message': 'Login successful'}), 200 
        else:
            return jsonify({'error': 'Invalid password'}), 401
    except Exception as e:
        print(e)
        return jsonify({'error': 'PYTHON ERROR: An error occurred while logging in'}), 500
    
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

#Send user's planner data to page
@app.route('/api/get_data', methods=['GET'])
def planner_data():
    if 'user_id' not in session:
        return jsonify({'error': 'User Not logged in'}), 401
    
    user_id = session['user_id']
    username = session['username']
    
    db = None
    cursor = None
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        
        cursor.execute('SELECT * FROM planner WHERE user_ID = %s',(user_id,))
        user = cursor.fetchone()
        return jsonify({
            'planner_data' : json.loads(user['planner_data']),
            'username': username,
            'event_types': json.loads(user['event_types'])
        }), 200
        
        
    except Exception as e:
        print(e)
        return jsonify({'error': 'Server side error'}), 500
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

#Get user's new planner data
@app.route('/api/save', methods=['PUT'])
def save_planner_data():
    data = request.get_json()
    planner = json.dumps(data.get('planner_data'))
    
    user_id = session['user_id']
    
    if 'user_id' not in session:
        return jsonify({'error': 'User Not logged in'}), 401
    
    db = None
    cursor = None
    try:
        db = get_db()
        cursor = db.cursor()
        
        cursor.execute('UPDATE planner SET planner_data = %s WHERE user_ID = %s',(planner,user_id))
        db.commit()
        
        return jsonify({'message':'Data uploaded successfuly'}), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

        
        
           
    
    
    

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    app.run(host='0.0.0.0', port=port)