import "../assets/css/landing.css";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {
	deleteUser,
	getAuth,
	onAuthStateChanged,
	signInAnonymously,
} from "@firebase/auth";
import auth from "../firebase-config";
import { FormLabel, Image } from "react-bootstrap";
import { useMutation, useLazyQuery } from '@apollo/client';
import { CREATE_USER, CREATE_LOBBY, JOIN_LOBBY } from "../mutations";
import { DEBUG_GET_USER } from "../queries";

export default function LandingPage() {
	const navigate = useNavigate();
	const firebaseAuth = getAuth();
	const [userName, setuserName] = useState("");
	const [lobbyCode, setlobbyCode] = useState("");
	const [isCreate, setIsCreate] = useState(true);
	const [user, setUser] = useState(firebaseAuth.currentUser);

	function navigateToLobby(code) {
		const name = userName
		navigate('/lobby/' + code, { state: { name, code, uuid: firebaseAuth.currentUser.uid } });
	};

	function signOut() {
		if (firebaseAuth.currentUser.isAnonymous) {
			// delete and sign out
			deleteUser(firebaseAuth.currentUser.isAnonymous)
				.then(() => { console.log(`signed out and deleted anon user: ${firebaseAuth.currentUser}`); })
				.catch(console.error);
		} else {
			firebaseAuth
				.signOut()
				.then(() => { console.log(`Signed out user: ${firebaseAuth.currentUser}`); })
				.catch(console.error);
		}
	}

	const [getUserQuery, { client }] = useLazyQuery(DEBUG_GET_USER);
	const [createUser, { reset: createUserReset }] = useMutation(CREATE_USER);
	const [createLobby, { reset: createLobbyReset }] = useMutation(CREATE_LOBBY);
	const [joinLobby, { reset: joinLobbyReset }] = useMutation(JOIN_LOBBY);

	async function handleFormSubmit(e) {
		e.preventDefault();
		if (!firebaseAuth.currentUser) {
			signInAnonymously(firebaseAuth)
				.then((userCredential) => {
					createUser({
						variables: {
							uuid: userCredential.user.uid,
							username: userName,
						},
					}).then((createUserResponse) => {
						console.log(`createUserResponse: ${createUserResponse}`);
						const { data: createUserData, error: createUserError } = createUserResponse;
						const uuid = createUserData.createUser.uuid;

						if (createUserError) {
							console.error(createUserError);
							return;
						}

						if (isCreate) {
							createLobby({
								variables: { uuid: uuid },
							}).then((createLobbyResponse) => {
								console.log(createLobbyResponse);
								const { data: createLobbyData, error: createLobbyError } = createLobbyResponse;
								const code = createLobbyData.createLobby.lobby_code;

								if (createLobbyError) {
									console.error(createLobbyError)
									return;
								}

								navigateToLobby(code, uuid);
							}).catch(console.error);
						} else {
							joinLobby({
								variables: {
									uuid: uuid,
									lobby_code: lobbyCode,
								},
							}).then((joinLobbyResponse) => {
								const { data: joinLobbyData, error: joinLobbyError } = joinLobbyResponse;
								const code = joinLobbyData.joinLobby.lobby_code;

								if (joinLobbyError) {
									console.error(joinLobbyError)
									return;
								}

								navigateToLobby(code, uuid);
							}).catch(console.error);
						}
					}).catch(console.error);
				}).catch(console.error);
		}
	}

	useEffect(() => {
		onAuthStateChanged(firebaseAuth, (firebaseUser) => {
			setUser(firebaseUser);
			if (userName.length === 0) {
				return;
			} 
			if (firebaseUser) {
				console.log(`logged in as: ${firebaseUser.uid}`);
				getUserQuery({ 
					variables: { uuid: firebaseUser.uid },
				}).then((userQueryResponse) => {
						console.log(userQueryResponse);
						const { data: userQueryData, error: userQueryError } = userQueryResponse;

						if (userQueryError) {
							console.error(userQueryError);
							return; // returns undefined and resolves the .then() in the case that a user matching the input uuid was not found
						}

						setuserName(`${userQueryData.DEBUG_getUser.username}`);
						console.log(
							`i just set the username to ${userQueryData.DEBUG_getUser.username} `
						);
					}).catch(console.error);
			}
		});
	}, []);

	return (
		<>
			<div className="landingBody">
				<div className="card-container">
					<Image className="landing-logo" src={require("../assets/shrug-smiley.jpg")}prefix=""/>
					<Card className="card" border="dark">
						<Card.Body className="card-body">
							<div className="button-wrapper">
								{user && (
									<Button className="sign-out" onClick={signOut}>
										Sign out
									</Button>
								)}
							</div>
							<Card.Title className="whats-the-text">
								What's the <span className="orangeText">Motive</span>?
							</Card.Title>
							<Card.Subtitle className="create-group-text">
								Create a Group
							</Card.Subtitle>
							<Card.Text className="help">
								Help decide the best location for everyone.
							</Card.Text>
							<Form
								onSubmit={(e) => {
									handleFormSubmit(e);
								}}
							>
								<Form.Group controlId="formGuestName">
									<FormLabel className="form-label">
										<small>Your Name</small>
									</FormLabel>
									<Form.Control
										className="form-control"
										disabled={user} // this field is disabled when a user is already signed in
										type="text"
										placeholder=""
										value={userName}
										onChange={(e) => {
											setuserName(e.target.value);
										}}
									/>
									<div>
										{!isCreate && (
											<Form.Group controlId="formLobbyCode">
												<FormLabel className="form-label-2">
													<small>Group code</small>
												</FormLabel>
												<Form.Control
													className="form-control"
													type="text"
													placeholder=""
													value={lobbyCode}
													onChange={(e) => {
														setlobbyCode(e.target.value);
													}}
												/>
											</Form.Group>
										)}
										<Button
											disabled={
												userName.length === 0 ||
												(!isCreate && lobbyCode.length === 0)
											}
											variant="light"
											type="submit"
											className="lobby-button"
										>
											{isCreate ? "Create Lobby" : "Join Lobby"}
										</Button>
									</div>
								</Form.Group>
							</Form>
							<small className="small"> or </small>
							<div className="link-button-container">
								<Button
									variant="link"
									size="sm"
									className="link-button"
									onClick={() => setIsCreate(!isCreate)}
								>
									{isCreate ? "Join a group" : "Create a group"}
								</Button>
							</div>
						</Card.Body>
					</Card>
				</div>
			</div>
		</>
	);
}

export async function loader() {
	return null;
}
