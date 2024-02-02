import { gql } from "@apollo/client";

export const VOTING_PAGE_SUBSCRIPTION = gql`
subscription subscribeToLobby(
    $lobbyCode: String!,
    $uuid: String!
) {
    subscribeToLobby(lobby_code: $lobbyCode, uuid: $uuid) {
        state
        recommendations {
            category
            id
            name
        }
        lobby_code
        id
    }
}
`;