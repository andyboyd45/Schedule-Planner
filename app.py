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

#Sign up data sent to database
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    ID_user = generate_serial_id()
    hash_password = create_hashed_password(password)
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
        cursor.execute("INSERT INTO planner (ID, user_ID, planner_data) VALUES (%s, %s, %s)", (ID_planner, ID_user, '{}'))
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
        cursor.close()
        db.close()

#Send user's planner data to page
@app.route('/api/planner_data', methods=['GET'])
def planner_data():
    if 'user_id' not in session:
        return jsonify({'error': 'User Not logged in'}), 401
    
    user_id = session['user_id']
    username = session['username']
    
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        
        cursor.execute('SELECT * FROM planner WHERE user_ID = %s',(user_id,))
        user = cursor.fetchone()
        return jsonify({
            'planner_data' : json.loads(user['planner_data']),
            'username': username
        }), 200
        
        
    except Exception as e:
        print(e)
        return jsonify({'error': 'Server side error'}), 500
    finally:
        cursor.close()
        db.close

#Get user's new planner data
#TODO: Change to PUT method
@app.route('/api/save', methods=['POST'])
def save_planner_data():
    data = request.get_json()
    planner = json.dumps(data.get('planner_data'))
    
    user_id = session['user_id']
    
    try:
        db = get_db()
        cursor = db.cursor()
        
        cursor.execute('UPDATE planner SET planner_data = %s WHERE user_ID = %s',(planner,user_id))
        db.commit()
        
        return jsonify({'message':'Data uploaded successfuly'}), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        db.close()
        
        
           
    
    
    

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    app.run(host='0.0.0.0', port=port)