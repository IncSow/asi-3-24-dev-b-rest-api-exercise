import hashPassword from "../src/db/methods/hashPassword.js"

const [passwordHash, passwordSalt] = await hashPassword("password")

export const seed = async (knex) => {
  // Deletes ALL existing entries
  // Couldn't find a better way to do it. Seeds are ran all at the same time.
  // It couldn't find my role_id. If possible, find a better way to do that!
  return [
    knex("users").del(),
    knex("roles")
      .del()
      .then(function () {
        // Inserts seed entries
        return knex("roles").insert([
          {
            name: "admin",
            permissions: {},
          },
          {
            name: "editor",
            permissions: {},
          },
        ])
      }),
    knex("users").then(function () {
      // Inserts seed entries
      return knex("users").insert([
        {
          first_name: "Lïlo",
          last_name: "Jacques",
          email: "nigel@email.com",
          password_hash: passwordHash,
          password_salt: passwordSalt,
          role_id: 1,
        },
      ])
    }),
  ]
}
