import { Link, useLoaderData } from "react-router-dom"


export default function LobbyPage() {
    const {id} = useLoaderData();

    return <>
    <div>
        lobby page for {id}
    </div>
    <Link to="/">home</Link>
    </>
}

// notice in App.js we have path /lobby/:id
// this means we will pass id in params.id
// whatever is returned here, can be retrieved in useLoaderData()
export async function loader({params}) {
    // make some call to get lobby data with params
    return params
}