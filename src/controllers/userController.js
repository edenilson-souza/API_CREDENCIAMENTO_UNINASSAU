const authenticateRoles = require('../middleware/authenticateRoles');
const UserValidator = require('./validators/userValidator');
var model = require('../model');
const { validate: uuidValidate } = require('uuid');

module.exports = {

    async create(req, res){
        const data = req.body;

        function apenasNumeros(texto) {
            return texto.replace(/\D/g, '');
        }

        const senha = data.senha;
        if(senha.length < 8){
            res.status(500).json({status: false, message: "Use uma senha com pelo menos 8 caracteres :D"});
        }
        const cpf = apenasNumeros(data.cpf)

        UserValidator.create.validate({...data, cpf}).then(async function () {
            try {
                const userModel = await model.User;
                const userRegistered = await userModel.create({...data});
                if(userRegistered.status){
                    return res.status(200).json({status: true, message: 'Usuário criado com sucesso', data: {email: userRegistered.email, nome: userRegistered.nome, acessToken: userRegistered.acessToken, refreshToken: userRegistered.refreshToken}});
                }else{
                    return res.status(403).json({status: false, message: userRegistered.message, field: userRegistered.field});
                }
            } catch (error) {
                res.status(500).json({status: false, message: error.message});
            }
        }).catch(function (err) {
            res.status(500).json({status: false, message: "Erro ao cadastrar usuário", field: err.path});
        });
    },

    async getUser(req, res){
        // #swagger.tags = ['user']
        // #swagger.description = 'Endpoint para pesquisar um usuário.'

        
        const id = req.tokenData.id;
        UserValidator.id.validate({id}).then(async function () {
            try {
                if (!uuidValidate(id)){
                    return res.status(403).json({status: false, message: 'ID inválido'});
                }
                const userModel = await model.User;
                const user = await userModel.getUser(id);
                if(user.status){
                    return res.status('200').json({status: true, data: user.message});
                }else{
                    return res.status('403').json({status: false, message: user.message});
                }
            } catch (error) {
                return res.status(403).json({status: false, message: error});
            }   
        }).catch(function (err) {
            res.status(500).json({status: false, message: err.errors[0], field: err.path});
        });
        
    },

    /* async updateUser(req, res){
        const roles = await authenticateRoles( req.tokenData, ['user', 'admin', 'editor']);
        if(roles){
            const id = req.tokenData.id;
            const data = req.body;
            UserValidator.update.validate({...data}).then(async function () {
                try {
                    if (!uuidValidate(id)){
                        return res.status(403).json({status: false, message: 'ID inválido'});
                    }
                    const userModel = await model.User;
                    const user = await userModel.updateUser(id, data);
                    if(user.status){
                        return res.status('200').json({status: true, data: user.message});
                    }else{
                        return res.status('403').json({status: false, message: user.message});
                    }
                } catch (error) {
                    throw error;
                }   
            }).catch(function (err) {
                res.status(500).json({status: false, message: err.errors[0], field: err.path});
            });
        }else{
            return res.status(403).json({status: false, message: 'Acesso negado'});
        }
    },

    async deleteUser(req, res){
        const roles = await authenticateRoles( req.tokenData, ['user', 'admin', 'editor']);
        if(roles){
            const id = req.tokenData.id;
            UserValidator.id.validate({id: id}).then(async function () {
                try {
                    if (!uuidValidate(id)){
                        return res.status(403).json({status: false, message: 'ID inválido'});
                    }
                    const userModel = await model.User;
                    const user = await userModel.deleteUser(id);
                    if(user.status){
                        return res.status('200').json({status: true, data: user.message});
                    }else{
                        return res.status('403').json({status: false, message: user.message});
                    }
                } catch (error) {
                    throw error;
                }   
            }).catch(function (err) {
                res.status(500).json({status: false, message: err.errors[0], field: err.path});
            });
        }else{
            return res.status(403).json({status: false, message: 'Acesso negado'});
        }
    },

    async getUsersAll(req, res){
        const roles = await authenticateRoles( req.tokenData, ['admin']);
        if(roles){
            const pagination = req.query.page;
            const userModel = await model.User;
            const users = await userModel.getUsersAll(pagination);
            if(users.status){
                return res.status('200').json({status: true, data: users.message});
            }
            return res.status('403').json({status: false, message: users.message});
        }else{
            return res.status(403).json({status: false, message: 'Acesso negado'});
        }
    },

    async deleteUserById(req, res){
       const roles = await authenticateRoles( req.tokenData, ['admin']);
       if(roles){
           const id = req.params.id;
           UserValidator.id.validate({id: id}).then(async function () {
               try {
                   if (!uuidValidate(id)){
                       return res.status(403).json({status: false, message: 'ID inválido'});
                   }
                   const userModel = await model.User;
                   const user = await userModel.deleteUser(id);
                   if(user.status){
                       return res.status('200').json({status: true, data: user.message});
                   }else{
                       return res.status('403').json({status: false, message: user.message});
                   }
               } catch (error) {
                   throw error;
               }   
           }).catch(function (err) {
               res.status(500).json({status: false, message: err.errors[0], field: err.path});
           });
       }else{
           return res.status(403).json({status: false, message: 'Acesso negado'});
       }
   }, */

}
