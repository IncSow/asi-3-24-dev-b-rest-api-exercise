import jsonwebtoken from "jsonwebtoken"
import config from "../config.js"

export const softAuth = (req, res, next) => {
  if (req.headers.authorization) {
    auth(req, res, next)
  } else {
    next()
  }
}

export const auth = (req, res, next) => {
  const jwt = req.headers.authorization?.slice(7)

  try {
    const { payload } = jsonwebtoken.verify(jwt, config.security.jwt.secret)
    req.locals = payload

    next()
  } catch (err) {
    if (err instanceof jsonwebtoken.JsonWebTokenError) {
      res
        .status(403)
        .send({ error: "You must be logged in to access this ressource." })

      return
    }

    res.status(500).send({ error: "Oops. Something went wrong." })

    return
  }
}

export const isUserAdmin = (user) => user.role?.name === "admin"

export const isUserManager = (user) => user.role?.name === "manager"
