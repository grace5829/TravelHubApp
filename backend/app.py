from flask import Flask, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from enum import Enum

app= Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']='postgresql://gracegao:9455@localhost/TravelHub'
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

def format_event(guests):
    return {
        "notes":guests.notes,
        'id': guests.id,
        'created_at': guests.created_at,
        'firstName': guests.firstName,
        'lastName': guests.lastName, 
        'age': guests.age,
        'amountDue': guests.amountDue,
        'gender': guests.gender.value,
        'RSVP': guests.RSVP.value
    }


@app.route('/')
def home():
    return 'hello world'


# create an event 
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
    return format_event(new_guest)

# get all events, dont need 'GET'; set by default
# @app.route('/events', methods=['GET'])
# def get_events():
#     events=Event.query.order_by(Event.id.asc()).all()
#     event_list=[]
#     for event in events:
#         event_list.append(format_event(event))
#     return {'events':event_list}

# get single event
# @app.route('/event/<id>', methods=['GET'])
# def get_event(id):
#     event=Event.query.filter_by(id=id).one()
#     formatted_event=format_event(event)
#     return {'event':formatted_event}

# delete event 
# @app.route('/event/<id>', methods=['DELETE'])
# def delete_event(id):
#     event=Event.query.filter_by(id=id).one()
#     db.session.delete(event)
#     db.session.commit()
#     return f'Event (id:{id}) deleted'


# update event 
# @app.route('/events/<id>', methods=['PUT'])
# def update_event(id):
#     event=Event.query.filter_by(id=id)
#     description=request.json['description']
#     event.update(dict(description=description, created_at=datetime.utcnow()))
#     db.session.commit()
#     return {'event':format_event(event.one())}



if __name__=='__main__':
    app.run(debug=True)



