const Validator = require('../../repositories/http/validator');

const schema = {
    create: Validator.object().shape({
        nome: Validator.string().required(),
        cpf: Validator.string().required().min(11).max(11),
        email: Validator.string().required().email(),
        telefone: Validator.string().required().min(11).max(11),
        senha: Validator.string().required().min(8)
    }),
    id: Validator.object().shape({
        id: Validator.string().required().min(36).max(36),
    }),
    update: Validator.object().shape({
        cod_ies: Validator.number().required(),
        nome: Validator.string().required().min(3).max(25),
        email: Validator.string().required().email(),
        password: Validator.string().required().min(8),
        nickname: Validator.string().required().min(3).max(25),
    }),
} 

module.exports = schema