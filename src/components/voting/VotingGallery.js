import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import { useMutation } from "@apollo/client";
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { SUBMIT_VOTE } from "../../mutations";
import 'swiper/css';
import '../../assets/css/VotingGallery.css'

export default function VotingGallery({ pool, uuid, code }) {
    const [index, setIndex] = useState(0);
    const [swiper, setSwiper] = useState(null)
    const [userVoteResults, setUserVoteResults] = useState([])
    const [isFinishedVoting, setIsFinishedVoting] = useState(false)

    const [submitVote, { reset: submitVoteReset }] = useMutation(SUBMIT_VOTE);

    console.log(pool.length, index)
    console.log(typeof(code))
    
    function handleSubmit(recommendation, vote) {
        if (index === (pool.length - 1)) {
            setIsFinishedVoting(true)
        }
        if (swiper) {
            swiper.slideNext()
            submitVote({
                variables: {
                    uuid: uuid,
                    lobby_code: code,
                    recommendation_id: recommendation.id,
                    vote: vote
                }
            }).then((submitVoteResponse) => {
                console.log(submitVoteResponse)
                const { data: submitVoteData, error: submitVoteError } = submitVoteResponse;

                if (submitVoteError) console.log(submitVoteError)

                if (submitVoteData) {
                    setUserVoteResults([...userVoteResults,
                         {
                            vote: submitVoteData.submitVote.yes_vote,
                            name: submitVoteData.submitVote.recommendation.name
                        }
                    ])
                }
            }).catch(err => console.log(err))
        }
    };
    
    console.log(userVoteResults)

    return <div 
                style={{backgroundColor: 'red', height: '100vh', width: '100vw'}}>
                <Swiper
                    noSwiping={true}
                    className="swiper-no-swiping"
                    spaceBetween={50}
                    slidesPerView={1}
                    onSlideChange={(swiper) => setIndex(swiper.activeIndex)}
                    onSwiper={(swiper) => setSwiper(swiper)}
                >
                    {pool.map(recommendation => {
                        return <SwiperSlide 
                                key={recommendation.id}>
                                        <div className="swiper-no-swiping">{recommendation.name}</div>
                                </SwiperSlide>
                    })}  
                </Swiper>
                {isFinishedVoting && (
                <div className="voting-finished-overlay">
                    <span>Wait for other users to finish voting...</span>
                    {userVoteResults.map((result) => {
                        return <p style={{display: 'block'}}>You voted {result.vote ? "Yes" : "No"} for {result.name}</p>

                    })}
                </div>
                )}
                <Button
                    className="ready-button user-view" 
                    variant="secondary"
                    size="lg"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        right: '20px',
                        transform: 'translateY(-50%)',
                        zIndex: 1000, // High z-index to ensure it's on top
                        height: '10%'
                    }} 
                    onClick={() => {
                        handleSubmit(pool[index], true)
                    }}
                    >{"Yes Vote"}  {/* button for testing purposes*/}
                </Button>
                <Button
                    className="ready-button user-view" 
                    variant="secondary"
                    size="lg" 
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '20px',
                        transform: 'translateY(-50%)',
                        zIndex: 1000, // Same high z-index for this button
                        height: "10%"
                    }}
                    onClick={() => {handleSubmit(pool[index], false)}}
                    >{"No Vote"}  {/* button for testing purposes*/}
                </Button>  
        </div> 
};