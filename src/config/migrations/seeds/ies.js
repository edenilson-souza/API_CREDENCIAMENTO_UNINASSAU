exports.seed = function(knex) {
    //return knex('ies').del().then(function() {
		return knex('ies').insert(
            {
				"cod_ies": 0,
				"nome": "ADMIN",
				"sigla": "ADMIN",
				"mantenedora": 0,
				"tipo_categoria_administrativa": 0,
				"tipo_organizacao_academica": 0,
                "cod_uf": 0,
                "cod_municipio": 0,
			},
        ).then(function() {
            console.log("IES OK");
			return "OK";
      	});
    //});
}
