import { Outlet } from "react-router"
import "../assets/css/landing.css";
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLoaderData } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { deleteUser, getAuth, onAuthStateChanged, signInAnonymously } from "@firebase/auth";
import auth from "../firebase-config"
import { FormLabel, Image } from "react-bootstrap";

export default function LoginPage() {
	const navigate = useNavigate();
	const anon = getAuth();
	const guestNameRef = useRef();
	const codeRef = useRef('');
	const [isCreate, setIsCreate] = useState(true);
	const [user, setUser] = useState(anon.currentUser);

	useEffect(() => {
		console.log('user: ', user);
	}, [user])

	function signOut() {
		if (user.isAnonymous) {
			// delete and sign out
			deleteUser(user).then(() => {
				console.log("signed out and deleted anon");
				console.log(user);
			}).catch((error) => {
				console.log(error)});
		} else {
			anon.signOut().then(() => {
				console.log("signed out");
			}).catch((err) => {
				console.log(err);
			});
		}
	}

	const handleFormSubmit = async (e) => {

		const guestName = guestNameRef.current.value;
		const code = codeRef.current.value || "ABCD";
		// we can use useRef in order to send the form's (guestname) value
		// this means we don't need to track the changes of the input using
		// state, so the component doesn't needlessly rerender

		if (!user) {
			signInAnonymously(anon)
				.then(() => {
					// Signed in..
					// step1: generate the lobby code: setCode(generateLobbyCode());
					console.log('code generated')
	
					// step2: route to /lobby/:code in one of several ways:
	
					// using redirect, usenavigate, or usehistory -- all from reactrouter
				})
				.catch((error) => {
					const errorCode = error.code;
					const errorMessage = error.message;
					console.log(errorCode, errorMessage)
					return
				});
		} 
		navigate('/lobby/' + code, { state: { guestName, code } })

	};

	useEffect(() => {

		onAuthStateChanged(anon, (firebaseUser) => {
			if (firebaseUser) {
				// User is signed in, see docs for a list of available properties
				// https://firebase.google.com/docs/reference/js/auth.user
				setUser(firebaseUser)
				console.log(firebaseUser.uid);
				// ...
			} else {
				console.log("See you next time!");
				setUser(null)
			}
		});
	}, [])
		
	return <>
		<div className="landingBody">
		<div className="ab1">
			{user && <Button onClick={signOut}> sign out</Button>}
			<Card className="card" border="dark" >
				<Card.Body className="card-body">
					<Card.Title className="mb-3">What's the <span className="orangeText">Motive</span>?</Card.Title>
					<Card.Subtitle className="mb-2 mt-2">Create a Group</Card.Subtitle>
					<Card.Text>Help decide the best location for everyone.</Card.Text>
					<Form onSubmit={handleFormSubmit}>
						<Form.Group  controlId="formGuestName">
							<FormLabel className="form-label"><small>Your Name</small></FormLabel>
							<Form.Control
								className="form-control"
								type="text"
								placeholder=""
								defaultValue={""} // had to do these last two properties 
								ref={guestNameRef} // bc removing onChange makes the input read-only
							// this gets around that somehow lol
							/>
							<div>
								{!isCreate &&
									<Form.Group controlId="formLobbyCode">
										<FormLabel className="form-label-2" >
											<small>Group code</small>
										</FormLabel>
										<Form.Control
											className="form-control"
											type="text"
											placeholder=""
											defaultValue={""}
											ref={codeRef}
										/>
									</Form.Group>}
								<Button 
									variant="light"
									type="submit"
									className="lobby-button"
								>
									{isCreate ? "Create Lobby" : "Join Lobby"}
								</Button>
							</div>
						</Form.Group>
					</Form>
					<small style={{ display: "block", textAlign: "center", marginTop: "0.3rem", marginBottom: "0.3rem" }}> or </small>
					<div style={{ textAlign: "center" }}>
						<Button variant="link" size="sm"
							style={{
								backgroundColor: 'transparent',
								borderColor: 'transparent',
								textDecoration: 'none',
								boxShadow: 'none'
							}}
							className="link-button"
							onClick={() => setIsCreate(!isCreate)}>
							{isCreate ? "Join a group" : "Create a group"}
						</Button>
					</div>
				</Card.Body>
			</Card>
		</div>
		</div>
	</>
}

export async function loader() {
	return null
}