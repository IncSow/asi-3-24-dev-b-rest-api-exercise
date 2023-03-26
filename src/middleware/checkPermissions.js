import UserModel from "../db/models/UserModel"

export const getUserRole = async (required_permissions, user, req) => {
  const {
    session: {
      user: { id: userId },
    },
  } = req.locals
  const loggedUserRole = await UserModel.query()
    .select("roleId")
    .findOne({ id: userId })

  return loggedUserRole
}
