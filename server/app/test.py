from FlightRadar24 import FlightRadar24API
import json

fr = FlightRadar24API()

warsaw_airport = fr.get_airport(code='EPWA', details=True).departures['data']

test= {}

for i in range(40):
    test[i] = warsaw_airport[i]

with open ('warsaw_airport.json', 'w') as f:
    f.write(json.dumps(test, indent=4))