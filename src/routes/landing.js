import "../assets/css/landing.css";
import Logo from "../assets/logo.svg";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {
	deleteUser,
	onAuthStateChanged,
	signInAnonymously,
} from "@firebase/auth";
import { FormLabel, Image } from "react-bootstrap";
import { useMutation, useLazyQuery } from '@apollo/client';
import { CREATE_USER, CREATE_LOBBY, JOIN_LOBBY } from "../mutations";
import { DEBUG_GET_USER } from "../queries";
import { auth as firebaseAuth } from "../firebase-config";
import Toasts from "../components/errors/Toasts";

export default function LandingPage() {
	const navigate = useNavigate();
	const [userName, setUserName] = useState("");
	const [lobbyCode, setlobbyCode] = useState("");
	const [isCreate, setIsCreate] = useState(true);
	const [isLoggedIn, setIsLoggedIn] = useState(!!firebaseAuth.currentUser);
	const [isNavigating, setIsNavigating] = useState(false)
	const [alerts, setAlerts] = useState([])

	function navigateToLobby(code) {
		const name = userName
		navigate('/lobby/' + code, { state: { name, code, uuid: firebaseAuth.currentUser.uid } });
	};

	function signOut() {
		setIsLoggedIn(false);
		if (firebaseAuth.currentUser.isAnonymous) {
			// delete and sign out
			deleteUser(firebaseAuth.currentUser)
				.then(() => {
					console.log(`signed out and deleted anon user: ${firebaseAuth.currentUser}`);
				})
				.catch((err) => {
					setAlerts([...alerts, {
						variant: 'danger',
						title: 'Delete Anon User Error',
						desc: 'Error deleting an anon user! Please try again.'
					}])
					console.error(err)
				});
		} else {
			firebaseAuth
				.signOut()
				.then(() => {
					console.log(`Signed out user: ${firebaseAuth.currentUser}`);
				})
				.catch((err) => {
					setAlerts([...alerts, {
						variant: 'danger',
						title: 'User Sign-out Error',
						desc: 'Error signing out user! Please try again.'
					}])
					console.error(err)
				});
		}
	}

	const [getUserQuery, { client }] = useLazyQuery(DEBUG_GET_USER);
	const [createUser, { reset: createUserReset }] = useMutation(CREATE_USER);
	const [createLobby, { reset: createLobbyReset }] = useMutation(CREATE_LOBBY);
	const [joinLobby, { reset: joinLobbyReset }] = useMutation(JOIN_LOBBY);

	async function createOrJoinLobby() {
		const uuid = firebaseAuth.currentUser.uid
		if (isCreate) {
			createLobby({
				variables: { uuid: uuid },
			}).then((createLobbyResponse) => {
				const { data: createLobbyData, error: createLobbyError } = createLobbyResponse;
				const code = createLobbyData.createLobby.lobby_code;

				if (createLobbyError) {
					console.error(createLobbyError)
					return;
				}
				console.log(`Created lobby ${code}`)
				navigateToLobby(code, uuid);
			}).catch((err) => {
				setAlerts([...alerts, {
					variant: 'danger',
					title: 'Create Lobby Error',
					desc: 'Error creating Lobby! Please try again.'
				}])
				console.error(err)
			});
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
			}).catch((err) => {
				setAlerts([...alerts, {
					variant: 'danger',
					title: 'Join Lobby Error',
					desc: 'Error joining lobby! Please try again.'
				}])
				console.error(err)
			});
		}
	}

	async function handleFormSubmit(e) {
		e.preventDefault();
		setIsNavigating(true);
		if (!firebaseAuth.currentUser) {
			await signInAnonymously(firebaseAuth)
				.then(async (userCredential) => {
					await createUser({
						variables: {
							uuid: userCredential.user.uid,
							username: userName,
						},
					}).then((createUserResponse) => {
						const { data: createUserData, error: createUserError } = createUserResponse;
						const uuid = createUserData.createUser.uuid;

						if (createUserError) {
							console.error(createUserError);
							return;
						}
						console.log(`Created user: ${createUserData.createUser.uuid}`);

					}).catch((err) => {
						setIsNavigating(false);
						setAlerts([...alerts, {
							variant: 'danger',
							title: 'Create User Error',
							desc: 'Error creating user! Please try again.'
						}])
						console.error(err)
					});
				}).catch((err) => {
					setIsNavigating(false);
					// TODO delete firebase user
					setAlerts([...alerts, {
						variant: 'danger',
						title: 'Firebase User Error',
						desc: 'Error creating Firebase user! Please try again.'
					}])
					console.error(err)
				});
		}
		createOrJoinLobby();
	}

	useEffect(() => {
		const unsub = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
			if (!isNavigating) {
				if (!firebaseUser) {
					// signed out case
					console.log("signed out case")
					setIsLoggedIn(false)
					setUserName("")
					return;
				} else {
					// saved user case
					console.log("saved user case")
					setIsLoggedIn(true)
					console.log(`Logged in with firebase uid: ${firebaseUser.uid}`);
					getUserQuery({
						variables: { uuid: firebaseUser.uid },
					}).then((userQueryResponse) => {
						const { data: userQueryData, error: userQueryError } = userQueryResponse;
						if (userQueryError) {
							console.error(userQueryError);
							return; // returns undefined and resolves the .then() in the case that a user matching the input uuid was not found
						}
						setUserName(`${userQueryData.DEBUG_getUser.username}`);
						console.log(
							`Logged in with motive username: ${userQueryData.DEBUG_getUser.username} `
						);
					}).catch(err => {
						setAlerts([...alerts, {
							variant: 'danger',
							title: 'Login Error',
							desc: 'Error logging in user! Please try again.'
						}])
						console.error(err)
					});
				}
			}
		});

		return () => {unsub()}
	}, [isNavigating]);

	return (
		<>
			<Toasts alerts={alerts} />
			<div className="landingBody">
				<div className="card-container">
					<Image className="landing-logo" src={Logo} prefix="" />
					<Card className="card" border="dark">
						<Card.Body className="card-body">
							<div className="button-wrapper">
								{isLoggedIn && (
									<Button className="sign-out" onClick={signOut}>
										Sign out
									</Button>
								)}
							</div>
							<Card.Title className="whats-the-text">
								What's the <span className="orangeText">Motive</span>?
							</Card.Title>
							<Card.Subtitle className="create-group-text">
								Create or join a lobby
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
										disabled={isLoggedIn} // this field is disabled when a user is already signed in
										type="text"
										placeholder=""
										value={userName}
										onChange={(e) => {
											setUserName(e.target.value);
										}}
									/>
									<div>
										{!isCreate && (
											<Form.Group controlId="formLobbyCode">
												<FormLabel className="form-label-2">
													<small>Lobby code</small>
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
									{isCreate ? "Join a lobby" : "Create a lobby"}
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
