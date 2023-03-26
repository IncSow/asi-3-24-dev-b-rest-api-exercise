import validate from "../middleware/validate.js"
import UserModel from "../db/models/UserModel.js"
import { auth, isUserAdmin } from "../middleware/auth.js"
import bcrypt from "bcryptjs"
import {
  nameValidator,
  emailValidator,
  passwordValidator,
} from "../validators.js"
import hashPassword from "../db/methods/hashPassword.js"
import { invalidPermissions, notFound } from "../response.js"
import { currentUser } from "../middleware/getCurrentUser.js"
import getCount from "../middleware/getCount.js"

const userRoutes = ({ app, db }) => {
  app.get("/users", auth, async (req, res) => {
    const { limit, page } = req.query
    const query = UserModel.query()
    const record = await query.modify("paginate", limit, page)
    const count = await getCount(query)

    res.send({ meta: count, result: record })
  })

  app.get("/users/:userId", auth, async (req, res) => {
    const { userId } = req.params
    const loggedUser = await currentUser(req)

    if (loggedUser?.id != userId || !isUserAdmin(loggedUser)) {
      invalidPermissions(res)

      return
    }

    const user = await UserModel.query().findById(userId)

    if (!user) {
      notFound(res)

      return
    }

    res.send({ user })
  })

  app.post(
    "/users",
    validate({
      body: {
        last_name: nameValidator.required(),
        email: emailValidator.required(),
        first_name: nameValidator.required(),
        password: passwordValidator.required(),
      },
    }),
    auth,
    async (req, res) => {
      const { email, password, first_name, last_name } = req.body
      const loggedUser = await currentUser(req)

      if (!isUserAdmin(loggedUser)) {
        invalidPermissions(res)

        return
      }

      const user = await UserModel.query().findOne({ email })

      if (user) {
        res.send({ result: "OK" })

        return
      }

      const [passwordHash, passwordSalt] = await hashPassword(password)

      const new_user = await UserModel.query().insertAndFetch({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password_hash: passwordHash,
        password_salt: passwordSalt,
      })

      res.send({ result: new_user })
    }
  )

  app.patch("/users/:userId", auth, async (req, res) => {
    const {
      params: { userId },
      body: { first_name, last_name, email, password },
    } = req
    const salt = 10

    const loggedUser = await currentUser(req)

    if (loggedUser?.id != userId || !isUserAdmin(loggedUser)) {
      invalidPermissions(res)

      return
    }

    const passwordHash = password ? bcrypt.hashSync(password, salt) : null

    const [user] = await db("users").where({
      id: userId,
    })

    if (!user) {
      notFound(res)

      return
    }

    await db("users")
      .update({
        ...(first_name ? { first_name } : {}),
        ...(last_name ? { last_name } : {}),
        ...(email ? { email } : {}),
        ...(passwordHash ? { passwordHash } : {}),
      })
      .where({
        id: userId,
      })
    res.send({
      result: user,
    })
  })

  app.delete("/users/:userId", auth, async (req, res) => {
    const { userId } = req.params

    const loggedUser = await currentUser(req)

    if (loggedUser?.id != userId || !isUserAdmin(loggedUser)) {
      invalidPermissions(res)

      return
    }

    const [user] = await db("users").where({ id: userId })

    if (!user) {
      notFound(res)

      return
    }

    await db("users").delete().where({ id: userId })
    res.send({
      result: user,
    })
  })
}

export default userRoutes
