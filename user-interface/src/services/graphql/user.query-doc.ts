import { gql } from "@apollo/client";

//#region --------------- LoginUser -----------------------
export let LoginUser = gql`
  mutation ($userName: String, $password: String) {
    login(loginModel: { password: $password, userName: $userName }) {
      access_token
    }
  }
`;
//#endregion

//#region --------------- LogoutUser ----------------------
export let LogoutUser = gql`
  mutation {
    logout
  }
`;
//#endregion

//#region --------------- ForgotPasswordUser --------------
export let ForgotPasswordUser = gql`
  mutation ($userName: String, $password: String) {
    forgotPassword(forgotModel: { userName: $userName, password: $password }) {
      userName
    }
  }
`;
//#endregion

//#region --------------- GetAllUser ----------------------
export let GetAllUser = gql`
  query ($queries: PrismaQuery) {
    GetAllUsersWithQuery(queries: $queries) {
      items {
        avatar
        createDate
        deleteDate
        email
        id
        isActive
        isDeleted
        nationalCode
        password
        phone
        revertDate
        roles
        updateDate
        userName
      }
      pageNumber
      pageSize
      totalCount
    }
  }
`;
//#endregion

//#region --------------- GetPages ------------------------
export let GetPages = gql`
  query {
    menu {
      id
      isReadOnly
      link
      name
      parentId
      persianName
      description
      roles
      selfId
    }
  }
`;
//#endregion

//#region --------------- GetOneUser ----------------------
export let GetOneUser = gql`
  query ($query: PrismaQuery) {
    getUserByQuery(query: $query) {
      roles
      createDate
      deleteDate
      email
      id
      isActive
      isDeleted
      nationalCode
      password
      phone
      revertDate
      updateDate
      userName
      avatar
    }
  }
`;
//#endregion

//#region --------------- isAuth --------------------------
export let IsAuth = gql`
  mutation {
    isAuth
  }
`;
//#endregion

//#region --------------- DeleteUser ----------------------
export let DeleteUser = gql`
  mutation ($ids: [String!]!) {
    DeleteUsers(deleteUsersIds: { ids: $ids }) {
      count
    }
  }
`;
//#endregion

//#region --------------- ReverUsers ----------------------
export let RevertDeleteUser = gql`
  mutation ($ids: [String!]!) {
    RevertUsers(deleteUsersIds: { ids: $ids }) {
      count
    }
  }
`;
//#endregion

//#region --------------- CreateUser ----------------------
export let CreateUserItem = gql`
  mutation (
    $email: String!
    $nationalCode: String!
    $password: String!
    $phone: String!
    $userName: String!
  ) {
    CreateUser(
      userModel: {
        email: $email
        nationalCode: $nationalCode
        password: $password
        phone: $phone
        userName: $userName
      }
    ) {
      userName
      roles
      avatar
      createDate
      deleteDate
      email
      id
      isActive
      isDeleted
      nationalCode
      password
      phone
      revertDate
      updateDate
    }
  }
`;
//#endregion

//#region --------------- UpdateUser ----------------------
export let UpdateUserItem = gql`
  mutation (
    $id: String
    $email: String
    $nationalCode: String
    $password: String
    $phone: String
    $userName: String
  ) {
    UpdateUser(
      userModel: {
        id: $id
        email: $email
        nationalCode: $nationalCode
        password: $password
        phone: $phone
        userName: $userName
      }
    ) {
      userName
      roles
      avatar
      createDate
      deleteDate
      email
      id
      isActive
      isDeleted
      nationalCode
      password
      phone
      revertDate
      updateDate
    }
  }
`;

//#endregion

//#region --------------- activationUsers -----------------
export let ChangeActivationUser = gql`
  mutation ($ids: [String!]!, $state: Boolean) {
    ChangeActivation(ToggleActiveUser: { ids: $ids, state: $state }) {
      count
    }
  }
`;
//#endregion

//#region --------------- Roles  -------------------------
export let GetRoles = gql`
  query {
    roles
  }
`;
//#endregion

//#region --------------- hasPermission -------------------
export let HasPermission = gql`
  query {
    hasPermission
  }
`;
//#endregion

// export let HardDeleteUser = gql`
//     mutation ($ids:String[]) {
//       DeleteUserPermanently(
//         deleteUsersIds: { ids: $ids }
//       ) {
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

// export let RefreshTokenAuth = gql`
//   mutation {
//     refreshToken {
//       access_token
//       refresh_token
//     }
//   }
// `;
