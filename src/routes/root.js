import { Outlet } from "react-router"
import { Link } from "react-router-dom"

import React, { useState } from "react";


export default function Root() {

	return (
		<>
		<Link to="/login" state={{}}> login </Link>
		</>
	)
}

export async function loader() {
    return null
}