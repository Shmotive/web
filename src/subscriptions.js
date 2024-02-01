import { gql } from "@apollo/client";

export const NEW_MESSAGE_SUBSCRIPTION = gql`
  subscription DEBUG_subscription_test {
    DEBUG_subscription_test {
      data
    }
  }
`;

export const LOBBY_PAGE_SUBSCRIPTION = gql`
  subscription subscribeToLobby($lobby_code: String!, $uuid: String!) {
    subscribeToLobby(lobby_code: $lobby_code, uuid: $uuid) {
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
