import { resolve } from "node:path"
import { config } from "dotenv"
config()

const knexfile = {
  client: process.env.DB__CLIENT,
  connection: {
    host: process.env.DB__HOST,
    port: process.env.DB__PORT,
    user: process.env.DB__USER,
    password: process.env.DB__PASSWORD,
    database: process.env.DB__DATABASE,
  },
  migrations: {
    directory: resolve("src/db/migrations"),
    stub: resolve("src/db/migration.stub"),
  },
}

export default knexfile
