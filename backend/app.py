from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS


app= Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']='postgresql://gracegao:9455@localhost/TravelHub'
CORS(app)

db=SQLAlchemy(app)
class Event(db.Model):
    id=


@app.route('/')
def home():
    return 'hello world'

@app.route('/members')
def members():
    return {'members':['members1','members2', 'members3']}


if __name__=='__main__':
    app.run(debug=True)



