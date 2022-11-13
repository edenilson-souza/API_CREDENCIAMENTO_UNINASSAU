const signale = require('signale');

const auth = require('./models/authModel')
const user = require('./models/userModel');

class Modules {

    async initModels() {
        try {
            await this.initAuth();
            await this.initUser();
            signale.success('Models Started');

        } catch {
            signale.error('Models Not Started');
        }
    }

    async initAuth() {
        this.Auth = new auth();
    }
    async initUser() {
        this.User = new user();
    }
}

module.exports = new Modules();
