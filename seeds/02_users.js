import hashPassword from "../src/db/methods/hashPassword.js"

const [passwordHash, passwordSalt] = await hashPassword("Passw0rd$")

export const seed = async (knex) => {
  // Deletes ALL existing entries
  // Couldn't find a better way to do it. Seeds are ran all at the same time.
  // It couldn't find my role_id. If possible, find a better way to do that!
  return knex("users").then(function () {
    // Inserts seed entries
    return knex("users").insert([
      {
        first_name: "Lïlo",
        last_name: "Jacques",
        email: "lilo@gmail.com",
        password_hash: passwordHash,
        password_salt: passwordSalt,
        role_id: 3,
      },
    ])
  })
}
