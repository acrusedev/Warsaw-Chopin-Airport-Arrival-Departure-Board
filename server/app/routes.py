from flask import Blueprint, jsonify
from .arrival import Arrival
from .departure import Departure


routes = Blueprint('routes', __name__)

departure = None


@routes.route('/api/getDepartures', methods=['GET'])
def getDepartures():
    global departure
    departure = Departure('EPWA')
    departures = departure.cacheScheduledDeparturesAtAirport(40)
    return jsonify(departures), 200

@routes.route('/api/getCachedDepartures', methods=['GET'])
def getCachedDepartures():
    global departure
    departures = departure.getCachedDeparturesData(40)
    return jsonify(departures), 200
