from FlightRadar24 import FlightRadar24API
import json
import os
from flask import jsonify


class Arrival:
    def __init__(self, origin_airport_icao_code:str, entries_limit:int = 10):
        self.fr = FlightRadar24API()
        self.origin_airport_icao_code = origin_airport_icao_code
        self.entries_limit = entries_limit
    
    def getScheduledArrivalsAtAirport(self) -> list:
        warsaw_airport = self.fr.get_airport(code=self.origin_airport_icao_code, details=True)
        arrival_object = []
        
        for i in range(self.entries_limit):
            single_arrival_object = warsaw_airport.arrivals['data'][i]['flight']

            # Check if all required fields are present
            
            arrival_object_list = {
                'flight_number': single_arrival_object['identification']['number']['default'],
                'airline': single_arrival_object['owner']['name'] if single_arrival_object['airline'] is not None else 'Unknown',
                'airline_logo': single_arrival_object['owner']['logo'] if single_arrival_object['owner'] is not None else 'Unknown',
                'origin_city': single_arrival_object['airport']['origin']['position']['region']['city'] if single_arrival_object['airport']['origin'] is not None else 'Unknown',
                'status': single_arrival_object['status']['text'],
                'expected_departure_time': single_arrival_object['time']['scheduled']['arrival']
            }
            arrival_object.append(arrival_object_list)
            
        return arrival_object  # Un-indent this line
 
    


    
