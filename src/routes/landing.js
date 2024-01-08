import "../assets/css/landing.css";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { deleteUser, getAuth, onAuthStateChanged, signInAnonymously } from "@firebase/auth";
import auth from "../firebase-config"
import { FormLabel, Image } from "react-bootstrap";
import { useMutation, gql, useQuery } from '@apollo/client';

export default function LandingPage() {
	const navigate = useNavigate();
	const anon = getAuth();
	const guestNameRef = useRef('');
	const codeRef = useRef('');
	const [isCreate, setIsCreate] = useState(true);
	const [user, setUser] = useState(anon.currentUser);

	// gql parses the template strings into valid operations

	const CREATE_USER = gql` 
		mutation CreateUser(
			$uuid: String!,
			$username: String!
		) {
			createUser(uuid: $uuid, username: $username) {
				uuid
				username
				created_at
			}
		}
	`;

	const CREATE_LOBBY_GET_CODE = gql`
		mutation CreateLobbyAndGetCode(
			$uuid: String!
		) {
			createLobbyAndGetCode(uuid: $uuid) {
				code	
			}
		}
	`;

	const JOIN_LOBBY = gql`
		mutation JoinLobby(
			$uuid: String!,
			$code: String!
		) {
			joinLobby(uuid: $uuid, code: $code) {
				code	
			}
		}
	`;
	
	// when createUser resolves the promise, it returns the reactive variables
	// in the destructured array
	const navigateToLobby = () => {
		const code = codeRef.current.value || 'ABCD'; // createLobbyData ? createLobbyData.lobby.code : joinLobbyData.lobby.code;
		const name = guestNameRef.current.value;
		navigate('/lobby/' + code, { state: { name, code } });
	};

// 	const [joinLobby, { data: joinLobbyData,
// 					loading: joinLobbyLoading,
// 					error: joinLobbyError,
// 					reset: joinLobbyReset
// 					}
// 			] = useMutation(JOIN_LOBBY, {
// 					variables: {
// 						uuid: user ? user.uid : '',
// 						code: codeRef.current.value
// 					},
// 					onError: (error) => { 
// 						console.error(error);
// 						deleteUser(user)
// 						.then(() => {
// 							console.log('error creating lobby')
// 						})
// 						.catch(err => console.log(err))
// 						joinLobbyReset(); // 
// 					},
// 					onCompleted: navigateToLobby
// 	});

// 	const [createLobbyAndGetCode, { data: createLobbyData,
// 		 							loading: createLobbyLoading,
// 									error: createLobbyError,
// 									reset: createLobbyReset
// 									}
// 					] = useMutation(CREATE_LOBBY_GET_CODE, { 
// 					variables: {uuid: user ? user.uid : ''},
// 	   				onError: (error) => { 
// 		   				console.error(error);
// 		   				deleteUser(user)
// 		   				.then(() => {
// 			   				console.log('error creating lobby')
// 		   				})
// 		   				.catch(err => console.log(err))
// 		   				createLobbyReset();  
// 					},
// 	   				onCompleted: navigateToLobby
//    });

	const [createUser, { data: data1,
		 				loading: loading1,
						error: createUserError,
						reset: createUserReset
						}
					] = useMutation(CREATE_USER, {
		 					variables: {
								uuid: user ? user.uid : '' ,
								username: guestNameRef.current.value
							},
							onError: (error) => { // error callback for createUser -- deletes firebase user 
								console.error(error);
								deleteUser(user)
								.then(() => {
									console.log('error creating user')
								})
								.catch(err => console.log(err))
								createUserReset(); // Reset the mutation's reactive variables to their initial state
		  					},
							onCompleted:  navigateToLobby// isCreate ? createLobbyAndGetCode : joinLobby
	})

	useEffect(() => {
		console.log(user)
		// if (user) createUser();
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

	const handleFormSubmit = async(e) => {

		// if (!user) {
		// 	signInAnonymously(anon)
		// 		.then(() => {
		// 			// Signed in..
		// 			console.log('code generated')
										
		// 			// createUser()
		// 			// 	.catch(error => console.log(error));
					
		// 		})
		// 		.catch((error) => {
		// 			const errorCode = error.code;
		// 			const errorMessage = error.message;
		// 			console.log(errorCode, errorMessage)
		// 			return
		// 		});
		// }
		createUser();
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
		<div className="card-container">
			<div className = "left-col-container"><Image className="landing-logo" src={require("../assets/shrug-smiley.jpg")} /></div>
			<div/>
			<Card className="card" border="dark" >
				<Card.Body className="card-body">
				<div className="button-wrapper">
        			{user && <Button className="sign-out" onClick={signOut}>Sign out</Button>}
    			</div>
					<Card.Title className="whats-the-text">What's the <span className="orangeText">Motive</span>?</Card.Title>
					<Card.Subtitle className="create-group-text">Create a Group</Card.Subtitle>
					<Card.Text className="help">Help decide the best location for everyone.</Card.Text>
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
					<small className="small" > or </small>
					<div className="link-button-container">
						<Button 
							variant="link" 
							size="sm"
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