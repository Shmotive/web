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