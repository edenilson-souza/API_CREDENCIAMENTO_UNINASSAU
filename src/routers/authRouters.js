const express = require('express');

const AuthenticateToken = require('../middleware/authenticateToken');
const AuthController = require('../controllers/authController');

class authRouter {
    static getRouter() {

        const Router = express.Router();
        Router.post('/login', AuthController.auth);                                                                 //AUTHENTICATE USER
        Router.post('/logout', AuthenticateToken, AuthController.logout);                                           //LOGOUT USER
        Router.post('/refreshToken', AuthenticateToken, AuthController.refreshToken);                               //REFRESH TOKEN
        Router.post('/resetAcesso', AuthenticateToken, AuthController.resetAcesso)                                  //RESET ACESSO
        Router.post('/alterarPermissao', AuthenticateToken, AuthController.alterarPermissao)                        //ALTERAR PERMISSAO
        Router.post('/checkToken', AuthenticateToken, AuthController.checkToken)                                    //CHECK TOKEN'S VALIDITY

        return Router;
    }
}

module.exports = authRouter.getRouter();
