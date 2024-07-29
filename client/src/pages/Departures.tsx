
import * as React from "react";
import { Button } from "../components/Button";
import { PlaneTakeoff, Cloudy, Sun, Thermometer, CloudRainWind, Cloud, CloudDrizzle, CloudSnow, CloudFog } from 'lucide-react'

interface Departure {
    airline: string,
    airline_logo: string,
    destination_airport_sky_condition: string,
    destination_airport_temperature: string,
    destination_city: string,
    expected_departure_time: number,
    flight_number: string,
    status: string,
}

interface Cache {
    message: string
}

export function Departures() {
    const [departuresData, setDeparturesData] = React.useState<Departure[]>([])
    const [departuresData1, setDeparturesData1] = React.useState<Departure[]>([])
    const [departuresData2, setDeparturesData2] = React.useState<Departure[]>([])
    const [departuresData3, setDeparturesData3] = React.useState<Departure[]>([])
    const [fetchTimer, setFetchTimer] = React.useState(300)
    const [pageTimer, setPageTimer] = React.useState(20)
    const [initalFetch, setInitialFetch] = React.useState(false)
    const [page, setPage] = React.useState(1)

    const cacheScheduledDepartures = async () => {
        console.log('cacheScheduledDepartures start');
        try {
            const response = await fetch('https://warsaw-chopin-airport-arrival-departure.onrender.com/api/getDepartures', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data: Cache = await response.json();
            console.log(data);
            console.log('cacheScheduledDepartures end');
            return data
        } catch (error) {
            console.error('Error caching departures:', error);
        }
    }

    const getCachedDepartures = async () => {
        console.log('getCachedDepartures start');
        try {
            const response = await fetch(`https://warsaw-chopin-airport-arrival-departure.onrender.com/api/getCachedDepartures`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data: Departure[] = await response.json();
            console.log("read data", data)

            const departuresData1: Departure[] = []
            const departuresData2: Departure[] = []
            const departuresData3: Departure[] = []

            for (let i = 0; i < Object.values(data).length; i++) {
                if (i < 13) {
                    departuresData1.push(data[i])
                } else if (i >= 13 && i < 26) {
                    departuresData2.push(data[i])
                } else if (i >= 26) {
                    departuresData3.push(data[i])
                }
            }
            if (Object.values(departuresData1).length > 0) { setDeparturesData1(departuresData1 as Departure[]) }
            if (Object.values(departuresData2).length > 0) { setDeparturesData2(departuresData2 as Departure[]) }
            if (Object.values(departuresData3).length > 0) { setDeparturesData3(departuresData3 as Departure[]) }

            console.log("datas", departuresData1, departuresData2, departuresData3)
            console.log('getCachedDepartures end');
            return "Finished reading data"

        } catch (error) {
            console.error('Error reading departures:', error);
        }
    };

    const fetchData = async () => {
        await cacheScheduledDepartures()
        await getCachedDepartures()
    }


    React.useEffect(() => {
        const intervalId = setInterval(() => {

            if (initalFetch === false) {
                setInitialFetch(true);
                fetchData();
            }

            setPageTimer(prevTimer => {
                if (prevTimer === 1) {
                    let nextPage = page === 3 ? 1 : page + 1
                    if (nextPage === 1 && departuresData1 && departuresData1.length > 0) {
                        setDeparturesData(departuresData1)
                    } else if (nextPage === 2 && departuresData2 && departuresData2.length > 0) {
                        setDeparturesData(departuresData2)
                    } else if (nextPage === 3 && departuresData3 && departuresData3.length > 0) {
                        setDeparturesData(departuresData3)
                    } else {
                        nextPage = 1
                        setDeparturesData(departuresData1)
                    }
                    setPage(nextPage)
                    return 20
                } else {
                    return prevTimer - 1;
                }
            });

            setFetchTimer(prevValTimer => {
                if (prevValTimer === 1) {
                    fetchData()
                    return 300
                } else {
                    return prevValTimer - 1
                }
            })
        }, 1000);

        return () => clearInterval(intervalId);
    },);

    const formatTime = (timestamp: number): string => {
        const date = new Date(timestamp * 1000); // Convert to milliseconds
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const hourNow = new Date().getHours()

    const minuteNow = new Date().getMinutes()
    return (
        <div className="w-screen h-screen">
            <div className="bg-white font-sans">
                <div className="flex flex-row justify-center items-center -mt-6">
                    <p className="text-zinc-800 font-bold text-6xl items-center justify-center">Page {page}</p>
                    <p className="text-zinc-800 font-bold text-6xl items-start justify-start ml-56">
                        {minuteNow < 10 ? hourNow + ":0" + minuteNow : hourNow + ":" + minuteNow}
                    </p>
                    <div className="flex flex-row px-20">
                        <PlaneTakeoff className="text-zinc-800 h-14 w-14 mr-2" />
                        <h1 className="text-zinc-800 font-bold text-6xl">DEPARTURES</h1>
                    </div>
                    <img src="https://www.airport-suppliers.com/wp-content/uploads/2016/02/warsaw-chopin-airport-CMYK.jpg" alt="Warsaw Chopin Airport" className="h-32 ml-56" />
                </div>
                <div className='inline-flex '>
                    <table className="table-auto text-zinc-800 text-2xl font-bold w-screen">
                        <thead>
                            <tr className="bg-cyan-400">
                                <th className="px-4 py-2">Airline</th>
                                <th className="px-4 py-2">Scheduled</th>
                                <th className="px-4 py-2 w-1/6">Destination</th>
                                <th className="px-4 py-2">Flight</th>
                                <th className="px-4 py-2 w-1/6">Destination weather</th>
                                <th className="px-4 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(departuresData).map((departure: Departure) => (
                                departure === undefined ? null :
                                    <tr key={departure.flight_number}>
                                        <td className="border px-4 py-2"><div className="flex flex-row gap-x-10 justify-center items-center">{departure.airline_logo !== 'Unknown' ? <img className="h-12 w-32" src={departure.airline_logo} alt="" /> : "Unknown"}</div></td>
                                        <td className="border px-4 py-2"><div className="flex flex-row justify-center items-center">{formatTime(departure.expected_departure_time === undefined ? 1 : departure.expected_departure_time)}</div></td>
                                        <td className="border px-4 py-2"><div className="flex flex-row justify-center items-center">{departure.destination_city === undefined ? null : departure.destination_city}</div></td>
                                        <td className="border px-4 py-2"><div className="flex flex-row justify-center items-center">{departure.flight_number === undefined ? null : departure.flight_number}</div></td>
                                        <td className="border px-4 py-2">
                                            <div className="flex flex-row items-center justify-center">
                                                <Thermometer /><span>{departure.destination_airport_temperature === undefined ? null : departure.destination_airport_temperature + "°C"}</span>
                                                <span className="ml-5 mt-1">
                                                    {departure.destination_airport_sky_condition === 'Cloudy' ? <Cloud /> :
                                                        departure.destination_airport_sky_condition === 'Rain' ? <CloudRainWind /> :
                                                            departure.destination_airport_sky_condition === 'Overcast' ? <Cloudy /> :
                                                                departure.destination_airport_sky_condition === 'Clear' ? <Sun /> :
                                                                    departure.destination_airport_sky_condition === 'Drizzle' ? <CloudDrizzle /> :
                                                                        departure.destination_airport_sky_condition === 'Snow' ? <CloudSnow /> :
                                                                            departure.destination_airport_sky_condition === 'Fog' ? <CloudFog /> : null}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="border px-4 py-2">{departure.status}</td>
                                    </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {departuresData.length !== 0 ? <p></p> : <p>Fetching data. It might take up to two minutes.</p>}
            <p>Time until next page: {pageTimer} seconds</p>
            <p>Time until next refresh: {fetchTimer} seconds</p>
        </div>
    )
}