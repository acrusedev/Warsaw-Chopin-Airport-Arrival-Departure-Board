from flask import Blueprint, jsonify
from .arrival import Arrival
from .departure import Departure

routes = Blueprint('routes', __name__)

arrival = Arrival('EPWA')
departure = Departure('EPWA')

@routes.route('/api/getArrivals', methods=['GET'])
def getArrivals():
    arrivals = arrival.getScheduledArrivalsAtAirport(39)
    return jsonify({"message": arrivals}), 200

@routes.route('/api/getCachedArrivals', methods=['GET'])
def getCachedArrivals():
    arrivals = arrival.getCachedArrivalsData(39)
    return jsonify(arrivals), 200

@routes.route('/api/getDepartures', methods=['GET'])
def getDepartures():
    departures = departure.cacheScheduledDeparturesAtAirport(39)
    return jsonify({"message": departures}), 200

@routes.route('/api/getCachedDepartures', methods=['GET'])
def getCachedDepartures():
    departures = departure.getCachedDeparturesData(39)
    return jsonify(departures), 200
