export const notFound = (res, error = "Not found") => {
  res.status(404).send({ error: error })
}

export const invalidPermissions = (res, error = "Invalid permissions!") => {
  res.status(401).send({ error: error })
}
