from flask import Blueprint, jsonify
from .arrival import Arrival
from .departure import Departure


routes = Blueprint('routes', __name__)

@routes.route('/api/arrivals', methods=['GET'])
def get_arrivals():
    arrival = Arrival('EPWA')
    arrival.getScheduledArrivalsAtAirport()
    arrival.returnArrivalJson()
    return jsonify({'message': 'Arrivals data successfully generated'}), 200

@routes.route('/api/departures', methods=['GET'])
def get_departures():
    departure = Departure('EPWA')
    departure.getScheduledDeparturesAtAirport()
    departure.returnDepartureJson()
    return jsonify({'message': 'Departures data successfully generated'}), 200