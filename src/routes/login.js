import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { getAuth, signInAnonymously } from "@firebase/auth";
import auth from "../firebase-config"

export default function LoginPage() {
    const [code, setCode] = useState("ABCD")
    const navigate = useNavigate()
    const anon = getAuth();
    const [guestName, setGuestName] = useState('')

    function generateLobbyCode() {
        // some random 4-character string generator
    }

    const handleCreateLobby = async (e) => {
        e.preventDefault();

        try {
            await signInAnonymously(anon);

            // lobby code is generated
            setCode(generateLobbyCode);
            // navigate to /lobby/code
        } catch (error) {

        }


    };


    return <>
    <div>
    <Card border="dark" style={{ width: '300px', margin: 'auto', marginTop: '50px', padding: '20px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)' }}>
        <Card.Body>
          <Card.Title>Motive</Card.Title>
          <Form>
            <Form.Group className="mb-3" controlId="formGuestName">
              <Form.Label>Guest Name</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter Guest Name..." 
                value={guestName} 
                onChange={(e) => setGuestName(e.target.value)} 
              />
            </Form.Group>
            <div className="d-grid gap-2">
            <Button variant="light"
                    type="submit"
                    style={{
                        boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.3)'}}
                    onSubmit={(e) => handleCreateLobby()}
                    >
              Create Lobby
            </Button>
            {/* <Button variant="light"
                    type="submit"
                    style={{
                        boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.3)'}}
                    // onClick={(e) => joinLobbyHandler()}
                    >
              Join Lobby
            </Button> */}
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
    <Link to={"/lobby/" + code}> join lobby with code {code} </Link>

    </>
}

export async function loader() {
    return {}
}