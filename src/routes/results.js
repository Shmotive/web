import React, { useEffect, useState } from "react";
import { Link, useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_RESULTS } from "../queries";
// import { Badge, ListGroup, ListGroupItem } from "react-bootstrap";
import Badge from "react-bootstrap/Badge"
import ListGroup from "react-bootstrap/ListGroup";

export default function ResultsPage() {
    const location = useLocation();
    const passedState  = location.state;
    const { code, uuid } = passedState;
    const [resultsArray, setResultsArray] = useState([])
    
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
            console.error(resultsError);
            return;
        }
    }, [resultsData, resultsError])

    return <>
        <ListGroup as="ol" numbered variant="dark">
            {resultsArray.map((result) => {
                return <ListGroup.Item 
                            as='li'
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
            })}
        </ListGroup>
    </>
}

export async function loader() {
    return null
}