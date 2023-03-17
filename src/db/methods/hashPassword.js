import { pbkdf2, randomBytes } from "node:crypto"
import { promisify } from "node:util"
import config from "../../config.js"

const pbkdf2Callback = promisify(pbkdf2)

const hashPassword = async (
  password,
  salt = randomBytes(config.security.password.saltlen).toString("hex")
) => [
  (
    await pbkdf2Callback(
      `${password}${config.security.password.pepper}`,
      salt,
      config.security.password.iterations,
      config.security.password.keylen,
      config.security.password.digest
    )
  ).toString("hex"),
  salt,
]

export default hashPassword
