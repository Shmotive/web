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

export const CREATE_LOBBY_GET_CODE = gql`
mutation CreateLobbyAndGetCode(
    $uuid: String!
) {
    createLobbyAndGetCode(uuid: $uuid) {
        code	
    }
}
`;

export const JOIN_LOBBY = gql`
mutation JoinLobby(
    $uuid: String!,
    $code: String!
) {
    joinLobby(uuid: $uuid, code: $code) {
        code	
    }
}
`;
