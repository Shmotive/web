import {
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import React, { useEffect, useState, useRef } from "react";
import "../assets/css/lobby.css";
import UserSlot from "../components/lobby/UserSlot";
import Logo from "../assets/logo.svg";

export default function LobbyPage() {
  const location = useLocation();
  const passedState = location.state;
  const { name, code } = passedState;
  const listRef = useRef(null);
  const navigate = useNavigate();
  const [joinedMembersArray, setJoinedMembersArray] = useState([
    "Benito",
    "Evan",
    "Ze",
    "Adolf",
    "Joseph",
  ]); // Initialize with existing members

  useEffect(() => {
    setJoinedMembersArray((prev) => {
      const newArray = [...prev];
      while (newArray.length < 8) {
        newArray.push("");
      }
      return newArray;
    });
  });
  // const buttonOnClick = () => {
  //     navigate('/recommendations/' + passedState.code)
  // };

  console.log("PASSED STATE", passedState);
  return (
    <>
      <div className="container">
        <div className="col-left">
          <div className="logo">
            <Link to={"/"}>
              <Image src={Logo} style={{ width: "100%", height: "100%" }} />
            </Link>
          </div>
          <div className="joined-members-container">
            {joinedMembersArray.map((member, index) => (
              <UserSlot key={index} index={index} name={member} />
            ))}
          </div>
        </div>
        <div className="col-middle">
          {/* <div className="flex-1"></div> */}
          <div className="join-info">
            Join on any device at{" "}
            <a className="link" href="#">
              whatsthemotive.app
            </a>
          </div>
          <div className="room-info">
            Your group code is:
            <div className="lobby-code">{passedState.code}</div>
          </div>
          <div className="button-container">
            <Button
              disabled={true}
              className="ready-button user-view"
              variant="secondary"
              size="lg"
            >
              {false ? "START" : "Waiting for host to start..."}
            </Button>
            {/* above, the check for whether the user viewing is host
                        is done by comparing the current user id to that of the host
                        on the DB i.e. (user.id === host.id) ? 'start' : 'waiting for host...')  */}
          </div>
        </div>
        {/* <div className="col-right">
          <Link to="/">home</Link>
        </div> */}
      </div>
    </>
  );
}

// notice in App.js we have path /lobby/:id
// this means we will pass id in params.id
// whatever is returned here, can be retrieved in useLoaderData()
export async function loader() {
  // make some call to get lobby data with params
  return null;
}
