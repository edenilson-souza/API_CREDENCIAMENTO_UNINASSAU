const Validator = require('../../repositories/http/validator')

const schema = {
    auth: Validator.object().shape({
        email: Validator.string().email().required(),
        senha: Validator.string().required().min(8)
    }),
    email: Validator.object().shape({
        email: Validator.string().required().email()
    }),
    alterarPermissao: Validator.object().shape({
        email: Validator.string().required().email(),
        role: Validator.string().required().min(4).max(6)
    }),
}

module.exports = schema
