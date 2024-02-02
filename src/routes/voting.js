import { Link, useLoaderData, useLocation, useNavigate } from "react-router-dom";
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

    useEffect(() => {
        if (lobbyQueryData) {
            setRecommendationsArray(lobbyQueryData.getLiveLobby.recommendations.map((recommendation) => {
                return recommendation
            }))
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