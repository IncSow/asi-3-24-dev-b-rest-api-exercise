import UserModel from "../db/models/UserModel.js"

export const currentUser = async (req) => {
  if (!req.locals) {
    return
  }

  const {
    user: { id: userId },
  } = req.locals

  const logged_user = await UserModel.query()
    .findById(userId)
    .withGraphFetched("role")

  return logged_user
}
