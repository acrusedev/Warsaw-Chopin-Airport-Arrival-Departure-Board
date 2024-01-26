from FlightRadar24 import FlightRadar24API
import json

import time
class Arrival:
    def __init__(self, origin_airport_icao_code:str):
        self.fr = FlightRadar24API()
        self.origin_airport_icao_code = origin_airport_icao_code
        self.warsaw_airport = self.fr.get_airport(code=self.origin_airport_icao_code, details=True)
        self.airport_arrivals_cache = {}
    
    def getScheduledArrivalsAtAirport(self, required_valid_entries:int) -> list:
        start_time = time.time()
        i = 0
        valid_entries = 0   
        while valid_entries < required_valid_entries:
            try:
                single_arrival_object = self.warsaw_airport.arrivals['data'][i]['flight']
                arrival_object_list = {
                    'flight_number': single_arrival_object['identification']['number']['default'],
                    'airline': single_arrival_object['owner']['name'],
                    'airline_logo': single_arrival_object['owner']['logo'],
                    'origin_city': single_arrival_object['airport']['origin']['position']['region']['city'],
                    'status': single_arrival_object['status']['text'],
                    'expected_arrival_time': single_arrival_object['time']['scheduled']['arrival']
                }
                if self.validateData(arrival_object_list):
                    self.airport_arrivals_cache[i] = arrival_object_list
                    valid_entries += 1
                    print(f'Added {i}th arrival to cache.')
                if i != 0 and i % 1 == 0:
                    time.sleep(2)
            except Exception as e:
                print(f'Error: {e} fetching data for {i} entry in cache in {time.time() - start_time} seconds')
            i += 1
        return f'Arrivals cached in {time.time() - start_time} seconds'

    def validateData(self, data:dict):
        keys = ['flight_number', 'airline', 'origin_city', 'expected_arrival_time']
        for key in keys:
            if data[key] == None or data[key] == 'null' or data[key] == 'Unknown':
                return False
        return True
    
    def getCachedArrivalsData(self, limit:int):
        cached_arrivals = {}
        if limit > len(self.airport_arrivals_cache):
            lower = len(self.airport_arrivals_cache)
        else:
            lower = limit
            
        for i in range(lower) : 
            if i in self.airport_arrivals_cache:
                cached_arrivals[i] = self.airport_arrivals_cache[i]
        return cached_arrivals
                
        


    
