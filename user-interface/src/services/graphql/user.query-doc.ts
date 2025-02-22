import { gql } from "@apollo/client";
export let LoginUser = gql`
  mutation ($userName: String, $password: String) {
    login(loginModel: { password: $password, userName: $userName }) {
      access_token
    }
  }
`;
export let LogoutUser = gql`
  mutation {
    logout
  }
`;
export let ForgotPasswordUser = gql`
  mutation ($userName: String, $password: String) {
    forgotPassword(forgotModel: { userName: $userName, password: $password }) {
      userName
    }
  }
`;
// export let DeleteUser = gql`
//     mutation ($ids:String[]) {
//       DeleteUsers(deleteUsersIds: { ids: $ids }) {
//         count
//       }
//     }
//   `;
// export let RevertDeleteUser = gql`
//     mutation ($ids:String[]){
//       ReverUsers(deleteUsersIds: { ids: $ids}) {
//         count
//       }
//     }
//   `;
// export let HardDeleteUser = gql`
//     mutation ($ids:String[]) {
//       DeleteUserPermanently(
//         deleteUsersIds: { ids: $ids }
//       ) {
//         count
//       }
//     }
//   `;
// export let ChangeActivationUser = gql`
//     mutation ($ids:String[],state:Boolean){
//       ChangeActivation(ToggleActiveUser: { ids: $ids, state: $state }) {
//         count
//       }
//     }
//   `;
// export let UpdateUserRoles = gql`
//     mutation ($ids:String[],$Roles:String[]){
//       UpdateUserRoles(UpdateRolesToUser: { ids: $ids, roles: $Roles }) {
//         count
//       }
//     }
//   `;
export let GetAllUser = gql`
  query ($queries: PrismaQuery) {
    GetAllUsersWithQuery(queries: $queries) {
      userName
      createDate
      deleteDate
      email
      firstName
      id
      isActive
      isDeleted
      lastName
      revertDate
      phone
      Roles
      updateDate
    }
  }
`;
export let GetOneUser = gql`
  query ($query: PrismaQuery) {
    getUserByQuery(query: $query) {
      Roles
      createDate
      deleteDate
      email
      firstName
      id
      isActive
      isDeleted
      lastName
      password
      phone
      revertDate
      updateDate
      userName
    }
  }
`;
// export let CreateUser = gql`
//   mutation (
//     $email: String
//     $firstName: String
//     $lastName: String
//     $password: String
//     $phone: String
//     $userName: String
//   ) {
//     CreateUser(
//       userModel: {
//         email: $email
//         firstName: $firstName
//         lastName: $lastname
//         password: $password
//         phone: $phone
//         userName: $userName
//       }
//     ) {
//       Roles
//       createDate
//       deleteDate
//       email
//       firstName
//       id
//       isActive
//       isDeleted
//       lastName
//       password
//       phone
//       revertDate
//       updateDate
//       userName
//     }
//   }
// `;
// export let UpdateUser = gql`
//     mutation (
//       $id: String
//       $email: String
//       $firstName: String
//       $lastName: String
//       $password: String
//       $phone: String
//       $userName: String
//       $createDate?: String
//       $updateDate?: String
//       $deleteDate?: String
//       $revertDate?: String
//       $isActive?:String
//       $isDelete?:String
//       $Roles?:String
//     ) {
//       CreateUser(
//         userModel: {
//           id: $id
//           email: $email
//           firstName: $firstName
//           lastName: $lastname
//           password: $password
//           phone: $phone
//           userName: $userName
//           createDate?: $createDate
//           updateDate?: $updateDate
//           deleteDate?: $deleteDate
//           revertDate?: $revertDate
//           isActive?: $isActive
//           isDeleted?: $isDelete
//           Roles?: $Roles
//         }
//       ) {
//         Roles
//         createDate
//         deleteDate
//         email
//         firstName
//         id
//         isActive
//         isDeleted
//         lastName
//         password
//         phone
//         revertDate
//         updateDate
//         userName
//       }
//     }
//   `;

export let IsAuth = gql`
  mutation {
    isAuth
  }
`;
// export let RefreshTokenAuth = gql`
//   mutation {
//     refreshToken {
//       access_token
//       refresh_token
//     }
//   }
// `;
