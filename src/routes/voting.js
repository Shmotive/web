import { Link, json, useLoaderData, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useSubscription, useQuery } from "@apollo/client";
import { VOTING_PAGE_SUBSCRIPTION } from "../subscriptions";
import VotingGallery from "../components/voting/VotingGallery";
import { GET_LOBBY } from "../queries";

export default function VotingPage() {
    const location = useLocation();
    const passedState  = location.state;
    const { name, code, uuid } = passedState
    const [recommendationsArray, setRecommendationsArray] = useState([])
    const [subscriptionData, setSubscriptionData] = useState(null)
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

    if (subscriptionData && subscriptionData.subscribeToLobby.state === 'RESULTS') {
        navigate('/results/' + code,)
    }

    // FISHER-YATES SORTING ALGORITHM: PSEUDO-RANDOMLY SHUFFLES ELEMENTS IN AN ARRAY

    function shuffleArray(arr) {
        var i = arr.length, j, temp;
        while(--i > 0){
          j = Math.floor(Math.random()*(i+1));
          temp = arr[j];
          arr[j] = arr[i];
          arr[i] = temp;
        }
      }

    useEffect(() => {
        if (lobbyQueryData) {
            // Combine custom and generated recommendation arrays iCAtbaLMEcGfD6NOmU75GvGse5a22nto one array when the component loads 
            console.log(lobbyQueryData.getLiveLobby.custom_recommendations, lobbyQueryData.getLiveLobby.generated_recommendations)
            let combinedArray = lobbyQueryData.getLiveLobby.custom_recommendations.concat(lobbyQueryData.getLiveLobby.generated_recommendations);
            console.log(combinedArray)
            // let shuffled = JSON.parse(JSON.stringify(combinedArray))
            // shuffleArray(shuffled)
            console.log(combinedArray)
            setRecommendationsArray(combinedArray)
        }
        if (lobbySubscriptionData) {
            setSubscriptionData(lobbySubscriptionData)
        }
    }, [lobbyQueryData, lobbySubscriptionData])

    console.log(recommendationsArray, subscriptionData)

    return <div width={'100vw'} height={'100vh'}> 
    <VotingGallery pool={recommendationsArray} uuid={uuid} code={code} />
    
    </div>
}

export async function loader() {
    return null
}