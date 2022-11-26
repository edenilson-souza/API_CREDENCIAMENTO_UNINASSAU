const authenticateRoles = require('../middleware/authenticateRoles');
const AuthValidator = require('./validators/authValidator');
var model = require('../model');
const util = require('../repositories/util/util');
//const Mail = require('./../../../services/mail');

module.exports = {

    async auth(req, res){
        // #swagger.tags = ['auth']
        // #swagger.description = 'Endpoint para realizar o login.'
        /* #swagger.parameters['data'] = {
               in: 'body',
               description: 'Informações do usuário.',
               required: true,
               schema: {
                    $email: '',
                    $password: ''
                }
        } */
        const data = req.body;

        const senha = data.senha.replace(/\s/g, '');

        AuthValidator.auth.validate({ ...data, senha}).then(async function (){
            try
            {
                const authModel = await model.Auth;
                const user = await authModel.authenticate({...data, senha});
                if(user.status){
                    res.json({status: true, message: 'Bem-vindo de volta!', data:{ ...user.message, accessToken: user.message.accessToken, refreshToken: user.message.refreshToken}});
                }else{
                    res.status(403).json({status: false, message: user.message}) ;
                }
            }
            catch (error) {
                res.status(500).json({status: false, message: error.message });
            }
        }).catch(function (err){
            res.status(500).json({status: false, message: err.errors[0], field: err.path});
        });
    },

    async logout(req, res){
        // #swagger.tags = ['auth']
        // #swagger.description = 'Endpoint para realizar o logout.'
        const roles = await authenticateRoles( req.tokenData, ['user', 'admin', 'editor']);
        if(roles){
            try{
                const authModel = await model.Auth;
                const token = req.headers['access-token'];
                const result = await authModel.logout(token);
                if (result.status){
                    res.status(200).json({ auth: false, accessToken: null, message: result.message });
                }else{
                    res.status(403).json({status: false, message: result.message});
                }
            }catch (error) {
                return res.status(500).json({status: false, message: error.message});
            }
        }else{
            return res.status(403).json({status: false, message: 'Acesso negado'});
        }
    },

    async refreshToken(req, res){
        // #swagger.tags = ['auth']
        // #swagger.description = 'Endpoint para atualizar o token.'
        /* #swagger.parameters['data'] = {
               in: 'body',
               description: 'Refresh Token.',
               required: true,
               schema: {
                    $refreshToken: '',
                }
        } */
        const roles = await authenticateRoles( req.tokenData, ['user', 'admin', 'editor']);
        if(roles){
            try{
                const tokenRefreshVerified = await util.verifyToken(req.body.refreshToken, process.env.REFRESH_TOKEN_SECRET);
                if(tokenRefreshVerified){
                    if (tokenRefreshVerified.code == req.tokenData.code){
                        const authModel = await model.Auth;
                        const tokenForLogout = req.headers['access-token'];
                        const result = await authModel.refreshToken(req.tokenData.id, tokenForLogout, req.tokenData.role);
                        if (result.status){
                            res.status(200).json({ accessToken: result.data.accessToken, refreshToken: result.data.refreshToken });
                        }
                    }else{
                        res.status(403).json({status: false, message: 'Token de atualização inválido.'});
                    }
                }else{
                    res.status(403).json({status: false, message: 'Token de atualização inválido.'});
                }
            }catch (error) {
                return res.status(500).json({status: false, message: error.message});
            }
        }else{
            return res.status(500).json({status: false, message: 'Acesso negado'});
        }
    },

    async resetAcesso(req, res){
        // #swagger.tags = ['auth']
        // #swagger.description = 'Endpoint para desbloqueio de usuário.'
        /* #swagger.parameters['data'] = {
            in: 'body',
            description: 'Informações do usuário.',
            required: true,
            schema: {
                $email: ''
            }
        } */
        const roles = await authenticateRoles( req.tokenData, ['admin']);
        if(roles){
            AuthValidator.email.validate({...data}).then(async function (){
                try
                {
                    const authModel = await model.Auth;
                    const user = await authModel.resetAcesso(data.email);
                    if(user.status){

                        res.json({status: true, message: user.message});
                    }else{
                        res.status(403).json({status: false, message: user.message}) ;
                    }
                }
                catch (error) {
                    res.status(500).json({status: false, message: error.message });
                }
            }).catch(function (err){
                res.status(500).json({status: false, message: err.errors[0], field: err.path});
            });
        }else{
            return res.status(500).json({status: false, message: 'Acesso negado'});
        }
    },

    async alterarPermissao(req, res){
        // #swagger.tags = ['auth']
        // #swagger.description = 'Endpoint para alterar permissão de usuário.'
        /* #swagger.parameters['data'] = {
            in: 'body',
            description: 'Informações do usuário.',
            required: true,
            schema: {
                $email: '',
                $role: ''
            }
        } */
        const roles = await authenticateRoles( req.tokenData, ['admin']);
        if(roles){
            AuthValidator.alterarPermissao.validate({...data}).then(async function (){
                try
                {
                    const authModel = await model.Auth;
                    const user = await authModel.alterarPermissao(data.email, data.role);
                    if(user.status){
                        res.json({status: true, message: user.message});
                    }else{
                        res.status(403).json({status: false, message: user.message}) ;
                    }
                }
                catch (error) {
                    res.status(500).json({status: false, message: error.message });
                }
            }).catch(function (err){
                res.status(500).json({status: false, message: err.errors[0], field: err.path});
            });
        }else{
            return res.status(500).json({status: false, message: 'Acesso negado'});
        }
    },

    checkToken(req, res){
        // #swagger.tags = ['auth']
        // #swagger.description = 'Endpoint para verificar o token.'
        const roles = authenticateRoles( req.tokenData, ['user', 'admin', 'editor']);
        if(roles){
            res.status(200).json({ auth: true, accessToken: req.tokenData });
        }
        else{
            res.status(403).json({status: false, message: 'Acesso negado'});
        }
    }
}
