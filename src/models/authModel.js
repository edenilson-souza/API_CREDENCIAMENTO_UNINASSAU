const knex = require('../config/database');
const Default = require('../repositories/models/default');
const util = require('../repositories/util/util');
const { v4: uuidv4 } = require('uuid');

class Auth extends Default{

    async authenticate({email, password}){
        try{
            const dbemail = await knex('users').where("email", email.toLowerCase()).select('id', 'nome', 'senha', 'ativo');
            if(dbemail[0].wrongpassword > 5){
                return {status: false, message: 'Você excedeu o número de tentativas de login. Entre em contato com o administrador.'};
            }
            if (dbemail.length > 0 && dbemail[0].active == 1) {
                const dbpassword = dbemail[0].password;
                const comparePassword = await util.comparePassword(password, dbpassword);
                if(comparePassword === true){   
                    const idToken = uuidv4();
                    const userId = {id: dbemail[0].id, code: idToken, role: dbemail[0].role};
                    const accessToken = await util.generateToken(userId, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRES_IN ?? '15m');
                    const refreshToken = await util.generateToken(userId, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_EXPIRES_IN ?? '7d');
                    const user = await knex('users').where('active', 1).where('id', dbemail[0].id).update({wrongpassword: 0});         
                    return ({status: true, message: {id: dbemail[0].id, name: dbemail[0].nome, accessToken: accessToken, refreshToken: refreshToken}});
                }
                else{
                    const qualidadedesenhaerrada = dbemail[0].wrongpassword;
                    const user = await knex('users').where('active', 1).where('id', dbemail[0].id).update({wrongpassword: qualidadedesenhaerrada + 1});
                    return {status: false, message: 'E-mail e/ou senha estão incorretos.'};
                }
            } else{
                return {status: false, message:'E-mail e/ou senha estão incorretos.'};
            }  
        }catch(error){
            return {status: false, message: "E-mail e/ou senha estão incorretos."};
        }
    }
    
    async logout(token){
        try{
            const tokenInsert = await knex('tokens').insert({token, created_at: knex.fn.now()});  
            if(tokenInsert.length > 0 || tokenInsert > 0 || tokenInsert.rowCount > 0){         
                return {status: true, message: 'Deslogado com sucesso'};
            }else{
                return {status: false, message: 'Não permitido.'};
            }
        }catch(error){
            return {status: false, message: error.sqlMessage ?? error.message};
        }
    }

    async refreshToken(id, token, role){
        try{
            const tokenInsert = await knex('tokens').insert({token, created_at: knex.fn.now()});  
            if(tokenInsert.length > 0 || tokenInsert > 0 || tokenInsert.rowCount > 0){
                const idToken = uuidv4();

                const userId = {id:id, code:idToken, role: role}
                const accessToken = await util.generateToken(userId, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRES_IN ?? '15m');
                const refreshToken = await util.generateToken(userId, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_EXPIRES_IN ?? '7d');      
                return {status: true, data: {accessToken: accessToken, refreshToken: refreshToken}};
            }else{
                return {status: false, message: 'Erro ao deslogar'};
            }

        }catch(error){
            return {status: false, message: error.sqlMessage ?? error.message};
        }
    } 

    async resetAcesso({email}){
        try{
            const dbemail = await knex('users').where("email", email.toLowerCase()).select('id', 'nome', 'password', 'active', 'role', 'wrongpassword');
            if(dbemail[0].wrongpassword >= 5){
                const user = await knex('users').where('active', 1).where('id', dbemail[0].id).update({wrongpassword: 0});
                return {status: true, message: 'Usuário desbloqueado.'};
            }
        }catch(error){
            return {status: false, message: "Erro ao desbloquear usuário."};
        }
    }

    async alterarPermissao({email, role}){
        try{
            if(role == 'admin' || role == 'editor'){
                const user = await knex('users').where('active', 1).where('email', email.toLowerCase()).update({role: role});
            }else{
                const user = await knex('users').where('active', 1).where('email', email.toLowerCase()).update({role: 'user'});
            }
            return {status: true, message: 'Permissão alterada com sucesso.'};
        }catch(error){
            return {status: false, message: "Erro ao alterar permissão."};
        }
    }

}

module.exports = Auth
