
import * as React from "react";
import { Button } from "../components/Button";

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

        // Start the timer countdown
        const intervalId = setInterval(() => {
            setTimer(prevTimer => prevTimer - 1);
        }, 1000);

        // Fetch arrivals data when the timer reaches 0
        if (timer === 0) {
            // Reset the timer to 5 minutes
            setTimer(300);
            // Fetch arrivals data
            fetchArrivals();
        }

        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [timer, initalFetch]);


    return (
        <div>
            <h1>Arrivals</h1>
            <p>Time until next fetch: {timer} seconds</p>
            <Button onClick={fetchArrivals}>Click me</Button>
        </div>
    )
}