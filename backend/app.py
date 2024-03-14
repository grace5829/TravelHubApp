from flask import Flask, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from enum import Enum
import os
from dotenv import load_dotenv

load_dotenv()

db_password = os.getenv("DATABASE_PASSWORD")


app= Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']='postgresql://gracegao:{db_password}@localhost/TravelHub'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db=SQLAlchemy(app)
CORS(app)





# to load the db 
# new terminal, cd to correct folder, type python and enter, run "from app import db,app" ,
# app.app_context().push(), db.create_all()

class RSVPEnum(Enum):
    YES = 'yes'
    NO = 'no'
    MAYBE = 'maybe'
    PENDING = 'pending'
class GenderEnum(Enum):
    MALE = 'male'
    FEMALE = "female"


class Guests(db.Model):
    __tablename__ = 'guests'
    id=db.Column(db.Integer, primary_key=True)
    notes=db.Column(db.String(100), nullable=False)
    firstName=db.Column(db.String(20), nullable=False)
    gender=db.Column(db.Enum(GenderEnum), nullable=False)
    lastName=db.Column(db.String(20), nullable=False)
    age=db.Column(db.Integer, nullable=False)
    amountDue=db.Column(db.Integer, nullable=False)
    RSVP = db.Column(db.Enum(RSVPEnum), nullable=False)
    created_at=db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __repr__(self):
        return f"<Guest(id={self.id}, notes={self.notes}, gender={self.gender}, RSVP={self.RSVP.value}, created_at={self.created_at})>"

    def __init__(self, notes, firstName, lastName, age, amountDue, RSVP, gender):
        self.notes = notes
        self.firstName = firstName
        self.lastName = lastName
        self.age = age
        self.amountDue = amountDue
        self.gender = gender
        self.RSVP = RSVP

def format_guest(guests):
    return {
        "notes":guests.notes,
        'id': guests.id,
        'created_at': guests.created_at,
        'firstName': guests.firstName,
        'lastName': guests.lastName, 
        'age': guests.age,
        'amountDue': guests.amountDue,
        'gender': guests.gender.value.upper(),
        'RSVP': guests.RSVP.value.upper()
    }


@app.route('/')
def home():
    return 'hello world'


# create a guest 
@app.route('/guests', methods=['POST'])
def create_event():
    data = request.json
    app.logger.info(f"Received payload: {data}")

    # Extracting data from the request
    notes = data['notes']
    firstName = data['firstName']
    lastName = data['lastName']
    age = data['age']
    amountDue = data['amountDue']
    RSVP = data['RSVP']
    gender = data['gender']

    # Creating a new guest instance
    new_guest = Guests(
        notes=notes,
        firstName=firstName,
        lastName=lastName,
        gender=gender,
        age=age,
        amountDue=amountDue,
        RSVP=RSVP
    )

    db.session.add(new_guest)
    db.session.commit()
    guests=Guests.query.order_by(Guests.id.asc()).all()
    guest_list=[]
    for guest in guests:
        guest_list.append(format_guest(guest))
    return {'guests':guest_list}


# get all events, dont need 'GET'; set by default
@app.route('/guests', methods=['GET'])
def get_events():
    guests=Guests.query.order_by(Guests.id.asc()).all()
    guest_list=[]
    for guest in guests:
        guest_list.append(format_guest(guest))
    return {'guests':guest_list}

# get single event
@app.route('/guest/<id>', methods=['GET'])
def get_event(id):
    guest=Guests.query.filter_by(id=id).one()
    formatted_guest=format_guest(guest)
    return {'guest':formatted_guest}

# delete event 
@app.route('/guest/<id>', methods=['DELETE'])
def delete_event(id):
    guest=Guests.query.filter_by(id=id).one()
    db.session.delete(guest)
    db.session.commit()
    guests=Guests.query.order_by(Guests.id.asc()).all()
    guest_list=[]
    for guest in guests:
        guest_list.append(format_guest(guest))
    return {'guests':guest_list}

# update event 
@app.route('/guests/<id>', methods=['PUT'])
def update_event(id):
    data = request.json
    guest_to_update = Guests.query.get(id)

    if guest_to_update:
        guest_to_update.notes = data.get('notes', guest_to_update.notes)
        guest_to_update.firstName = data.get('firstName', guest_to_update.firstName)
        guest_to_update.lastName = data.get('lastName', guest_to_update.lastName)
        guest_to_update.age = data.get('age', guest_to_update.age)
        guest_to_update.amountDue = data.get('amountDue', guest_to_update.amountDue)
        guest_to_update.RSVP = data.get('RSVP', guest_to_update.RSVP)
        guest_to_update.gender = data.get('gender', guest_to_update.gender)
        db.session.commit()
        guests=Guests.query.order_by(Guests.id.asc()).all()
        guest_list=[]
        for guest in guests:
            guest_list.append(format_guest(guest))
        return {'guests':guest_list}

    return {"error": "Guest not found"}, 404


if __name__=='__main__':
    app.run(debug=True)



class Event(db.Model):
    __tablename__ = 'guests'
    id=db.Column(db.Integer, primary_key=True)
    notes=db.Column(db.String(100), nullable=False)
    location=db.Column(db.String(30), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    name=db.Column(db.String(40), nullable=False)


    def __repr__(self):
        return f"<Guest(id={self.id}, notes={self.notes}, gender={self.location}, start_date={self.start_date}, end_date={self.end_date},  name={self.name}   >"

    def __init__(self, notes,location, start_date, end_date, name):
        self.notes = notes
        self.location = location
        self.end_date=end_date
        self.start_date=start_date
        self.name=name

def format_event(event):
    return {
        "notes":event.notes,
        'id': event.id,
        'start_date': event.start_date,
        'end_date': event.end_date,
        'name': event.name, 
    }