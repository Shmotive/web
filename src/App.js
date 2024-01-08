import React from 'react';
import './App.css';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import Root , {loader as rootLoader} from './routes/landing';
import LandingPage, {loader as landingLoader} from './routes/landing';
import LobbyPage, {loader as lobbyLoader} from './routes/lobby';

const routes = [
  {
    path: "/",
    element: <Root/>,
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
];

const router = createMemoryRouter(routes, {
  initialEntries: ["/"]
});

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
