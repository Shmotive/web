import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import { config } from 'dotenv';
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
  HttpLink,
} from "@apollo/client"; // GraphQL general setup
import { APIProvider } from '@vis.gl/react-google-maps' // google api setup 
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions"; // subcription setup
import { createClient } from "graphql-ws"; // subscription setup

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_SERVER_ENDPOINT,
});

let activeSocket, timedOut;

const wsLink = new GraphQLWsLink(createClient({ //GQL subscription setup
  url: process.env.REACT_APP_SERVER_ENDPOINT_WSS,
  retryAttempts: Infinity,
  options: {
    reconnect: true,
  },
  shouldRetry: () => true,
  keepAlive: 10000,
  on: {
      connected: (socket) => {
        activeSocket = socket;
      },
      ping: (received) => {
        if (!received)
          // sent
          timedOut = setTimeout(() => {
              if (activeSocket?.readyState === WebSocket?.OPEN)
                  activeSocket?.close(4408, 'Request Timeout');
          }, 5000); // wait 5 seconds for the pong and then close the connection
      },
      pong: (received) => {
          if (received) clearTimeout(timedOut); // pong is received, clear connection close timeout
      },
      reconnected: () => console.log('WS reconnected'),
      disconnected: () => console.log('WS disconnected'),
      error: (error) => console.log('WS error:', error)
  }                       // subscriptions using ws only happen past the landing page,
}));                       // where there's already initialized users with ids

// essentially, every gql operation is handled by the apolloclient instance
// in order to make the client handle queries/mutations with the httplink,
// and subscriptions with the ws link, this function routes the request
// with the appropriate link for the apolloclient

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  // Apollo Client initialization
  link: splitLink,
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <APIProvider
        apiKey={API_KEY}
        solutionChannel="">
        <App />
      </APIProvider>
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
