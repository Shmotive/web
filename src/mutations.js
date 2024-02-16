import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation CreateUser($uuid: String!, $username: String!) {
    createUser(uuid: $uuid, username: $username) {
      uuid
      username
      created_at
    }
  }
`;

export const CREATE_LOBBY = gql`
  mutation CreateLobby($uuid: String!) {
    createLobby(uuid: $uuid) {
      lobby_code
    }
  }
`;

export const JOIN_LOBBY = gql`
  mutation JoinLobby($uuid: String!, $lobby_code: String!) {
    joinLobby(uuid: $uuid, lobby_code: $lobby_code) {
      lobby_code
    }
  }
`;

export const ADD_SUGGESTION = gql`
  mutation AddSuggestion($uuid: String!, $lobby_code: String!, $name: String!) {
    addSuggestion(uuid: $uuid, lobby_code: $lobby_code, name: $name) {
      id
      name
      category
      suggested_by {
        username
        uuid
      }
    }
  }
`;

export const START_LOBBY = gql`
mutation startLobby(
    $lobby_code: String!
) {
    startLobby(lobby_code: $lobby_code) {
        lobby_code
        state
    }
}
`;

export const SUBMIT_VOTE = gql`
mutation submitVote(
    $uuid: String!,
    $lobby_code: String!,
    $recommendation_id: String!,
    $vote: Boolean!
) {
    submitVote(uuid: $uuid, lobby_code: $lobby_code, recommendation_id: $recommendation_id, vote: $vote) {
        yes_vote
        recommendation {
            name
        }
    }
}
`;

export const SKIP_SUGGESTION = gql`
mutation skipSuggestion(
    $uuid: String!,
    $lobby_code: String!
) {
  skipSuggestion(uuid: $uuid, lobby_code: $lobby_code) {
    uuid
  }
}
`