from FlightRadar24 import FlightRadar24API
import json

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
            departure_object_list = {
                'flight_number': single_departure_object['identification']['number']['default'],
                'airline': single_departure_object['owner']['name'],
                'status': single_departure_object['status']['text'],
                'destination_city': single_departure_object['airport']['destination']['position']['region']['city'],
                'expected_departure_time': single_departure_object['time']['scheduled']['arrival']
            }
            departure_objects.append(departure_object_list)   
            
        return departure_objects
    
    def returnDepartureJson(self):
        with open('./local_files/warsaw_airport_departures.json', 'w') as outfile:
            json.dump(self.getScheduledDeparturesAtAirport(), outfile, indent=2)
    
    """
    def __getDestinationAirportWeatherDetails(self, destination_airport_icao_code:str) -> dict:
        add weather forecast returing temperature and weather conditions(cloudy, sunny, rainy, etc.)
    """
    
    
        
    
departure = Departure('EPWA', 10)
departure.getScheduledDeparturesAtAirport()
departure.returnDepartureJson()
    
