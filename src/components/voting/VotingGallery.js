import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import { useMutation } from "@apollo/client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { SUBMIT_VOTE } from "../../mutations";
import 'swiper/css';
import '../../assets/css/VotingGallery.css'
import placeholderImage from '../../assets/placeholder.png'

export default function VotingGallery({ pool, uuid, code, alerts, setAlerts }) {
    const [index, setIndex] = useState(0);
    const [swiper, setSwiper] = useState(null)
    const [userVoteResults, setUserVoteResults] = useState([])
    const [isFinishedVoting, setIsFinishedVoting] = useState(false)

    const [submitVote] = useMutation(SUBMIT_VOTE);

    console.log(pool.length, index)
    console.log(typeof (code))

    function handleSubmit(recommendation, vote) {
        if (index === (pool.length - 1)) {
            setIsFinishedVoting(true)
        }
        if (swiper) {
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
                    console.log('successful vote')
                    swiper.slideNext()
                    setUserVoteResults([...userVoteResults,
                    {
                        vote: submitVoteData.submitVote.yes_vote,
                        name: submitVoteData.submitVote.recommendation.name
                    }
                    ])
                }
            }).catch((err) => {
                setAlerts([...alerts, {
                    variant: 'danger',
                    title: 'Vote Submission Error',
                    desc: 'Error submitting a vote! Please try again.'
                }])
                console.error(err)
            })
        }
    };

    console.log(userVoteResults)

    return <div className="full-container">
        <div className="left-container"></div>
        <div className="middle-container">
            <div className="middle-container-1"></div>
            <div

                className="middle-container-2">
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
                            style={{
                                backgroundImage: `url(${placeholderImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center 90%',
                                backgroundRepeat: 'no-repeat',
                                borderRadius: '25px'
                            }}
                            key={recommendation.id}>
                            <div className="swiper-no-swiping swiper-slide-title">{recommendation.name}</div>
                        </SwiperSlide>
                    })}
                </Swiper>
                {isFinishedVoting && (
                    <div className="voting-finished-overlay">
                        <span>Wait for other users to finish voting...</span>
                        {userVoteResults.map((result) => {
                            return <p style={{ display: 'block' }}>You voted {result.vote ? "Yes" : "No"} for {result.name}</p>

                        })}
                    </div>
                )}
            </div>
            <div className="middle-container-3"></div>
        </div>

        <div className="right-container"></div>
        <Button
            className="ready-button user-view yes-button"
            variant="secondary"
            size="lg"
            style={{
                position: 'absolute',
                flex: 0,
                top: '78%',
                right: '53%',
                transform: 'translateY(-50%)',
                zIndex: 1000, // High z-index to ensure it's on top
                height: '5%',
                width: '8%'
            }}
            onClick={() => {
                handleSubmit(pool[index], true)
            }}
        >{"Vote Yes"}  {/* button for testing purposes*/}
        </Button>
        <Button
            className="ready-button user-view vote-no-hover"
            variant="secondary"
            size="lg"
            style={{
                position: 'absolute',
                top: '78%',
                left: '53%',
                flex: 0,
                transform: 'translateY(-50%)',
                zIndex: 1000, // Same high z-index for this button
                height: "5%",
                width: '8%',
                backgroundColor: '#F46F60'
            }}
            onClick={() => { handleSubmit(pool[index], false) }}
        >{"Vote No"}  {/* button for testing purposes*/}
        </Button>
    </div>
};