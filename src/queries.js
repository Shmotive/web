import { gql } from "@apollo/client";

export const DEBUG_GET_USER = gql`
  query DEBUG_getUser($uuid: String!) {
    DEBUG_getUser(uuid: $uuid) {
      uuid
      username
    }
} 
`;

export const GET_LOBBY = gql`
query getLiveLobby(
    $lobby_code: String!
) {
    getLiveLobby(lobby_code: $lobby_code) {
      custom_recommendations {
        name
        category
        id
      }
      generated_recommendations {
        name
        category
        id
      }
    }
}
`;

export const GET_LOBBY_USERS = gql`
  query getLobbyUsers($lobby_code: String!) {
    getLiveLobby(lobby_code: $lobby_code) {
      owner {
        uuid
        username
      }
      state
      participants {
        uuid
        username
      }
    }
  }
`;

export const GET_RESULTS = gql`
query getResults(
  $lobby_code: String!
) {
  getLiveLobby(lobby_code: $lobby_code) {
    state
    picks {
      name
      category
      id
    }
  }
}
`
