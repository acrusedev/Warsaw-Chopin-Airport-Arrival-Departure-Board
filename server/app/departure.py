from FlightRadar24 import FlightRadar24API
import json, os

class Departure:
    def __init__(self, origin_airport_icao_code:str, entries_limit:int = 10):
        self.fr = FlightRadar24API()
        self.origin_airport_icao_code = origin_airport_icao_code
        self.entries_limit = entries_limit
    
    def getScheduledDeparturesAtAirport(self) -> list:
        warsaw_airport = self.fr.get_airport(code = self.origin_airport_icao_code, details=True)
        departure_objects = []
        for i in range(self.entries_limit):
            single_departure_object = warsaw_airport.departures['data'][i]['flight']
            destination_airport_icao_code = single_departure_object['airport']['destination']['code']['icao']
            weather = Weather(fr = self.fr, destination_airport_icao_code = destination_airport_icao_code)
            departure_object_list = {
                'flight_number': single_departure_object['identification']['number']['default'],
                'airline': single_departure_object['owner']['name'] if single_departure_object['airline'] is not None else 'Unknown',
                'airline_logo': single_departure_object['owner']['logo'] if single_departure_object['airline'] is not None else 'Unknown',
                'status': single_departure_object['status']['text'] if single_departure_object['status'] is not None else 'Unknown',
                'destination_city': single_departure_object['airport']['destination']['position']['region']['city'] if single_departure_object['airport'] is not None else 'Unknown',
                'expected_departure_time': single_departure_object['time']['scheduled']['departure'],
                'destination_airport_temperature': weather.airTemperature(),
                'destination_airport_sky_condition': weather.skyCondition(),
            }
            
            departure_objects.append(departure_object_list)
            
        return departure_objects
    
class Weather:
    def __init__(self, fr: FlightRadar24API, destination_airport_icao_code:str):
        self.destination_airport_icao_code = destination_airport_icao_code
        self.warsaw_airport_details = fr.get_airport_details(code = self.destination_airport_icao_code)

    def airTemperature(self) -> str:
        return self.warsaw_airport_details['airport']["pluginData"]['weather']['temp']['celsius']

    def skyCondition(self) -> str:
        return self.warsaw_airport_details['airport']["pluginData"]['weather']['sky']['condition']['text']

departure = Departure(origin_airport_icao_code = 'EPWA', entries_limit = 1)
departure.getScheduledDeparturesAtAirport()
