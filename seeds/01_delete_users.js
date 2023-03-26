export const seed = async (knex) => {
  // Deletes ALL existing entries
  // Couldn't find a better way to do it. Seeds are ran all at the same time.
  // It couldn't find my role_id. If possible, find a better way to do that!
  return knex("users").del()
}
