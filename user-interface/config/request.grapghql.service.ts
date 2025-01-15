import { gql } from "@apollo/client";
export const UserServiceGraphql = {
  Login: gql`
    mutation ($userName: String, $password: String) {
      login(loginModel: { username: $userName, password: $password }) {
        access_token
      }
    }
  `,
};
