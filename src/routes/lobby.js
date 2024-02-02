import { Link, useLoaderData, useLocation, useNavigate } from "react-router-dom";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import React, {useState, useRef} from "react";
import { useMutation } from "@apollo/client";
import { START_LOBBY } from "../mutations";
import "../assets/css/lobby.css";


export default function LobbyPage() {
    const location = useLocation();
    const passedState = location.state;
	const listRef = useRef(null);
    const navigate = useNavigate();
    const [name, setName] = useState(passedState.name)
    const [code, setCode] = useState(passedState.code)
    const [uuid, setUuid] = useState(passedState.uuid)
    // to send some state variables to voting page just in case
    // navigate('/voting/' + code, {state: { name, code }} )

	// const joinedMembersArray = ['Member 1', 'Member 2', 'Member 3']; 

	const [joinedMembersArray, setJoinedMembersArray] = useState(['Member 1', 'Member 2', 'Member 3']); // Initialize with existing members

    const [startLobby, { reset: startLobbyReset }] = useMutation(START_LOBBY);

    async function buttonOnClick() {
        startLobby({
            variables: {
                lobby_code: code
            }
        }).then((startLobbyResponse) => {
            console.log(startLobbyResponse)
            const { data: startLobbyData, error: startLobbyError } = startLobbyResponse;

            if (startLobbyError) console.log(startLobbyError)
            
            if (startLobbyData) {
                navigate('/voting/' + passedState.code, { state: {name, code, uuid}})
            }
        }).catch(err => console.log(err))
    };
	
    console.log(passedState)

    return <>
            <div className="container">
                <div className="col-left">
                    <div className="logo">
                    <Image src={require("../assets/shrug-smiley.jpg")} />
                    </div>
                    <div className="joined-members-container">
                            {joinedMembersArray.map((member, index) => (
                                <UserSlot key={index} name={member} /> 
                            ))}
                    </div>
                </div>
                <div className="col-middle">
                    <div className="flex-1"></div>
                    <div className="lobby-code">
                        lobby page for {passedState.code}
                    </div>
                    <div className="button-container">
                    <Button disabled={true} 
                        className="ready-button user-view" 
                        variant="secondary"
                        size="lg" 
                        >{(false) ? "start" : "waiting for host..."}  
                    </Button>
                        {/* above, the check for whether the user viewing is host
                        is done by comparing the current user id to that of the host
                        on the DB i.e. (user.id === host.id) ? 'start' : 'waiting for host...')  */}
                    <Button
                        className="ready-button user-view" 
                        variant="secondary"
                        size="lg" 
                        onClick={buttonOnClick}
                        >{"voting test"}  {/* button for testing purposes*/}
                    </Button>
                    </div>
                </div>
                <div className="col-right">
                    <Link to="/">home</Link>
                </div>
			</div>
    </>
}

const UserSlot = ({ name, logo }) => {
    return <div className="members"> {name}</div>
}

// notice in App.js we have path /lobby/:id
// this means we will pass id in params.id
// whatever is returned here, can be retrieved in useLoaderData()
export async function loader() {
    // make some call to get lobby data with params
    return null
}