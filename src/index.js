import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
  HttpLink,
} from "@apollo/client"; // GraphQL general setup
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions"; // subcription setup
import { createClient } from "graphql-ws"; // subscription setup

const httpLink = new HttpLink({
  uri: "http://" + process.env.REACT_APP_SERVER_ENDPOINT,
});

const wsLink = new GraphQLWsLink(createClient({ //GQL subscription setup
  url: 'ws://' + process.env.REACT_APP_SERVER_ENDPOINT,
  options: {
    reconnect: true,
  }                       // subscriptions using ws only happen past the landing page,
}));                       // where there's already initialized users with ids

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value

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
      <App />
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
