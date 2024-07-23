import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {Image, Button, Modal, ModalHeader, ModalTitle, ModalBody} from "react-bootstrap";
import React, { useCallback, useEffect, useState, useRef, useMemo } from "react";
import "../assets/css/lobby.css";
import UserSlot from "../components/lobby/UserSlot";
import InputField from "../components/lobby/InputField";
import Logo from "../assets/logo.svg";
import { useMapsLibrary, APIProvider } from "@vis.gl/react-google-maps";
import debounce from 'lodash.debounce';
import { useSubscription, useQuery, useMutation } from "@apollo/client";
import { LOBBY_PAGE_SUBSCRIPTION } from "../subscriptions";
import { ADD_SUGGESTION, START_LOBBY, SKIP_SUGGESTION } from "../mutations";
import { GET_LOBBY_USERS } from "../queries";
import Toasts from "../components/errors/Toasts";

export default function LobbyPage() {
  const location = useLocation();
  const passedState = location.state;
  const { name, code, uuid } = passedState;
  const [users, setUsers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [submittedSuggestions, setSubmittedSuggestions] = useState([]);
  const [ownerID, setOwnerID] = useState('');
  const [lobbyState, setLobbyState] = useState('');
  const [skipped, setSkipped] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();
  
  
  const { data: lobby_users, error: lobby_users_error } = useQuery(
    GET_LOBBY_USERS,
    {
      variables: { lobby_code: code },
    }
  );
  
  const [addSuggestion, { reset: addSuggestionReset }] = useMutation(ADD_SUGGESTION);
  
  const {
    data: lobby_users_subscription,
    error: lobby_users_error_subscription,
  } = useSubscription(LOBBY_PAGE_SUBSCRIPTION, {
    variables: { lobby_code: code, uuid: uuid },
  });

  const [startLobby, { reset: startLobbyReset }] = useMutation(START_LOBBY);
  
  const [skipSuggestion, { reset: skipSuggestionReset }] = useMutation(SKIP_SUGGESTION); 
  

  useEffect(() => {
    // Change in subscription data: update users and lobby state
    if (lobby_users_subscription) {
      console.log("LOBBY_USERS_SUBSCRIPTION", lobby_users_subscription);
      setUsers((prev) => {
        const arr = [
          lobby_users_subscription.subscribeToLobby.owner,
          ...lobby_users_subscription.subscribeToLobby.participants,
        ];
        while (arr.length < 8) {
          arr.push("");
        }
        return arr;
      });
      setLobbyState(lobby_users_subscription.subscribeToLobby.state);
      if (lobby_users_subscription.subscribeToLobby.state === 'VOTING') {
        navigate('/voting/' + passedState.code, { state: { name, code, uuid } }) 
      }
      return;
    }

    // query when the component mounts
    if (lobby_users) {
      setUsers((prev) => {
        const arr = [
          lobby_users.getLiveLobby.owner,
          ...lobby_users.getLiveLobby.participants,
        ];
        while (arr.length < 8) {
          arr.push("");
        }
        return arr;
      });
      setOwnerID(lobby_users.getLiveLobby.owner.uuid);
      setLobbyState(lobby_users.getLiveLobby.state)
    }
  }, [lobby_users_subscription, lobby_users]);


  function handleSkipSuggestion() {
    skipSuggestion({
      variables: {
        uuid: uuid,
        lobby_code: code
      }
    }).then((skipSuggestionResponse) => {
      const { data: skipSuggestionData, error: skipSuggestionError } = skipSuggestionResponse;

      if (skipSuggestionError) {
        console.error(skipSuggestionError)
        return;
      }

      if (skipSuggestionData) {
        setSkipped(true)
      }
    }).catch((err) => {
      setAlerts([...alerts, {
        variant: 'danger',
        title: 'Skip Suggestion Error',
        desc: 'Error skipping a suggestion! Please try again.'
      }])
      console.error(err)
    })
  }

  function handleAddSuggestion() {
    if (inputValue) {
      addSuggestion({
        variables: { uuid: uuid, lobby_code: code, name: inputValue },
      })
        .then((response) => {
          console.log("ADD SUGGESTION RESPONSE:", response);
          if (response?.errors) console.log(response.errors);
          if (response?.data) {
            setSubmittedSuggestions((prev) => {
              return [...prev, response.data.addSuggestion];
            });
          }
        })
        .catch((err) => {
          setAlerts([...alerts, {
            variant: 'danger',
            title: 'Add Suggestion Error',
            desc: 'Error adding a suggestion! Please try again.'
          }])
          console.error(err)
        });
      setInputValue("");
    }
  }

  // Handler sets the lobby state to VOTING and navigates to the voting page
  const handleStartLobby = () => {
    startLobby({
      variables: {
        lobby_code: code
      }
    }).then((startLobbyResponse) => {
      const { data: startLobbyData, error: startLobbyError } = startLobbyResponse

      if (startLobbyError) console.log(startLobbyError.code, startLobbyError.message)

      if (startLobbyData) {
        navigate('/voting/' + passedState.code, { state: { name, code, uuid } }) 
      }
    }).catch((err) => {
      setAlerts([...alerts, {
        variant: 'danger',
        title: 'Start Lobby Error',
        desc: 'Error starting lobby! Please try again.'
      }])
      console.error(err)
    })
  };

  function RecommendationModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Enter your preferred location or find it on the map!
          </Modal.Title>
        </Modal.Header>
        <ModalBody>
          <div className="autocomplete-control">
            <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
          </div>
        </ModalBody>
        <Modal.Footer>
          <Button 
            onClick={props.onHide}
            variant="secondary"
            size="sm"
            >Close
            </Button>
        </Modal.Footer>
      </Modal>
    );
  }


  // given template from google, minus debouncer

  const PlaceAutocomplete = ({ onPlaceSelect }) => {
    const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
    const inputRef = useRef(null);
    const places = useMapsLibrary("places");
  
    useEffect(() => {
      if (!places || !inputRef.current) return;
  
      const options = {
        fields: ["place_id", "geometry", "name", "formatted_address"],
      };
  
      setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
    }, [places]);

    const handlePlaceChanged = useCallback(() => {
      if (!placeAutocomplete) return;
      onPlaceSelect(placeAutocomplete.getPlace());  
    }, [onPlaceSelect, placeAutocomplete]);

    const debouncedHandlePlaceChanged = useMemo(
      () => debounce(handlePlaceChanged, 400),
      [handlePlaceChanged]
    );

    useEffect(() => {
      if (!placeAutocomplete) return;
  
      const listener = placeAutocomplete.addListener("place_changed", debouncedHandlePlaceChanged);

      return () => {
        window.google.maps.event.removeListener(listener);
      };
    }, [onPlaceSelect, placeAutocomplete]);
    
    return (
      <div className="autocomplete-container">
        <input ref={inputRef} />
      </div>
    );
  };
  
  return (
    <>
        <Toasts alerts={alerts} />
      <div className="container">
        <div className="col-left">
          <div className="logo">
            <Link to={"/"}>
              <Image src={Logo} style={{ width: "100%", height: "100%" }} />
            </Link>
          </div>
          <div className="joined-members-container">
            {users.map((member, index) => (
              <UserSlot
                key={index}
                index={index}
                name={member?.username ? member.username : ""}
              />
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
          {!skipped && <InputField
            buttonLabel="Add Suggestion"
            value={inputValue}
            setValue={setInputValue}
            onClick={handleAddSuggestion}
          />}
          <div className="button-container">
            <Button
              onClick={handleStartLobby}
              disabled={uuid !== ownerID || lobbyState !== 'READY_TO_START'}
              className="ready-button user-view"
              variant="secondary"
              size="lg"
            >
              {lobbyState === 'READY_TO_START' ? "START" : "Waiting for host..."}
            </Button>
            {!skipped && 
              <Button
                disabled={submittedSuggestions.length > 0}
                onClick={handleSkipSuggestion}
                className="ready-button user-view"
                variant="secondary"
                size="lg"
              >
                Skip Suggestion
              </Button>
            }
            {uuid == ownerID &&
              <>
                <Button
                  className="ready-button user-view"
                  variant="secondary"
                  size="lg"
                  onClick={() => setModalShow(true)}
                >
                  Generate Recs
                </Button>
                <RecommendationModal
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                />
              </>
            }
            {/* above, the check for whether the user viewing is host
                        is done by comparing the current user id to that of the host
                        on the DB i.e. (user.id === host.id) ? 'start' : 'waiting for host...')  */}
          </div>
        </div>
        {submittedSuggestions.length > 0 && (
          <div className="suggestions-container">
            <div className="suggestions-header">You Suggested:</div>
            {submittedSuggestions.map((item) => (
              <div key={item.id} className="suggestion-item">{item?.name.toLowerCase()}</div>
            ))}
          </div>
        )}
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
