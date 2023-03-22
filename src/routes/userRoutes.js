import validate from "../middleware/validate.js"
import UserModel from "../db/models/UserModel.js"
import auth from "../middleware/auth.js"
import bcrypt from "bcryptjs"
import {
  nameValidator,
  emailValidator,
  passwordValidator,
} from "../validators.js"

const userRoutes = ({ app, db }) => {
  app.get("/users", async (req, res) => {
    const record = UserModel.query().select()

    res.send({ result: record })
  })

  app.get("/users/:userId", async (req, res) => {
    const { userId } = req.params
    const user = await UserModel.query().findById(userId)

    if (!user) {
      res.status(404).send({ error: "Not Found" })

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
    async (req, res) => {
      const { email, password, first_name, last_name } = req.body
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
        role_id: 1,
      })

      res.send({ result: new_user })
    }
  )

  app.patch("/users/:userId", async (req, res) => {
    const {
      params: { userId },
      body: { first_name, last_name, email, password },
    } = req
    const salt = 10

    const passwordHash = password ? bcrypt.hashSync(password, salt) : null

    const [user] = await db("users").where({
      id: userId,
    })

    if (!user) {
      res.status(404).send({ error: "Not Found" })

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

  app.delete("/users/:userId", async (req, res) => {
    const { userId } = req.params
    const [user] = await db("users").where({ id: userId })

    if (!user) {
      res.status(404).send({ error: "Not Found" })

      return
    }

    await db("users").delete().where({ id: userId })
    res.send({
      result: user,
    })
  })
}

export default userRoutes
