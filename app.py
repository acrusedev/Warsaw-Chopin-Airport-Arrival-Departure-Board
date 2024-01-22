from FlightRadar24 import FlightRadar24API
import json

WARSAW_AIRPORT_ICAO_CODE = 'EPWA'

fr = FlightRadar24API()

warsaw_airport = fr.get_airport(code = WARSAW_AIRPORT_ICAO_CODE, details=True)

data_to_write = [warsaw_airport.departures['data'][i] for i in range(4)]

# Write the data to the file
with open('warsaw_airport.json', 'w') as outfile:
    json.dump(data_to_write, outfile)

