import { Outlet } from "react-router"
import "./landing.css";
import React, { useState, useRef } from "react";
import { Link, useNavigate, useLoaderData } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { getAuth, onAuthStateChanged, signInAnonymously } from "@firebase/auth";
import auth from "../firebase-config"
import { FormLabel } from "react-bootstrap";

export default function LoginPage() {
    const navigate = useNavigate();
    const anon = getAuth();
    const guestNameRef = useRef();
	const codeRef = useRef('');
	const [isCreate, setIsCreate] = useState(true);
     

    function generateLobbyCode() {
        // some random 4-character string generator
    }

    const handleFormSubmit = async (e) => {

        const guestName = guestNameRef.current.value;
		const code = codeRef.current.value || "ABCD";
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
    <div style={{ position:"fixed", right: 20, top: 0, height: "100vh", width: "400px", zIndex: '1' }}>
    <Card border="dark" style={{ backdropFilter:'blur(10px)', backgroundColor:'#FFFFFF95', width: '400px', margin: 'auto', padding: '20px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)', height: "100vh" }}>
        <Card.Body style={{padding:'20px'}}>
          <Card.Title className="mb-3">What's the Motive?</Card.Title>
		  <Card.Subtitle className="mb-2 mt-2">Create a Group</Card.Subtitle>
		  <Card.Text>Help decide the best location for everyone.</Card.Text>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3" controlId="formGuestName">
			  <FormLabel style={{ display: 'block', marginBottom: '0.1rem' }}><small>Your Name</small></FormLabel>
			  <Form.Control 
                type="text" 
                placeholder=""
				style={{width: '97.5%', marginTop: "0.2rem", marginBottom: "0.2rem"}}
                defaultValue={""} // had to do these last two properties 
                ref={guestNameRef} // bc removing onChange makes the input read-only
                                    // this gets around that somehow lol
              />
            <div className="d-grid gap-2">
			{!isCreate && 
			<Form.Group className="mb-3" controlId="formLobbyCode">
				<FormLabel style={{ display: 'block', marginBottom: '0.1rem' }}>
					<small>Group code</small>
				</FormLabel>
			<Form.Control 
			  type="text" 
			  placeholder=""
			  style={{width: '97.5%', marginTop: "0.2rem", marginBottom: "0.2rem"}}
			  defaultValue={""}  
			  ref={codeRef} 
			/>
		  </Form.Group>}
            <Button variant="light"
                    type="submit"
                    style={{width: '100%',
					 marginTop: "0.2rem",
					 marginBottom: "0.2rem",
                     boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.3)'}}
                    >
              {isCreate === true ? "Create Lobby" : "Join Lobby"}
            </Button>
            </div>
            </Form.Group>
          </Form>
		  <small style={{display:"block", textAlign: "center", marginTop:"0.3rem", marginBottom: "0.3rem"}}> or </small>
		  <div style={{textAlign: "center"}}>
		  <Button variant="link" size="sm" 
		  	style={{ 
                backgroundColor: 'transparent', 
                borderColor: 'transparent', 
                textDecoration: 'none',
                boxShadow: 'none'
            	}}
				className="link-button"
				onClick={() => setIsCreate(!isCreate)}>
					{isCreate === true ? "Join a group" : "Create a group"}
			</Button>
		  </div>
        </Card.Body>
      </Card>
    </div>

    </>
}

export async function loader() {
    return null
}