export const seed = async (knex) => {
  // Deletes ALL existing entries
  // Couldn't find a better way to do it. Seeds are ran all at the same time.
  // It couldn't find my role_id. If possible, find a better way to do that!
  return knex("roles")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("roles").insert([
        {
          id: 1,
          name: "admin",
          permissions: {},
        },
        {
          id: 2,
          name: "manager",
          permissions: {},
        },
        {
          const jwt = jsonwebtoken.sign(
            {
              payload: {
          id: 3,
          name: "editor",
          permissions: {},
        },
      ])
    })
}
