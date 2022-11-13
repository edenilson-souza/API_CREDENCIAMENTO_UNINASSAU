const options = require('../../knexfile')
const knex = require('knex')(options[process.env.NODE_ENV]);
const signale = require('signale');

knex.raw("SELECT 1").then(() => {
    signale.success(`PostgreSQL Connected`);
})
.catch((e) => {
    signale.error("PostgreSQL not connected");
    console.error(e);
});

module.exports = knex