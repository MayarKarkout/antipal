from flask_login import UserMixin
from datetime import datetime

from sqlalchemy import ForeignKey
from sqlalchemy.orm import backref

from thesis import db


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(100), index=True, unique=True)
    password = db.Column(db.String(100))
    name = db.Column(db.String(64), index=True, unique=True)
    # profile_id = db.Column(db.Integer, ForeignKey('profile.id'))
    profile = db.relationship('Profile', back_populates='user', cascade='all,delete', uselist=False)
    antipodal_of_id = db.Column(db.Integer, ForeignKey('user.id'))
    antipodal_of = db.relationship('User', uselist=False, foreign_keys=[antipodal_of_id])
    antipodal_for_id = db.Column(db.Integer, ForeignKey('user.id'))
    antipodal_for = db.relationship('User', uselist=False, foreign_keys=[antipodal_for_id])

    def __repr__(self):
        return '<User {}>'.format(self.name)


class Profile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(255))
    last_name = db.Column(db.String(255))
    country = db.Column(db.String(50))
    city = db.Column(db.String(50))
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User', back_populates='profile')

    def __repr__(self):
        return '<Profile {}>'.format(self.user_id, self.first_name, self.last_name)