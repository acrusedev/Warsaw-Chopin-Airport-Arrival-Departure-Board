
import * as React from "react";
import { Button } from "../components/Button";
import { PlaneTakeoff } from 'lucide-react'
import Letter  from './Letter';

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

    return (
        <div className="bg-white w-screen h-screen font-sans">
            <div className="flex flex-row">
                <PlaneTakeoff className="text-zinc-800 h-8 w-8 mt-1 mr-2"/>
                <h1 className="text-zinc-800 font-bold text-4xl">Departures</h1>
            </div>
            <div className='inline-flex'>
                <table className="table-auto text-zinc-800 text-2xl w-screen">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Airline</th>
                            <th className="px-4 py-2">Flying to</th>
                            <th className="px-4 py-2">Flight number</th>
                            <th className="px-4 py-2">Estimated</th>
                            <th className="px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departuresData.map((departure: any) => (
                            <tr key={departure.flight}>
                                <td className="border px-4 py-4"><div className="flex flex-row gap-x-10 justify-center items-center">{departure.airline_logo ? <img className="" src={departure.airline_logo} alt=""/> :departure.airline}</div></td>
                                <td className="border px-4 py-2">{departure.destination_city}</td>
                                <td className="border px-4 py-2">{departure.flight_number}</td>
                                <td className="border px-4 py-2">{formatTime(departure.expected_departure_time)}</td>
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