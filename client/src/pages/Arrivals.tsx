
import * as React from "react";
import { Button } from "../components/Button";
import { PlaneLanding } from 'lucide-react'

export function Arrivals() {
    const [arrivalsData, setArrivalsData] = React.useState([])
    const [timer, setTimer] = React.useState(300)
    const [initalFetch, setInitialFetch] = React.useState(false)

    const fetchArrivals = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/arrivals', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setArrivalsData(data);
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
        const date = new Date(timestamp * 1000);
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
                    <PlaneLanding className="text-zinc-800 h-14 w-14 mr-2" />
                    <h1 className="text-zinc-800 font-bold text-6xl">ARRIVALS</h1>
                </div>
                <img src="https://www.airport-suppliers.com/wp-content/uploads/2016/02/warsaw-chopin-airport-CMYK.jpg" alt="Warsaw Chopin Airport" className="h-32 px-20" />
            </div>
            <div className='inline-flex'>
                <table className="table-auto text-zinc-800 text-2xl font-bold w-screen">
                    <thead>
                        <tr className="bg-cyan-400">
                            <th className="px-4 py-2">Airline</th>
                            <th className="px-4 py-2 w-1/6">Origin</th>
                            <th className="px-4 py-2">Flight number</th>
                            <th className="px-4 py-2">Estimated</th>
                            <th className="px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {arrivalsData.map((arrival: any) => (
                            <tr key={arrival.flight}>
                                <td className="border px-4 py-2"><div className="flex flex-row gap-x-10 justify-center items-center">{arrival.airline_logo !== "Unknown" ? <img className="h-12 w-32" src={arrival.airline_logo} alt="" /> : arrival.airline}</div></td>
                                <td className="border px-4 py-2"><div className="flex flex-row gap-x-10 justify-center items-center">{arrival.origin_city}</div></td>
                                <td className="border px-4 py-2"><div className="flex flex-row gap-x-10 justify-center items-center">{arrival.flight_number}</div></td>
                                <td className="border px-4 py-2"><div className="flex flex-row gap-x-10 justify-center items-center">{formatTime(arrival.expected_arrival_time)}</div></td>
                                <td className="border px-4 py-2"><div className="flex flex-row gap-x-10 justify-center items-center">
                                    {arrival.status.split(' ').map((word: string) => (word === 'Delayed' ? <span className="text-orange-500">{arrival.status}</span> :
                                    word === 'Landed' ? <span className="text-green-600">{arrival.status}</span> :
                                    word === 'Estimated' ? <span>{arrival.status}</span> :
                                    word === 'Cancelled' ? <span className="text-red-600">{arrival.status}</span> : 
                                    word === 'Scheduled' ? <span>{arrival.status}</span> : null))}
                                    </div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p>Time until next refresh: {timer} seconds</p>
            <Button onClick={fetchArrivals}>Click me</Button>
        </div>
    )
}