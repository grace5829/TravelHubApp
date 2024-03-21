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
# new terminal, cd to correct folder, type python and enter, run "
# from app import db,app
# app.app_context().push()
#  db.create_all()



class Events(db.Model):
    __tablename__ = 'events'
    id=db.Column(db.Integer, primary_key=True)
    notes=db.Column(db.String(100), nullable=False)
    location=db.Column(db.String(30), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    name=db.Column(db.String(40), nullable=False)


    def __repr__(self):
        return f"<Event(id={self.id}, notes={self.notes}, location={self.location}, start_date={self.start_date}, end_date={self.end_date},  name={self.name}   >"

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
        'location':event.location,
        'end_date': event.end_date,
        'name': event.name, 
    }
# get all events
@app.route('/events', methods=['GET'])
def get_events():
    events=Events.query.order_by(Events.id.asc()).all()
    events_list=[]
    for event in events:
        events_list.append(format_event(event))
    return {'events':events_list}
    
    # Creating a new event 
@app.route('/events', methods=['POST'])
def create_event():
    data = request.json
    app.logger.info(f"Received payload: {data}")

    # Extracting data from the request
    notes = data['notes']
    name = data['name']
    location=data['location']
    start_date=data['start_date']
    end_date=data['end_date']

    new_event = Events(
        notes=notes,
        name=name,
        location=location,
        start_date=start_date,
        end_date=end_date
    )
    db.session.add(new_event)
    db.session.commit()

    return format_event(new_event)

# get single event
@app.route('/event/<id>', methods=['GET'])
def get_event(id):
    event=Events.query.filter_by(id=id).one()
    return format_event(event)

# delete event 
@app.route('/event/<id>', methods=['DELETE'])
def delete_event(id):
    event=Events.query.filter_by(id=id).one()
    db.session.delete(event)
    db.session.commit()
    events=Events.query.order_by(Events.id.asc()).all()
    event_list=[]
    for event in events:
        event_list.append(format_guest(gueeventst))
    return {'events':event_list}

# update event 
@app.route('/events/<id>', methods=['PUT'])
def update_event(id):
    data = request.json
    event_to_update = Events.query.get(id)

    if event_to_update:
        event_to_update.notes = data.get('notes', event_to_update.notes)
        event_to_update.name = data.get('name', event_to_update.name)
        event_to_update.location = data.get('location', event_to_update.location)
        event_to_update.start_date = data.get('start_date', event_to_update.start_date)
        event_to_update.end_date = data.get('end_date', event_to_update.end_date)

        db.session.commit()

        return format_event(event_to_update)

    return {"error": "Event not found"}, 404


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
    amountPaid=db.Column(db.Integer, nullable=False)
    RSVP = db.Column(db.Enum(RSVPEnum), nullable=False)
    created_at=db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'))
    event = db.relationship('Events', backref='guests')

    def __repr__(self):
        return f"<Guest(id={self.id}, notes={self.notes}, gender={self.gender}, RSVP={self.RSVP.value}, created_at={self.created_at}, event_id={self.event_id}, event={self.event})>"

    def __init__(self, notes, firstName, lastName, age, amountPaid, RSVP, gender, event_id):
        self.notes = notes
        self.firstName = firstName
        self.lastName = lastName
        self.age = age
        self.amountPaid = amountPaid
        self.gender = gender
        self.RSVP = RSVP
        self.event_id=event_id

def format_guest(guests):
    return {
        "notes":guests.notes,
        'id': guests.id,
        'created_at': guests.created_at,
        'firstName': guests.firstName,
        'lastName': guests.lastName, 
        'age': guests.age,
        'amountPaid': guests.amountPaid,
        'gender': guests.gender.value.upper(),
        'RSVP': guests.RSVP.value.upper(),
        'event_id':guests.event_id
    }



# create a guest 
@app.route('/guests', methods=['POST'])
def create_guest():
    data = request.json
    app.logger.info(f"Received payload: {data}")
    # Extracting data from the request
    notes = data['notes']
    firstName = data['firstName']
    lastName = data['lastName']
    age = data['age']
    amountPaid = data['amountPaid']
    RSVP = data['RSVP']
    gender = data['gender']
    event_id=data['event_id']
    # Creating a new guest instance
    new_guest = Guests(
        notes=notes,
        firstName=firstName,
        lastName=lastName,
        gender=gender,
        age=age,
        amountPaid=amountPaid,
        RSVP=RSVP,
        event_id=event_id
    )

    db.session.add(new_guest)
    db.session.commit()
    return format_guest(new_guest)

# get all guests, dont need 'GET'; set by default
@app.route('/guests', methods=['GET'])
def get_guests():
    guests=Guests.query.order_by(Guests.id.asc()).all()
    guest_list=[]
    for guest in guests:
        guest_list.append(format_guest(guest))
    return {'guests':guest_list}

# get single guest
@app.route('/guest/<id>', methods=['GET'])
def get_guest(id):
    guest=Guests.query.filter_by(id=id).one()
    return format_guest(guest)

# delete guest 
@app.route('/guest/<id>', methods=['DELETE'])
def delete_guest(id):
    guest=Guests.query.filter_by(id=id).one()
    db.session.delete(guest)
    db.session.commit()
    guests=Guests.query.order_by(Guests.id.asc()).all()
    guest_list=[]
    for guest in guests:
        guest_list.append(format_guest(guest))
    return {'guests':guest_list}

# update guest 
@app.route('/guests/<id>', methods=['PUT'])
def update_guest(id):
    data = request.json
    guest_to_update = Guests.query.get(id)

    if guest_to_update:
        guest_to_update.notes = data.get('notes', guest_to_update.notes)
        guest_to_update.firstName = data.get('firstName', guest_to_update.firstName)
        guest_to_update.lastName = data.get('lastName', guest_to_update.lastName)
        guest_to_update.age = data.get('age', guest_to_update.age)
        guest_to_update.amountPaid = data.get('amountPaid', guest_to_update.amountPaid)
        guest_to_update.RSVP = data.get('RSVP', guest_to_update.RSVP)
        guest_to_update.gender = data.get('gender', guest_to_update.gender)
        guest_to_update.event_id = data.get('event', guest_to_update.event_id)
        db.session.commit()

        return format_guest(guest_to_update)

    return {"error": "Guest not found"}, 404


if __name__=='__main__':
    app.run(debug=True)
