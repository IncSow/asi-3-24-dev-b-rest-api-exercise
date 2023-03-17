import validate from "../middleware/validate.js"
import UserModel from "../db/models/UserModel.js"
import auth from "../middleware/auth.js"
import bcrypt from "bcryptjs"
import {
  idValidator,
  nameValidator,
  emailValidator,
  passwordValidator,
  phoneNumberValidator,
} from "../validators.js"

const userRoutes = ({ app, db }) => {
  app.get("/users", auth, async (req, res) => {
    const record = UserModel.query().select()

    res.send({ result: record })
  })

  app.get(
    "/users/:userId",
    auth,
    validate({ req: { userId: idValidator.required() } }),
    async (req, res) => {
      const { id } = req.params.userId
      const user = UserModel.query().findOne({ id })

      if (!user) {
        res.status(404).send({ error: "Not Found" })

        return
      }

      res.send({ user })
    }
  )

  app.patch(
    "/users/:userId",
    validate({
      body: {
        firstName: nameValidator,
        lastName: nameValidator,
        email: emailValidator,
        password: passwordValidator,
        phoneNumber: phoneNumberValidator,
      },
      req: {
        userId: idValidator.required(),
      },
    }),
    async (req, res) => {
      const {
        params: { userId },
        body: { firstName, lastName, email, password, phoneNumber },
      } = req
      const salt = 10
      const passwordHash = bcrypt.hashSync(password, salt)
      const [user] = await db("users").where({
        id: userId,
      })

      if (!user) {
        res.status(404).send({ error: "Not Found" })

        return
      }

      await db("users")
        .update({
          ...(firstName ? { firstName } : {}),
          ...(lastName ? { lastName } : {}),
          ...(email ? { email } : {}),
          ...(passwordHash ? { passwordHash } : {}),
          ...(phoneNumber ? { phoneNumber } : {}),
        })
        .where({
          id: userId,
        })
      res.send({
        result: user,
      })
    }
  )

  app.delete(
    "/users/:userId",
    validate({ req: { userId: idValidator.required() } }),
    async (req, res) => {
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
    }
  )
}

export default userRoutes
