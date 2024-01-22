from FlightRadar24 import FlightRadar24API
import json
import os



class Arrival:
    def __init__(self, origin_airport_icao_code:str, entries_limit:int = 10):
        self.fr = FlightRadar24API()
        self.origin_airport_icao_code = origin_airport_icao_code
        self.entries_limit = entries_limit
    
    def getScheduledArrivalsAtAirport(self) -> list:
        warsaw_airport = self.fr.get_airport(code = self.origin_airport_icao_code, details=True)
        arrival_object = []
        for i in range(self.entries_limit):
            single_arrival_object = warsaw_airport.arrivals['data'][i]['flight']
            arrival_object_list = {
                'flight_number': single_arrival_object['identification']['number']['default'],
                'airline': single_arrival_object['owner']['name'],
                'origin_city': single_arrival_object['airport']['origin']['position']['region']['city'],
                'status': single_arrival_object['status']['text'],
                'expected_departure_time': single_arrival_object['time']['scheduled']['arrival']
            }
            arrival_object.append(arrival_object_list)   
            
        return arrival_object
    
    def returnArrivalJson(self):
        if not os.path.exists('./local_files'):
            os.makedirs('./local_files')
        with open('./local_files/warsaw_airport_arrivals.json', 'w') as outfile:
            json.dump(self.getScheduledArrivalsAtAirport(), outfile, indent=2)
    
    """
    def __getDestinationAirportWeatherDetails(self, destination_airport_icao_code:str) -> dict:
        add weather forecast returing temperature and weather conditions(cloudy, sunny, rainy, etc.)
    """
    
    


    
