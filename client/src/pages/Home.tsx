import { Button } from "../components/Button"
import { Link } from 'react-router-dom';

export function Home() {
    return (
        <div className="w-screen h-screen flex items-center justify-center bg-zinc-700 gap-x-5">
            <Link to='/arrivals'>
                <Button className="h-20 bg-white"><span className="font-sans text-4xl text-black p-2">Przyloty</span></Button>
            </Link>
            <Link to='/departures'>
                <Button className="h-20 bg-white"><span className="font-sans text-4xl text-black p-2">Odloty</span></Button>
            </Link>
        </div >
    )
}