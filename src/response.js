export const notFound = (res, error = "Not found") => {
  res.status(404).send({ error: error })
}
