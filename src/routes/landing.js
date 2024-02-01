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
import { useMutation, gql, useLazyQuery } from "@apollo/client";
import { CREATE_USER, CREATE_LOBBY, JOIN_LOBBY } from "../mutations";
import { DEBUG_GET_USER } from "../queries";

export default function LandingPage() {
  const navigate = useNavigate();
  const firebaseAuth = getAuth();
  const [userName, setuserName] = useState("");
  const [lobbyCode, setlobbyCode] = useState("");
  const [isCreate, setIsCreate] = useState(true);
  const [user, setUser] = useState(firebaseAuth.currentUser);

  function navigateToLobby(code, uuid) {
    const name = userName;
    navigate("/lobby/" + code, { state: { name, code, uuid } });
  }

  function signOut() {
    if (user.isAnonymous) {
      // delete and sign out
      deleteUser(user)
        .then(() => {
          console.log("signed out and deleted anon user");
          console.log(user);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      firebaseAuth
        .signOut()
        .then(() => {
          console.log("signed out");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  const [getUserQuery, { client }] = useLazyQuery(DEBUG_GET_USER);

  const [createUser, { reset: createUserReset }] = useMutation(CREATE_USER);
  const [createLobby, { reset: createLobbyReset }] = useMutation(CREATE_LOBBY);
  const [joinLobby, { reset: joinLobbyReset }] = useMutation(JOIN_LOBBY);

  async function handleFormSubmit(e) {
    e.preventDefault();
    if (!user) {
      signInAnonymously(firebaseAuth)
        .then((userCredential) => {
          createUser({
            variables: {
              uuid: userCredential.user.uid,
              username: userName,
            },
          })
            .then((createUserResponse) => {
              console.log("createuserresponse:", createUserResponse);
              const { data: createUserData, error: createUserError } =
                createUserResponse;
              const uuid = createUserData.createUser.uuid;

              if (createUserError)
                console.log(
                  "createusererror:",
                  createUserError.message,
                  createUserError.code
                );

              if (createUserData) {
                console.log(isCreate);
                if (isCreate) {
                  createLobby({
                    variables: {
                      uuid: uuid,
                    },
                  })
                    .then((createLobbyResponse) => {
                      console.log(createLobbyResponse);
                      const { data: createLobbyData, error: createLobbyError } =
                        createLobbyResponse;
                      const code = createLobbyData.createLobby.lobby_code;

                      if (createLobbyError)
                        console.log(
                          "createlobbyerror: ",
                          createLobbyError.code,
                          createLobbyError.message
                        );

                      if (createLobbyData) {
                        navigateToLobby(code, uuid);
                      }
                    })
                    .catch((err) =>
                      console.log("createlobbyerror", err.code, err.message)
                    );
                } else {
                  joinLobby({
                    variables: {
                      uuid: uuid,
                      lobby_code: lobbyCode,
                    },
                  })
                    .then((joinLobbyResponse) => {
                      const { data: joinLobbyData, error: joinLobbyError } =
                        joinLobbyResponse;
                      const code = joinLobbyData.joinLobby.lobby_code;

                      if (joinLobbyError) console.log(joinLobbyError);

                      if (joinLobbyData) {
                        navigateToLobby(code, uuid);
                      }
                    })
                    .catch((err) => console.log(err));
                }
              }
            })
            .catch((error) => console.log("createusererror:", error));
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          return;
        });
    }
  }

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        console.log(firebaseUser.uid);
        getUserQuery({
          variables: {
            uuid: firebaseUser.uid,
          },
        })
          .then((userQueryResponse) => {
            console.log(userQueryResponse);
            const { data: userQueryData, error: userQueryerror } =
              userQueryResponse;

            if (userQueryerror)
              console.log(userQueryerror.message, userQueryerror.code);
            if (userQueryData)
              setuserName(`${userQueryData.DEBUG_getUser.username}`);
            console.log(
              `i just set the username to ${userQueryData.DEBUG_getUser.username} `
            );
          })
          .catch((err) => console.log("userQueryError", err.code, err.message));
      } else {
        setuserName("");
        console.log("user signed out");
      }
    });
  }, []);

  return (
    <>
      <div className="landingBody">
        <div className="card-container">
          <div className="left-col-container">
            <Image
              className="landing-logo"
              src={require("../assets/shrug-smiley.jpg")}
            />
          </div>
          <div />
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
