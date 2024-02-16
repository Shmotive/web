import 'bootstrap/dist/css/bootstrap.min.css';

import React from "react";
import "./App.css";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import Root, { loader as rootLoader } from "./routes/landing";
import LandingPage, { loader as landingLoader } from "./routes/landing";
import LobbyPage, { loader as lobbyLoader } from "./routes/lobby";
import VotingPage, {loader as votingLoader} from './routes/voting';
import ResultsPage, { loader as resultsLoader } from "./routes/results";

const routes = [
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,
  },
  {
    path: "/landing",
    element: <LandingPage />,
    loader: landingLoader,
  },
  {
    path: "/lobby/:id",
    element: <LobbyPage />,
    loader: lobbyLoader,
  },
  {
    path: "/voting/:id",
    element: <VotingPage />,
    loader: votingLoader,
  },
  {
    path: "/results/:id",
    element: <ResultsPage />,
    loader: resultsLoader,
  }
];

const router = createMemoryRouter(routes, {
  initialEntries: ["/"],
});

function App() {
  return <RouterProvider router={router} />;
}

export default App;
