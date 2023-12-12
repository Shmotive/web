import { useState } from "react"
import { Link } from "react-router-dom"

export default function LoginPage() {
    const [code, setCode] = useState("ABCD")
    return <>
    <div>
        login page:
    </div>
    <Link to={"/lobby/" + code}> join lobby with code {code} </Link>

    </>
}

export async function loader() {
    return {}
}