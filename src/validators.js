import yup from "yup"

export const idValidator = yup.number().integer().positive().label("ID")

export const nameValidator = yup
  .string()
  .matches(/^[\p{L} -]+$/u, "Name is invalid")
  .label("Name")

export const emailValidator = yup.string().email().label("E-mail")

export const passwordValidator = yup
  .string()
  .min(8)
  .matches(
    /^(?=.*[\p{Ll}])(?=.*[\p{Lu}])(?=.*[0-9])(?=.*[^0-9\p{Lu}\p{Ll}]).*$/gu,
    "Password must contain at least 1 upper & 1 lower case letters, 1 digit, 1 spe. character"
  )
  .label("Password")

export const phoneNumberValidator = yup.string()

export const stringValidator = yup.string()
