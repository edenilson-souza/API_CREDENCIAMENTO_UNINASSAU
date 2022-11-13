const express = require('express');

const AuthenticateToken = require('../middleware/authenticateToken');
const UsersController = require('../controllers/userController');

class userRouter {
    static getRouter() {

        const Router = express.Router();
    
        Router.post('/register', UsersController.create);
        Router.get('/get', AuthenticateToken, UsersController.getUser);
   /*      Router.post('/update', AuthenticateToken, UsersController.updateUser);
        Router.post('/delete', AuthenticateToken, UsersController.deleteUser);
        Router.get('/getAll', AuthenticateToken, UsersController.getUsersAll);
        Router.post('/deleteUserById/:id', AuthenticateToken, UsersController.deleteUserById); */
                    
        return Router;
    }
}

module.exports = userRouter.getRouter();
