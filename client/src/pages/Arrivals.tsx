
import * as React from "react";
import { PlaneLanding } from 'lucide-react'

interface Arrival {
    flight_number: string,
    airline: string,
    airline_logo: string,
    origin_city: string,
    status: string,
    expected_arrival_time: number
}

interface Cache {
    message: string
}

export function Arrivals() {
    const [arrivalData, setArrivalData] = React.useState<Arrival[]>([])
    const [arrivalData1, setArrivalData1] = React.useState<Arrival[]>([])
    const [arrivalData2, setArrivalData2] = React.useState<Arrival[]>([])
    const [arrivalData3, setArrivalData3] = React.useState<Arrival[]>([])
    const [fetchTimer, setFetchTimer] = React.useState<number>(300)
    const [initalFetch, setInitialFetch] = React.useState<boolean>(false)
    const [pageTimer, setPageTimer] = React.useState<number>(20)
    const [page, setPage] = React.useState<number>(1)

    const cacheScheduledArrivals = async () => {
        console.log("Caching scheduled arrivals started")
        try {
            const response = await fetch('https://warsaw-chopin-airport-arrival-departure.onrender.com/api/getArrivals', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data: Cache = await response.json();
            console.log(data)
            console.log("Caching scheduled arrivals finished")
            return data
        } catch (error) {
            console.log(error)
        }

    }

    const getCachedArrivals = async () => {
        console.log("Getting cached arrivals started")
        try {
            const response = await fetch('https://warsaw-chopin-airport-arrival-departure.onrender.com/api/getCachedArrivals', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data: Arrival[] = await response.json();
            console.log("read data", data)

            const arrivalsData1: Arrival[] = []
            const arrivalsData2: Arrival[] = []
            const arrivalsData3: Arrival[] = []

            for (let i = 0; i < Object.keys(data).length; i++) {
                if (i < 13 && data[i]) {

                    arrivalsData1.push(data[i])
                } else if (i >= 13 && i < 26 && data[i]) {
                    arrivalsData2.push(data[i])
                } else if (i >= 26 && data[i]) {
                    arrivalsData3.push(data[i])
                }
            }
            if (Object.values(arrivalsData1).length > 0) { setArrivalData1(arrivalsData1 as Arrival[]) }
            if (Object.values(arrivalsData2).length > 0) { setArrivalData2(arrivalsData2 as Arrival[]) }
            if (Object.values(arrivalsData3).length > 0) { setArrivalData3(arrivalsData3 as Arrival[]) }

            console.log("datas", arrivalData1, arrivalData2, arrivalData3)
            console.log('getCachedDepartures end');
            return "Finished reading data"
        } catch (error) {
            console.log(error)
        }
    }

    const fetchData = async () => {
        await cacheScheduledArrivals()
        await getCachedArrivals()
    }

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            if (initalFetch === false) {
                setInitialFetch(true)
                fetchData()
            }

            setPageTimer(prevTimer => {
                if (prevTimer === 1) {
                    let nextPage = page === 3 ? 1 : page + 1
                    if (nextPage === 1 && arrivalData1 && arrivalData1.length > 0) {
                        setArrivalData(arrivalData1)
                    } else if (nextPage === 2 && arrivalData2 && arrivalData2.length > 0) {
                        setArrivalData(arrivalData2)
                    } else if (nextPage === 3 && arrivalData3 && arrivalData3.length > 0) {
                        setArrivalData(arrivalData3)
                    } else {
                        nextPage = 1
                        setArrivalData(arrivalData1)
                        
                    }
                    setPage(nextPage)
                    return 20
                } else {
                    return prevTimer - 1
                    
                }
            })
            setFetchTimer(prevTimer => {
                if (prevTimer === 1) {
                    fetchData()
                    return 300
                } else {
                    return prevTimer - 1
                    
                }
            })
        }, 1000)
        return () => clearInterval(intervalId)
    })

    const formatTime = (timestamp: number): string => {
        const date = new Date(timestamp * 1000);
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
                            {Object.values(arrivalData).map((arrival: Arrival) => (
                                <tr key={arrival.flight_number}>
                                    <td className="border px-4 py-2"><div className="flex flex-row gap-x-10 justify-center items-center">{arrival.airline_logo !== "Unknown" ? <img className="h-12 w-32" src={arrival.airline_logo} alt="" /> : arrival.airline}</div></td>
                                    <td className="border px-4 py-2"><div className="flex flex-row gap-x-10 justify-center items-center">{arrival.origin_city === undefined ? null : arrival.origin_city}</div></td>
                                    <td className="border px-4 py-2"><div className="flex flex-row gap-x-10 justify-center items-center">{arrival.flight_number === undefined ? null : arrival.flight_number}</div></td>
                                    <td className="border px-4 py-2"><div className="flex flex-row gap-x-10 justify-center items-center">{formatTime(arrival.expected_arrival_time === undefined ? 1 : arrival.expected_arrival_time)}</div></td>
                                    <td className="border px-4 py-2"><div className="flex flex-row gap-x-10 justify-center items-center">
                                        {arrival.status.split(' ').map((word: string) => (word === 'Delayed' ? <span className="text-orange-500">{arrival.status !== undefined ? arrival.status : null}</span> :
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
            </div>
            {arrivalData.length !== 0 ? <p></p> : <p className="p-2 text-xl">Fetching data. It might take up to two minutes.</p>}
            <p>Time until next refresh: {pageTimer} seconds</p>
            <p>Time until next fetch: {fetchTimer} seconds</p>
        </div>
    )
}