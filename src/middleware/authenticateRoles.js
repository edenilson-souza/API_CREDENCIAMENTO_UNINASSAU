const knex = require('../config/database');
module.exports = async (token, type) => {  
    const roleValid = await knex('users').where('active', 1).where('id', token.id).where('role', token.role).select(['role']);
    let result = false;
    if (roleValid.length > 0){
        type.forEach(element => {
            if(element == roleValid[0].role){
                result = true;
            }
        });
    }
    return result;
}