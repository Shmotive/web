import React from 'react';
import './App.css';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import Root , {loader as rootLoader} from './routes/root';
import LoginPage, {loader as loginLoader} from './routes/login';
import LobbyPage, {loader as lobbyLoader} from './routes/lobby';

const routes = [
  {
    path: "/",
    element: <Root/>,
    loader: rootLoader,
  },
  {
    path: "/login",
    element: <LoginPage />,
    loader: loginLoader,
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
