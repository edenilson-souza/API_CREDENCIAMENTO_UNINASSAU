const util = require('../../../repositories/util/util');

exports.seed = async function (knex) {
	const email = "admin@admin.com";
	const id = await util.createId("idUser " + email);
	const password = await util.encriptPassword("1234@dmin");
	//return knex('users').del().then(function () {
		return knex('users').insert([
			{
				"id": id,
				"cod_ies": "0",
				"nome": "Administrador",
				"email": email,
				"password": password,
				"nickname": "admin",
				"role": "admin",
			},
		]).then(function () {
			console.log("Users OK");
			return "OK";
		});
	//});
};
