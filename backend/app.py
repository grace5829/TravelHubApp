from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from enum import Enum
import os
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()

db_password = os.getenv("DATABASE_PASSWORD")
DATABASE_URL = os.getenv("POSTGRESL_URL")


app= Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']='postgresql://gracegao:{db_password}@localhost/TravelHub'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db=SQLAlchemy(app)
CORS(app)



engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.route('/test-db')
def test_db():
    db = next(get_db())
    result = db.execute('SELECT NOW()').fetchone()
    return jsonify({'time': result[0]})

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
        event_list.append(format_event(event))
    return {'events':event_list}


#get next event
@app.route('/next-event', methods=['GET'])
def get_next_event():
    # Get today's date
    today = datetime.now().date()

    # Query the database to find the next event after today's date
    next_event = Events.query.filter(Events.start_date >= today).order_by(Events.start_date.asc()).first()

    if next_event:
        # Format the event data
        formatted_event = format_event(next_event)
        return {'next_event': formatted_event}
    else:
        return {'message': 'No upcoming events found'}

#get recent previous event 
@app.route('/previous-event', methods=['GET'])
def get_previous_event():
    # Get today's date
    today = datetime.now().date()

    # Query the database to find the most recent previous event
    previous_event = Events.query.filter(Events.start_date < today).order_by(Events.start_date.desc()).first()

    if previous_event:
        # Format the event data
        formatted_event = format_event(previous_event)
        return {'previous_event': formatted_event}
    else:
        return {'message': 'No previous events found'}

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
    amountDue=db.Column(db.Integer, nullable=False)
    RSVP = db.Column(db.Enum(RSVPEnum), nullable=False)
    created_at=db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'))
    event = db.relationship('Events', backref='guests')
    event_name= db.Column(db.String(20), nullable=False)
    def __repr__(self):
        return f"<Guest(id={self.id}, notes={self.notes}, gender={self.gender}, RSVP={self.RSVP.value}, created_at={self.created_at}, event_id={self.event_id}, event={self.event}, event_name={self.event_name})>"

    def __init__(self, notes, firstName, lastName, age, amountDue, RSVP, gender, event_id, event_name):
        self.notes = notes
        self.firstName = firstName
        self.lastName = lastName
        self.age = age
        self.amountDue = amountDue
        self.gender = gender
        self.RSVP = RSVP
        self.event_id=event_id
        self.event_name=event_name

def format_guest(guests):
    formatted_guest = {
        "notes": guests.notes,
        'id': guests.id,
        'created_at': guests.created_at,
        'firstName': guests.firstName,
        'lastName': guests.lastName, 
        'age': guests.age,
        'amountDue': guests.amountDue,
        'gender': guests.gender.value.upper(),
        'RSVP': guests.RSVP.value.upper(),
        'event_id': guests.event_id,
        'event_name':guests.event_name
    }
    
    return formatted_guest



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
    amountDue = data['amountDue']
    RSVP = data['RSVP']
    gender = data['gender']
    event_id=data['event_id']
    event_name=data['event_name']

    # Creating a new guest instance
    new_guest = Guests(
        notes=notes,
        firstName=firstName,
        lastName=lastName,
        gender=gender,
        age=age,
        amountDue=amountDue,
        RSVP=RSVP,
        event_id=event_id,
        event_name=event_name
    )

    db.session.add(new_guest)
    db.session.commit()
    return format_guest(new_guest)

# get all guests, dont need 'GET'; set by default
@app.route('/guests', methods=['GET'])
def get_guests():
    guests_with_events = db.session.query(Guests, Events.name)\
    .join(Events, Guests.event_id == Events.id)\
    .order_by(Guests.id)\
    .all()
    guest_list=[]
    for guest in guests_with_events:
        guest_list.append(format_guest(guest))
    return {'guests':guest_list}

# # get single guest
# @app.route('/guest/<id>', methods=['GET'])
# def get_guest(id):
#     guest=Guests.query.filter_by(id=id).one()
#     return format_guest(guest)

# get guests for single event
@app.route('/guests/<event_id>', methods=['GET'])
def get_eventGuests(event_id):
    guest_withID=Guests.query.filter_by(event_id=event_id).all()
    guest_list=[]

    for guest in guest_withID:
        guest_list.append(format_guest(guest))
    return {'guests':guest_list}

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
        guest_to_update.amountDue = data.get('amountDue', guest_to_update.amountDue)
        guest_to_update.RSVP = data.get('RSVP', guest_to_update.RSVP)
        guest_to_update.gender = data.get('gender', guest_to_update.gender)
        guest_to_update.event_id = data.get('event', guest_to_update.event_id)
        guest_to_update.event_name = data.get('event', guest_to_update.event_name)
        db.session.commit()

        return format_guest(guest_to_update)

    return {"error": "Guest not found"}, 404

class Expenses(db.Model):
    __tablename__ = 'expenses'
    id=db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String(25), nullable=False)
    description=db.Column(db.String(150), nullable=False)
    total=db.Column(db.Integer, nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'))
    event = db.relationship('Events', backref='expenses')

    def __repr__(self):
        return f"<Guest(id={self.id}, name={self.name}, description={self.description},total={self.total}, event_id={self.event_id}, event={self.event} )>"

    def __init__(self, name, description, total, event_id):
        self.name = name
        self.description = description
        self.total = total
        self.event_id = event_id

def format_expense(expense):
    formatted_expense = {
        "name": expense.name,
        'description': expense.description,
        'total': expense.total,
        'event_id': expense.event_id,
        'id':expense.id
    }
    return formatted_expense

# get all expenses
@app.route('/expenses', methods=['GET'])
def get_expenses():
    expenses=Expenses.query.order_by(Expenses.id.asc()).all()
    expenses_list=[]
    for expense in expenses:
        expenses_list.append(format_expense(expense))
    return {'expenses':expenses_list}

# Creating a new expense 
@app.route('/expenses', methods=['POST'])
def create_expense():
    data = request.json
    app.logger.info(f"Received payload: {data}")

    # Extracting data from the request
    name = data['name']
    description=data['description']
    total=data['total']
    event_id=data['event_id']

    new_expense = Expenses(
        name=name,
        description=description,
        total=total,
        event_id=event_id
    )
    db.session.add(new_expense)
    db.session.commit()

    return format_expense(new_expense)

# get expenses for single event
@app.route('/expenses/<event_id>', methods=['GET'])
def get_eventExpenses(event_id):
    expenses_withID=Expenses.query.filter_by(event_id=event_id).all()
    expense_list=[]

    for expense in expenses_withID:
        expense_list.append(format_expense(expense))
    return{'expenses':expense_list}


# delete expense
@app.route('/expense/<id>', methods=['DELETE'])
def delete_expense(id):
    expense=Expenses.query.filter_by(id=id).one()
    db.session.delete(expense)
    db.session.commit()
    expenses=Expenses.query.order_by(Expenses.id.asc()).all()
    expense_list=[]
    for expense in expenses:
        expense_list.append(format_expense(expense))
    return {'expenses':expense_list}

# update expense 
@app.route('/expenses/<id>', methods=['PUT'])
def update_expense(id):
    data = request.json
    expense_to_update = Expenses.query.get(id)

    if expense_to_update:
        expense_to_update.description = data.get('description', expense_to_update.description)
        expense_to_update.name = data.get('name', expense_to_update.name)
        expense_to_update.total = data.get('total', expense_to_update.total)


        db.session.commit()

        return format_expense(expense_to_update)

    return {"error": "Expense not found"}, 404

if __name__=='__main__':
    app.run(debug=True)
