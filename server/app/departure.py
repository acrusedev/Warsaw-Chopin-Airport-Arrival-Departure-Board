from FlightRadar24 import FlightRadar24API
import time
import json
class Departure:
    def __init__(self, origin_airport_icao_code:str):
        self.fr = FlightRadar24API()
        self.origin_airport_icao_code = origin_airport_icao_code
        self.warsaw_airport = self.fr.get_airport(code = self.origin_airport_icao_code, details=True)
        self.airport_departures_cache = {}
    
    def cacheScheduledDeparturesAtAirport(self, required_valid_entries:int):
        start_time = time.time()
        i = 0
        valid_entries = 0
        while valid_entries < required_valid_entries:
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
                if self.validateData(departure_object_list):
                    self.airport_departures_cache[valid_entries] = departure_object_list
                    valid_entries += 1
                    print(f'Added {valid_entries}th departure to cache.')
                if i != 0 and i % 1 == 0:
                    time.sleep(2)
            except Exception as e:
                print(f'Error: {e} fetching data for {i} entry in cache in {time.time() - start_time} seconds')
            
            i += 1 
        return f'Departures cached in {time.time() - start_time} seconds'
        
    def validateData(self, data: dict) -> bool:
        keys = ['flight_number', 'airline', 'destination_city', 'expected_departure_time']
        for key in keys:
            if data[key] == None or data[key] == 'null' or data[key] == 'Unknown':
                return False   
        return True    
    
    def getCachedDeparturesData(self, limit: int):
        cached_departures = {}
        if limit > len(self.airport_departures_cache):
            lower = len(self.airport_departures_cache)
        else:
            lower = limit
            
        for i in range(lower) : 
            if i in self.airport_departures_cache:
                cached_departures[i] = self.airport_departures_cache[i]
        return cached_departures
class Weather:
    def __init__(self, fr: FlightRadar24API, airport_details):
        self.airport_details = airport_details
    def airTemperature(self ) -> str:
            return self.airport_details['airport']["pluginData"]['weather']['temp']['celsius'] if self.airport_details['airport']["pluginData"]['weather'] is not None else 'Unknown'
    def skyCondition(self) -> str:
        return self.airport_details['airport']["pluginData"]['weather']['sky']['condition']['text'] if self.airport_details['airport']["pluginData"]['weather'] is not None else 'Unknown'


