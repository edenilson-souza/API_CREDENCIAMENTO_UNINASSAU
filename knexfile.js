require("dotenv").config();

module.exports = {
  development:{
    debug: true,
    client: 'pg',
    searchPath: process.env.DB_SCHEMA,
    connection: {
      host : process.env.DB_HOST,
      database : process.env.DB_NAME,
      port: process.env.DB_PORT,
      user : process.env.DB_USER,
      password : process.env.DB_PASS,
      //ssl: { rejectUnauthorized: false }        //Para conexão externa ative o SSL
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: `${__dirname}/src/config/migrations`
    },
    seeds: {
      directory: `${__dirname}/src/config/migrations/seeds`
    }
  },
  production:{
    client: 'pg',
    searchPath: process.env.DB_SCHEMA,
    connection: {
      host : process.env.DB_HOST,
      database : process.env.DB_NAME,
      port: process.env.DB_PORT,
      user : process.env.DB_USER,
      password : process.env.DB_PASS,
      ssl: { rejectUnauthorized: false }
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: `${__dirname}/src/config/migrations`
    }
  }
};