import { Link, json, useLoaderData, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useSubscription, useQuery } from "@apollo/client";
import { VOTING_PAGE_SUBSCRIPTION } from "../subscriptions";
import VotingGallery from "../components/voting/VotingGallery";
import { GET_LOBBY } from "../queries";
import Toasts from "../components/errors/Toasts";

export default function VotingPage() {
    const location = useLocation();
    const passedState  = location.state;
    const { name, code, uuid } = passedState
    const [recommendationsArray, setRecommendationsArray] = useState([])
    const [subscriptionData, setSubscriptionData] = useState(null)
    const [alerts, setAlerts] = useState([])
    const navigate = useNavigate();

    const { data: lobbyQueryData, loading: lobbyQueryLoading, error: lobbyQueryError } = useQuery(GET_LOBBY, {
         variables: {
            lobby_code: code
        }
    })

    const { data: lobbySubscriptionData, loading: lobbySubscriptionLoading, error: lobbySubscriptionError } = useSubscription(VOTING_PAGE_SUBSCRIPTION, {
        variables: {
            lobbyCode: code,
            uuid: uuid
        }
    });

    // FISHER-YATES SORTING ALGORITHM: PSEUDO-RANDOMLY SHUFFLES ELEMENTS IN AN ARRAY

    function shuffleArray(arr) {
        var i = arr.length, j, temp;
        while(--i > 0){
          j = Math.floor(Math.random()*(i+1));
          temp = {...arr[j]};
          arr[j] = {...arr[i]};
          arr[i] = {...temp};
        }
      }

    useEffect(() => {
        if (lobbyQueryError) {
            setAlerts([...alerts, {
                variant: 'danger',
                title: 'Recommendation Query Error',
                desc: 'Error getting recommendations! Please try again.'
              }])
              console.error(lobbyQueryError)
              return;
        }
        if (lobbyQueryData) {
            // Combine custom and generated recommendation arrays into one array when the component loads 
            console.log(lobbyQueryData.getLiveLobby.custom_recommendations, lobbyQueryData.getLiveLobby.generated_recommendations)
            let combinedArray = lobbyQueryData.getLiveLobby.custom_recommendations.concat(lobbyQueryData.getLiveLobby.generated_recommendations);
            console.log(combinedArray)
            setRecommendationsArray(combinedArray)
        }
        if (lobbySubscriptionError) {
            setAlerts([...alerts, {
                variant: 'danger',
                title: 'Subscription Error',
                desc: 'Error with lobby subscription response! Please try again.'
              }])
              console.error(lobbySubscriptionError)
              return;
        }
        if (lobbySubscriptionData) {
            setSubscriptionData(lobbySubscriptionData)

            // if subscription returns lobby state as results, this indicates that we should navigate to results page
            if (lobbySubscriptionData?.subscribeToLobby.state === 'RESULTS') {
                console.log('a')
                navigate('/results/' + code, { state: { code, uuid } })
            }
        }
    }, [lobbyQueryData, lobbySubscriptionData, lobbySubscriptionError, lobbyQueryError])

    console.log(recommendationsArray, subscriptionData)

    return <div width={'100vw'} height={'100vh'}>
            <Toasts alerts={alerts} />
            <VotingGallery pool={recommendationsArray} uuid={uuid} code={code} alerts={alerts} setAlerts={setAlerts} />
        </div>
}

export async function loader() {
    return null
}