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

    // PSEUDO-RANDOMLY SHUFFLES ELEMENTS IN AN ARRAY
    // this happens every time there's a change in subscription data. Bad.

    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
        }
        return;
    }

    // Splitting the query and subscription updates into two useEffects:
    //
    // we only want shuffling to happen once when the voting stage begins (on component mount),
    // not every time there is some update to the data.
    // 
    // Before, both the querydata and the subscriptiondata were in the same 
    // dependency array for one useeffect, meaning that the useEffect would trigger every time
    // there was an update to either. On each call to the contents of the useEffect, the shuffling would
    // occur because the querydata was still defined from the beginning meaning that it would go into the
    // lobbyquerydata code block and shuffle. 

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
            console.log(combinedArray);
            shuffleArray(combinedArray);
            setRecommendationsArray(combinedArray);
        }
    }, [lobbyQueryData, lobbyQueryError])

    useEffect(() => {
        // if (lobbyQueryError) {
        //     setAlerts([...alerts, {
        //         variant: 'danger',
        //         title: 'Recommendation Query Error',
        //         desc: 'Error getting recommendations! Please try again.'
        //       }])
        //       console.error(lobbyQueryError)
        //       return;
        // }
        // if (lobbyQueryData) {
        //     // Combine custom and generated recommendation arrays into one array when the component loads 
        //     console.log(lobbyQueryData.getLiveLobby.custom_recommendations, lobbyQueryData.getLiveLobby.generated_recommendations)
        //     let combinedArray = lobbyQueryData.getLiveLobby.custom_recommendations.concat(lobbyQueryData.getLiveLobby.generated_recommendations);
        //     console.log(combinedArray);
        //     setRecommendationsArray(combinedArray);
        // }
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
    }, [lobbySubscriptionData, lobbySubscriptionError])

    console.log(recommendationsArray, subscriptionData)

    return <div width={'100vw'} height={'100vh'}>
            <Toasts alerts={alerts} />
            <VotingGallery pool={recommendationsArray} uuid={uuid} code={code} alerts={alerts} setAlerts={setAlerts} />
        </div>
}

export async function loader() {
    return null
}