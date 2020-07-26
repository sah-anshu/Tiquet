from functools import wraps
from flask import Flask, g, jsonify, request
import jwt

def protected_route(route):
    @wraps(route)
    def wrapper(*args, **kwargs):
        token = request.headers.get('token')

        if token is not None:
            try:
                decoded_user = jwt.decode(token, 'secret_pasword', algorithms='HS256')
                g.user = decoded_user
                return route(*args, **kwargs)
            except jwt.InvalidTokenError: 
                return jsonify(msg="Invalid token"), 400
        return jsonify(msg="Unauthorized, missing token"), 401
    return wrapper