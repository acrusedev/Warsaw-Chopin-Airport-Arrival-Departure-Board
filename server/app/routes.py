from flask import Blueprint, jsonify
from .arrival import Arrival
from .departure import Departure


routes = Blueprint('routes', __name__)

departure = None
arrival = None

@routes.route('/api/getArrivals', methods=['GET'])
def getArrivals():
    global arrival
    arrival = Arrival('EPWA')
    arrivals = arrival.getScheduledArrivalsAtAirport(39)
    return jsonify(arrivals), 200

@routes.route('/api/getCachedArrivals', methods=['GET'])
def getCachedArrivals():
    global arrival
    arrivals = arrival.getCachedArrivalsData(39)
    return jsonify(arrivals), 200

@routes.route('/api/getDepartures', methods=['GET'])
def getDepartures():
    global departure
    departure = Departure('EPWA')
    departures = departure.cacheScheduledDeparturesAtAirport(39)
    return jsonify(departures), 200

@routes.route('/api/getCachedDepartures', methods=['GET'])
def getCachedDepartures():
    global departure
    departures = departure.getCachedDeparturesData(39)
    return jsonify(departures), 200
