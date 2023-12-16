import { Link, useLoaderData, useLocation } from "react-router-dom";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import React, {useState} from "react";
import "../assets/css/lobby.css";


export default function LobbyPage() {
    const location = useLocation();
    const passedState = location.state;
	// const joinedMembersArray = ['Member 1', 'Member 2', 'Member 3']; 

	const [joinedMembersArray, setJoinedMembersArray] = useState(['Member 1', 'Member 2', 'Member 3']); // Initialize with existing members

    const handleAddMember = () => {
        const newMember = `New Member ${joinedMembersArray.length + 1}`;
        setJoinedMembersArray([...joinedMembersArray, newMember]);
    };

    console.log(passedState)

    return <>
		<div className="container">
			<Image className="logo" src={require("../assets/shrug-smiley.jpg")} />
			<div className="lobby-code">
				lobby page for {passedState.code}
				<div className="joined-members-section">
                    <ul>
                        {joinedMembersArray.map((member, index) => (
                            <li key={index}>{member}</li>
                        ))}
                    </ul>
					<button onClick={handleAddMember}>Add Member</button>

                </div>
			</div>
			<Link to="/">home</Link>
			
			<Button className="ready-button" variant="secondary" size="lg"> waiting for host... </Button>
		</div>
		<div className="lobby">
			lobby page for {passedState.guestName}
		</div>
    </>
}

// notice in App.js we have path /lobby/:id
// this means we will pass id in params.id
// whatever is returned here, can be retrieved in useLoaderData()
export async function loader() {
    // make some call to get lobby data with params
    return null
}