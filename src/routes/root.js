import { Outlet } from "react-router"
import { Link } from "react-router-dom"
export default function Root() {
	return (
		<>
		<Link to={"/login"}> login </Link>
		</>
	)
}

export async function loader() {
    return {}
}