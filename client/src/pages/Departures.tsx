
import * as React from "react";
import { Button } from "../components/Button";
import { PlaneTakeoff, Cloudy, Sun, Thermometer, CloudRainWind, Cloud } from 'lucide-react'
import Letter from './Letter';

export function Departures() {
    const [departuresData, setdeparturesData] = React.useState([])
    const [timer, setTimer] = React.useState(300)
    const [initalFetch, setInitialFetch] = React.useState(false)

    const fetchArrivals = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/departures', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setdeparturesData(data);
        } catch (error) {
            console.error('Error fetching arrivals:', error);
        }
    };

    React.useEffect(() => {
        if (!initalFetch) {
            fetchArrivals();
            setInitialFetch(true);

        }

        const intervalId = setInterval(() => {
            setTimer(prevTimer => prevTimer - 1);
        }, 1000);


        if (timer === 0) {
            setTimer(300);
            fetchArrivals();
        }

        return () => clearInterval(intervalId);
    }, [timer, initalFetch]);

    const formatTime = (timestamp: number): string => {
        const date = new Date(timestamp * 1000); // Convert to milliseconds
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const hourNow = new Date().getHours()
    const minuteNow = new Date().getMinutes()

    return (
        <div className="bg-white w-screen h-screen font-sans">
            <div className="flex flex-row justify-center items-center -mt-6">
                <p className="text-zinc-800 font-bold text-6xl px-20 items-start justify-start">
                    {minuteNow < 10 ? hourNow + ":0" + minuteNow : hourNow + ":" + minuteNow}
                </p>
                <div className="flex flex-row px-20">
                    <PlaneTakeoff className="text-zinc-800 h-14 w-14 mr-2" />
                    <h1 className="text-zinc-800 font-bold text-6xl">DEPARTURES</h1>
                </div>
                <img src="https://www.airport-suppliers.com/wp-content/uploads/2016/02/warsaw-chopin-airport-CMYK.jpg" alt="Warsaw Chopin Airport" className="h-32 px-20" />
            </div>
            <div className='inline-flex'>
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
                        {departuresData.map((departure: any) => (
                            <tr key={departure.flight}>
                                <td className="border px-4 py-4"><div className="flex flex-row gap-x-10 justify-center items-center">{departure.airline_logo ? <img className="" src={departure.airline_logo} alt="" /> : departure.airline}</div></td>
                                <td className="border px-4 py-2"><div className="flex flex-row justify-center items-center">{formatTime(departure.expected_departure_time)}</div></td>
                                <td className="border px-4 py-2"><div className="flex flex-row justify-center items-center">{departure.destination_city}</div></td>
                                <td className="border px-4 py-2"><div className="flex flex-row justify-center items-center">{departure.flight_number}</div></td>
                                <td className="border px-4 py-2">
                                    <div className="flex flex-row items-center justify-center">
                                        <Thermometer /><span>{departure.destination_airport_temperature + "°C"}</span>
                                        <span className="ml-5 mt-1">
                                        {departure.destination_airport_sky_condition === 'Cloudy' ? <Cloud/> : 
                                        departure.destination_airport_sky_condition === 'Rain' ? <CloudRainWind/> : 
                                        departure.destination_airport_sky_condition === 'Overcast' ? <Cloudy/> :
                                        departure.destination_airport_sky_condition === 'Clear' ? <Sun/> : null
                                        }</span>
                                    </div>
                                </td>
                                <td className="border px-4 py-2">{departure.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p>Time until next fetch: {timer} seconds</p>
            <Button onClick={fetchArrivals}>Click me</Button>
        </div>
    )
}