import validate from "../middleware/validate.js"
import hashPassword from "../db/methods/hashPassword.js"
import UserModel from "../db/models/UserModel.js"
import {
  emailValidator,
  nameValidator,
  passwordValidator,
} from "../validators.js"

const signUpRoute = ({ app }) => {
  app.post(
    "/sign-up",
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
}

export default signUpRoute
