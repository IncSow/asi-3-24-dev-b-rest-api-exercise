import yup from "yup"

const validate = (validators) => async (req, res, next) => {
  const { body, params, query } = validators

  try {
    ;["body", "params, query"].forEach((key) => {
      if (validators[key] && !req[key]) {
        throw new Error(`Missing req.${key}`)
      }
    })

    req.data = await yup
      .object()
      .shape({
        ...(body ? { body: yup.object().shape(body) } : {}),
        ...(query ? { body: yup.object().shape(query) } : {}),
        ...(params ? { body: yup.object().shape(params) } : {}),
      })
      .validate({
        params: req.params,
        body: req.body,
        query: req.query,
      })
    next()
  } catch (err) {
    res.status(422).send({ error: err.message })
  }
}

export default validate
