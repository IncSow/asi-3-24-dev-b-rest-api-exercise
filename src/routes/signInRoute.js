import UserModel from "../db/models/UserModel.js"
import validate from "../middleware/validate.js"
import config from "../config.js"
import jsonwebtoken from "jsonwebtoken"
import { emailValidator, stringValidator } from "../validators.js"

const signInRoute = ({ app }) => {
  app.post(
    "/sign-in",
    validate({
      body: {
        email: emailValidator.required(),
        password: stringValidator.required(),
      },
    }),
    async (req, res) => {
      const { email, password } = req.body
      const user = await UserModel.query().findOne({ email })


      if (!user || !(await user.checkPassword(password))) {
        res.status(401).send({ error: "Invalid credentials" })

        return
      }

      const jwt = jsonwebtoken.sign(
        {
          payload: {
            user: {
              id: user.id,
            },
          },
        },
        config.security.jwt.secret,
        { expiresIn: config.security.jwt.expiresIn }
      )

      res.send({ result: jwt })
    }
  )
}

export default signInRoute
