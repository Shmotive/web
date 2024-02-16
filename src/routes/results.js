import '../assets/css/results.css';
import React, { useEffect, useState } from "react";
import { Link, useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_RESULTS } from "../queries";
import Badge from "react-bootstrap/Badge"
import Button from "react-bootstrap/Button"
import ListGroup from "react-bootstrap/ListGroup";
import Toasts from "../components/errors/Toasts";

export default function ResultsPage() {
    const location = useLocation();
    const passedState  = location.state;
    const { code, uuid } = passedState;
    const [resultsArray, setResultsArray] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const navigate = useNavigate();
    
    const { data: resultsData, error: resultsError } = useQuery(GET_RESULTS, {
        variables: {
            lobby_code: code
        }
    })
    
    useEffect(() => {
        if (resultsData) {
            console.log(resultsData);
            setResultsArray(resultsData.getLiveLobby.picks);
        }
        if (resultsError) {
            setAlerts([...alerts, {
                variant: 'danger',
                title: 'Results Query Error',
                desc: 'Error fetching lobby results! Please try again.'
              }])
            console.error(resultsError);
            return;
        }
    }, [resultsData, resultsError])

    function handleOnClick() {
        navigate('/landing', { state: { uuid } })
    }

    return <>
        <div className='main-container'>
            <Button className='homebutton' 
                    variant='danger'
                    onClick={handleOnClick}>
                        Back to Homepage
            </Button> 
            <Toasts alerts={alerts} />
            <div className='heading'>
                 Results for lobby {code}: 
            </div>
            <div className="list-group">
                <ListGroup 
                    as="ol" numbered>
                    {resultsArray?.map((result, idx) => {
                        
                        if (idx < 3) {
                            return <ListGroup.Item 
                                        as='li'
                                        variant="success"
                                        className="d-flex justify-content-between align-items-start"
                                        key={result.id}>
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold">
                                                {result.name}
                                            </div>
                                            {result.category}
                                        </div>
                                        <Badge bg="primary" pill>
                                            x votes
                                        </Badge>
                                    </ListGroup.Item>
                        } else {
                            return <ListGroup.Item 
                                        as='li'
                                        variant="dark"
                                        className="d-flex justify-content-between align-items-start"
                                        key={result.id}>
                                        <div className="ms-2 me-auto">
                                            <div className="fw-bold">
                                                {result.name}
                                            </div>
                                            {result.category}
                                        </div>
                                        <Badge bg="primary" pill>
                                            x votes
                                        </Badge>
                                    </ListGroup.Item>
                        }
                    })}
                </ListGroup>
            </div>
        </div>
    </>
}

export async function loader() {
    return null
}