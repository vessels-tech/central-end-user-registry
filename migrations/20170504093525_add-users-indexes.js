'use strict'

exports.up = function(knex, Promise) {
  return knex.schema.table('users', (t) => {
    t.index('number')
    t.unique(['number', 'dfspIdentifier'])
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.table('users', (t) => {
    t.dropIndex('number')
    t.dropUnique(['number', 'dfspIdentifier'])
  })
}
