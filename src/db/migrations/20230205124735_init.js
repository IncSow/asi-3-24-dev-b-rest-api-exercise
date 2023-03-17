export const up = async (knex) => {
  await knex.schema.createTable("roles", (table) => {
    table.increments("id")
    table.text("name").notNullable()
    table.json("permissions").notNullable()
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable("users", (table) => {
    table.increments("id")
    table.text("first_name").notNullable()
    table.text("last_name").notNullable()
    table.text("email").notNullable().unique()
    table.text("password_hash").notNullable()
    table.text("password_salt").notNullable()
    table.integer("role_id").references("id").inTable("roles")
  })

  await knex.schema.createTable("pages", (table) => {
    table.increments("id")
    table.text("title").notNullable()
    table.text("content").notNullable()
    table.text("url_slug").notNullable().unique()
    table.integer("user_id").references("id").inTable("users")
    table.json("edited_by")
    table.timestamps(true, true, true)
    table.boolean("status")
  })

  await knex.schema.createTable("navigation_menus", (table) => {
    table.increments("id")
    table.text("name").notNullable()
    table.json("hierarchical")
  })

  await knex.schema.createTable("forms", (table) => {
    table.increments("id")
    table.text("name").notNullable()
  })

  await knex.schema.createTable("fields", (table) => {
    table.increments("id")
    table.text("type").notNullable()
    table.text("options")
    table.text("label").notNullable()
    table.text("default_value")
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("roles")
  await knex.schema.dropTable("users")
  await knex.schema.dropTable("pages")
  await knex.schema.dropTable("navigation_menus")
  await knex.schema.dropTable("forms")
  await knex.schema.dropTable("fields")
}
