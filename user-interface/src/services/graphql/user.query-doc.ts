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
        avatarPath
        createDate
        deleteDate
        email
        id
        isActive
        isDeleted
        nationalCode
        password
        permittedPage
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
      description
      id
      isReadOnly
      link
      name
      parentId
      persianName
      children {
        description
        id
        isReadOnly
        link
        name
        parentId
        persianName
        children {
          description
          id
          isReadOnly
          link
          name
          parentId
          persianName
        }
      }
    }
  }
`;
//#endregion

//#region --------------- GetOneUser ----------------------
export let GetOneUser = gql`
  query ($query: PrismaSingleQuery) {
    getUserByQuery(query: $query) {
      avatarPath
      createDate
      deleteDate
      email
      id
      isActive
      isDeleted
      nationalCode
      password
      permittedPage
      phone
      revertDate
      roles
      updateDate
      userName
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
    $id: String!
    $email: String
    $nationalCode: String
    $phone: String
  ) {
    UpdateUser(
      userModel: {
        id: $id
        email: $email
        nationalCode: $nationalCode
        phone: $phone
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

//#region --------------- getUserInfo ---------------------
export let GetUserInfo = gql`
  query {
    getUserInfo {
      avatarPath
      createDate
      deleteDate
      email
      id
      isActive
      isDeleted
      nationalCode
      password
      permittedPage
      phone
      revertDate
      roles
      updateDate
      userName
    }
  }
`;
//#endregion

//#region ---------------  UpdateUserRoles ----------------
export let UpdateRoles = gql`
  mutation ($ids: [String!]!, $roles: [EnumRoles!]!) {
    UpdateUserRoles(UpdateRolesToUser: { ids: $ids, Roles: $roles }) {
      count
    }
  }
`;
//#endregion

//#region ---------------  CheckWritable ----------------
export let CheckWritable = gql`
  query ($menuName: String!) {
    checkWritable(menuName: $menuName)
  }
`;
//#endregion

//#region ---------------  UpdateUserPagePermission ----------------
export let UpdateUserPagePermissions = gql`
  mutation ($pageIds: [String!], $userId: String!) {
    UpdateUserPagePermission(
      UpdatePagePermissionToUser: { pageIds: $pageIds, userId: $userId }
    ) {
      count
    }
  }
`;
//#endregion

//#region --------------- FileUpload ----------------------
export let UpsertUserAvatar = gql`
  mutation ($file: Upload, $userId: String!) {
    UpsertUserAvatar(fileItem: { file: $file, userId: $userId })
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
