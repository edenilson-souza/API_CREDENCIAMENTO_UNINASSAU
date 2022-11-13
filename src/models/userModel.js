const knex = require('../config/database');
const Default = require('../repositories/models/default');
const util = require('../repositories/util/util');
const { v4: uuidv4 } = require('uuid');
const Mail = require('../repositories/services/mail');

class User extends Default{
    
    async create(data){
        try {

            const email = data.email.toLowerCase();
            const telefone = data.telefone;
            const cpf = data.cpf;
            const wasRegistered = await knex('usuario').where('email', email).orWhere('telefone', telefone).orWhere("cpf", cpf).select(['email', "telefone"]);
            
            if(wasRegistered.length > 0){
                return {status: false, message: 'Já registrado', field: 'email, telefone ou cpf'};
            }else{
                const id = await util.createId("idUser "+ email);
                const senha = await util.encriptPassword(data.senha);
                const user = await knex('usuario').insert({...data, id, email, senha}).then(() => {return knex ('usuario').where('email', email).select('id', 'email', 'nome', 'ativo')});
                if(user.length > 0){
                    
                    const code = uuidv4();
                    const userId = {id: user[0].id, nome: user[0].nome, code: code, role: user[0].role};
                    const acessToken = await util.generateToken(userId, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRES_IN ?? '15m');
                    const refreshToken = await util.generateToken(userId, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_EXPIRES_IN ?? '7d');
                    
                    return {status: true, email: user[0].email, name: user[0].nome, acessToken, refreshToken};
                }else{
                    return {status: false, message: 'Usuário não foi cadastrado'};
                }
            }
        } catch (error) {
            console.log(error);
            return {status: false, message: "Erro ao cadastrar usuário"};
        }
    }

    async getUser(id){
        try {
            const user = await knex('usuario').where('ativo', 1).where('id', id).select(['id', 'email', 'nome', 'ultimo_acesso_em']);
            if(user.length > 0){
                await util.updateLastLogin(user[0].id);
                return {status: true, message: user[0]};
            }else{
                return {status: false, message: 'Usuário não encontrado'};
            }
        } catch (error) {
            return {status: false, message: error.sqlMessage ?? error.message};
        }
    }
    
    /* async updateUser(id, data){
        try {
            const user = await knex('users').where('active', 1).where('id', id).update(data);
            if(user){
                return {status: true, message: 'Usuário atualizado com sucesso'};
            }else{
                return {status: false, message: 'Usuário não encontrado'};
            }
        } catch (error) {
            return {status: false, message: error.sqlMessage ?? error.message};
        }
    }

    async deleteUser(id){
        try {
            const user = await knex('users').where('active', 1).where('id', id).update({active: 0});
            if(user){
                return {status: true, message: 'Usuário deletado com sucesso'};
            }else{
                return {status: false, message: 'Usuário não encontrado'};
            }
        } catch (error) {
            return {status: false, message: error.sqlMessage ?? error.message};
        }
    }

    async getUsersAll(page){
        try {
            const users = await knex('users').select(['id', 'email', 'nome', 'nickname', 'active', 'lastAcess_at']).orderBy('nome', 'asc').limit(10).offset((page - 1) * 10);
            if(users.length > 0){
                return {status: true, message: users};
            }else{
                return {status: false, message: 'Nenhum usuário encontrado'};
            }
        } catch (error) {
            return {status: false, message: error.sqlMessage ?? error.message};
        }
    } */
}

module.exports = User