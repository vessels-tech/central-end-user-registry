'use strict'

exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('users', (t) => {
    t.increments('id').primary()
    t.string('number', 8).notNullable()
    t.string('dfspIdentifier', 256).notNullable()
    t.timestamp('createdDate').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users')
}
