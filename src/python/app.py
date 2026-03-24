from flask import Flask, app, render_template, request, redirect, url_for


@app.route('/signup', method=['POST'])
def signup():
    data = request.get_json()
    
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    
    
    #send to database

