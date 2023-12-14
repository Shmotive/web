import React, { useState, useRef } from "react";
import { Link, useNavigate, useLoaderData } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { getAuth, onAuthStateChanged, signInAnonymously } from "@firebase/auth";
import auth from "../firebase-config"

export default function LoginPage() {
    const [code, setCode] = useState("ABCD");
    const navigate = useNavigate();
    const anon = getAuth();
    const guestNameRef = useRef();
     

    function generateLobbyCode() {
        // some random 4-character string generator
    }

    const handleFormSubmit = async (e) => {

        const guestName = guestNameRef.current.value; 
        // we can use useRef in order to send the form's (guestname) value
        // this means we don't need to track the changes of the input using
        // state, so the component doesn't needlessly rerender

        signInAnonymously(anon)
          .then(() => {
            // Signed in..
            // step1: generate the lobby code: setCode(generateLobbyCode());
            console.log('code generated')

            // step2: route to /lobby/:code in one of several ways:
             
            // using redirect, usenavigate, or usehistory -- all from reactrouter
            navigate('/lobby/' + code, {state: {guestName, code}})
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
            // ...
          });
    };

    onAuthStateChanged(anon, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          console.log(user.uid);
          // ...
        } else {
          // User is signed out
          // ...
        }
      });

    return <>
    <div>
    <Card border="dark" style={{ width: '300px', margin: 'auto', marginTop: '50px', padding: '20px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)' }}>
        <Card.Body>
          <Card.Title>Motive</Card.Title>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3" controlId="formGuestName">
              <Form.Label>Guest Name</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter Guest Name..."
                defaultValue={""} // had to do these last two properties 
                ref={guestNameRef} // bc removing onChange makes the input read-only
                                    // this gets around that somehow lol
              />
            </Form.Group>
            <div className="d-grid gap-2">
            <Button variant="light"
                    type="submit"
                    style={{
                    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.3)'}}
                    >
              Create Lobby
            </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
    <Link to={"/lobby/" + code}> join lobby with code {code} </Link>

    </>
}

export async function loader() {
    return null
}