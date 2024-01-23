from flask import Blueprint, jsonify
from .arrival import Arrival
from .departure import Departure


routes = Blueprint('routes', __name__)

@routes.route('/api/arrivals', methods=['GET'])
def get_arrivals():
    arrival = Arrival('EPWA')
    arrivals = arrival.getScheduledArrivalsAtAirport()
    print(arrivals)
    return jsonify(arrivals), 200

@routes.route('/api/departures', methods=['GET'])
def get_departures():
    departure = Departure('EPWA')
    departures = departure.getScheduledDeparturesAtAirport()
    print(departures)
    return jsonify(departures), 200