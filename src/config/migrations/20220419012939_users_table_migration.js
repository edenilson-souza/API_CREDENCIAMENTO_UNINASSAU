exports.up = async function(knex) {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await knex.schema
        .createTable('tipo_usuario', function (table) {
            table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()')).unsigned().notNullable();
            table.string('tipo', 50).notNullable().defaultTo('externo');
            table.boolean('ativo').defaultTo('true').notNullable();
            table.timestamp('criado_em').defaultTo(knex.fn.now());
            table.timestamp('atualizado_em').defaultTo(knex.fn.now());
        })

    return knex.schema
        .createTable('usuario', function (table) {
            table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));     
     
            table.string('nome', 80).notNullable();
            table.string('cpf', 11).notNullable();
            table.string('email', 50).notNullable();
            table.string('telefone', 11).notNullable();
            table.text('senha').notNullable();
            table.uuid('id_tipo_usuario').unsigned().notNullable();   
            table.boolean('ativo').defaultTo('true').notNullable();
            table.timestamp('criado_em').defaultTo(knex.fn.now());
            table.timestamp('atualizado_em').defaultTo(knex.fn.now());
            table.timestamp('ultimo_acesso_em').defaultTo(knex.fn.now());

            table.foreign('id_tipo_usuario').references('id').inTable('tipo_usuario');
        })
};

exports.down = async function(knex) {
    await knex.schema.dropTable("tipo_usuario");
    return knex.schema.dropTable("usuario");
};
