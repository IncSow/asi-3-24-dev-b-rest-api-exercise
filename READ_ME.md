Database : postgreSQL

How to use on mac :

brew install postgresql # install postgresql
brew services start postgresql # start postgresql server
psql postgres # connect to the server

Migrations : Knex

run `npx knex migrate:latest` to execute the last migration on the db from src/db/migrations

Launch the server with this command : DEBUG=myapp:\* npm start
