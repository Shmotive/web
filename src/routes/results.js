import "../assets/css/results.css";
import React, { useEffect, useState } from "react";
import {
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_RESULTS } from "../queries";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Toasts from "../components/errors/Toasts";
import ResultCard from "../components/results/ResultCard";
import ReactConfetti from "react-confetti";

const sample_data = [
  { name: "A longer title", id: "a", category: "DINING" },
  { name: "Vklalkal", id: "b", category: "ACTIVITY" },
  { name: "c", id: "c", category: "CUSTOM" },
  { name: "d", id: "d", category: "ACTIVITY" },
  { name: "e", id: "e", category: "CUSTOM" },
  { name: "f", id: "f", category: "ACTIVITY" },
  { name: "g", id: "g", category: "CUSTOM" },
  { name: "aasdfklj", id: "h", category: "DINING" },
  { name: "basdfasd; aksjdf;laksdj adfkls ", id: "i", category: "ACTIVITY" },
  { name: "c", id: "j", category: "CUSTOM" },
  { name: "d", id: "k", category: "ACTIVITY" },
  { name: "e", id: "not", category: "CUSTOM" },
  { name: "f", id: "l", category: "ACTIVITY" },
  { name: "g", id: "m", category: "CUSTOM" },
];
export default function ResultsPage() {
  const location = useLocation();
  const passedState = location.state;
  const { code, uuid } = passedState;
  const [resultsArray, setResultsArray] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();

  const { data: resultsData, error: resultsError } = useQuery(GET_RESULTS, {
    variables: {
      lobby_code: code,
    },
  });

  useEffect(() => {
    if (resultsData) {
      console.log(resultsData);
      setResultsArray(resultsData.getLiveLobby.picks);
    }
    if (resultsError) {
      setAlerts([
        ...alerts,
        {
          variant: "danger",
          title: "Results Query Error",
          desc: "Error fetching lobby results! Please try again.",
        },
      ]);
      console.error(resultsError);
      return;
    }
  }, [resultsData, resultsError]);

  function handleOnClick() {
    navigate("/landing", { state: { uuid } });
  }

  return (
    <>
      <div className="main-container" style={{}}>
        <ReactConfetti colors={["#f56e60"]} />
        <Button className="homebutton" onClick={handleOnClick}>
          Back to Homepage
        </Button>
        <Toasts alerts={alerts} />
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div className="heading">Lobby Winners</div>
          <div
            style={{ fontSize: "1em", fontWeight: "600", marginTop: "-1em" }}
          >
            Code: {code}
          </div>
        </div>
        {/* Top 3 */}
        <div
          style={{
            display: "flex",
            width: "100%",
            gap: "2em",
            alignItems: "end",
            justifyContent: "center",
            marginBottom: "4em",
          }}
        >
          {resultsArray.slice(0, 3).map((result, idx) => (
            <ResultCard
              name={result.name}
              category={result.category}
              position={idx}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            flexWrap: "wrap",
            gap: "2em",
            alignItems: "start",
            justifyContent: "center",
          }}
        >
          {resultsArray.slice(3).map((result, idx) => (
            <ResultCard
              name={result.name}
              category={result.category}
              position={"other"}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export async function loader() {
  return null;
}
