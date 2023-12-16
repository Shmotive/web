import { Link, useLoaderData, useLocation } from "react-router-dom"
import "../assets/css/lobby.css";

export default function LobbyPage() {
    const location = useLocation();
    const passedState = location.state;

    console.log(passedState)

    return <>
    <div>
        lobby page for {passedState.code}
    </div>
    <Link to="/">home</Link>
    </>
}

// notice in App.js we have path /lobby/:id
// this means we will pass id in params.id
// whatever is returned here, can be retrieved in useLoaderData()
export async function loader() {
    // make some call to get lobby data with params
    return null
}