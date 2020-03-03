# __init__.py

from config import Config
from flask import Flask, render_template
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_socketio import SocketIO

# init SQLAlchemy so we can use it later in our models
db = SQLAlchemy()


# def create_app():

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
if __name__ == '__main__':
    socketio.run(app)

from thesis import auth, models

# blueprint for auth routes in our thesis
from thesis.auth import auth as auth_blueprint
app.register_blueprint(auth_blueprint)

# blueprint for non-auth parts of thesis
from thesis.main import main as main_blueprint
app.register_blueprint(main_blueprint)

# db.init_app(app)

login_manager = LoginManager()
login_manager.login_view = 'auth.login'
login_manager.init_app(app)

from .models import User


@login_manager.user_loader
def load_user(user_id):
    # since the user_id is just the primary key of our user table, use it in the query for the user
    return User.query.get(int(user_id))

# return app
