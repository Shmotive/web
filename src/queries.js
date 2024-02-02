import { gql } from "@apollo/client";

export const DEBUG_GET_USER = gql`
query DEBUG_getUser(
    $uuid: String!
) {
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
        recommendations {
            name
            category
            id
        }
    }
}
`;