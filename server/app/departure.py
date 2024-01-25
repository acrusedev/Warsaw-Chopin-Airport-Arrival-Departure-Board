from FlightRadar24 import FlightRadar24API
import time
class Departure:
    def __init__(self, origin_airport_icao_code:str):
        self.fr = FlightRadar24API()
        self.origin_airport_icao_code = origin_airport_icao_code
        self.warsaw_airport = self.fr.get_airport(code = self.origin_airport_icao_code, details=True)
        self.airport_details_cache = {}
    
    def cacheScheduledDeparturesAtAirport(self, lower_range_entries:int, upper_range_entries:int):
        for i in range(lower_range_entries, upper_range_entries):
            try:
                single_departure_object = self.warsaw_airport.departures['data'][i]['flight']
                destination_airport_icao_code = single_departure_object['airport']['destination']['code']['icao']
            
                airport_details = self.fr.get_airport_details(code = destination_airport_icao_code)
                weather = Weather(fr = self.fr, airport_details = airport_details)
                departure_object_list = {
                    'flight_number': single_departure_object['identification']['number']['default'],
                    'airline': single_departure_object['owner']['name'],
                    'airline_logo': single_departure_object['owner']['logo'],
                    'status': single_departure_object['status']['text'],
                    'destination_city': single_departure_object['airport']['destination']['position']['region']['city'],
                    'expected_departure_time': single_departure_object['time']['scheduled']['departure'],
                    'destination_airport_temperature': weather.airTemperature(),
                    'destination_airport_sky_condition': weather.skyCondition(),
                }
                self.airport_details_cache[i] = departure_object_list
            except Exception:
                upper_range_entries += 1
                continue
            
        
    def getAirportDetailsCache(self, entities_number: int):
        new_airport_details_cache = {}
        for i in range(entities_number):
            new_airport_details_cache[i] = self.airport_details_cache[i]
        return new_airport_details_cache
    
class Weather:
    def __init__(self, fr: FlightRadar24API, airport_details):
        self.airport_details = airport_details
    def airTemperature(self ) -> str:
            return self.airport_details['airport']["pluginData"]['weather']['temp']['celsius'] if self.airport_details['airport']["pluginData"]['weather'] is not None else 'Unknown'
    def skyCondition(self) -> str:
        return self.airport_details['airport']["pluginData"]['weather']['sky']['condition']['text'] if self.airport_details['airport']["pluginData"]['weather'] is not None else 'Unknown'


start_time = time.time()
departure = Departure('EPWA')
departure.cacheScheduledDeparturesAtAirport(0, 40)
print(departure.getAirportDetailsCache(40))
print("--- %s seconds ---" % (time.time() - start_time))