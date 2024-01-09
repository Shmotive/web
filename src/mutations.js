import { gql } from '@apollo/client';


export const CREATE_USER = gql` 
mutation CreateUser(
    $uuid: String!,
    $username: String!
) {
    createUser(uuid: $uuid, username: $username) {
        uuid
        username
        created_at
    }
}
`;

export const CREATE_LOBBY = gql`
mutation CreateLobby(
    $uuid: String!
) {
    createLobby(uuid: $uuid) {
        lobby_code	
    }
}
`;

export const JOIN_LOBBY = gql`
mutation JoinLobby(
    $uuid: String!,
    $lobby_code: String!
) {
    joinLobby(uuid: $uuid, lobby_code: $lobby_code) {
        lobby_code	
    }
}
`;
