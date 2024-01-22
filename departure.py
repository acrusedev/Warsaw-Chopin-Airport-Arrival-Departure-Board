from FlightRadar24 import FlightRadar24API
import json

class Departure:
    def __init__(self, origin_airport_icao_code:str, entries_limit:int = 10):
        self.fr = FlightRadar24API()
        self.origin_airport_icao_code = origin_airport_icao_code
        self.entries_limit = entries_limit
    
    def getScheduledDeparturesAtAirport(self) -> list:
        warsaw_airport = self.fr.get_airport(code = self.origin_airport_icao_code, details=True)
        
        self.flight_number = warsaw_airport.departures['data'][0]['flight']['identification']['number']['default']
        self.flight_airline = warsaw_airport.departures['data'][0]['flight']['owner']['name']
        self.flight_status = warsaw_airport.departures['data'][0]['flight']['status']['text']
        self.flight_destination_city = warsaw_airport.departures['data'][0]['flight']['airport']['destination']['position']['region']['city']
        self.flight_expected_departure_time = warsaw_airport.departures['data'][0]['flight']['time']['scheduled']['arrival']
        
        print(f"self.flight_number {self.flight_number} self.flight_airline {self.flight_airline} self.flight_status {self.flight_status} self.flight_destination_city {self.flight_destination_city} self.flight_expected_departure_time {self.flight_expected_departure_time}")
        return warsaw_airport.departures['data'][1]['flight']['identification']['number']['default']
    """
    def __getDestinationAirportWeatherDetails(self, destination_airport_icao_code:str) -> dict:
        add weather forecast returing temperature and weather conditions(cloudy, sunny, rainy, etc.)
    """
    
departure = Departure('EPWA', 10)
print(departure.getScheduledDeparturesAtAirport())
    
