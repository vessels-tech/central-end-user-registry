'use strict'

const Db = require('../../db')

exports.getAll = () => {
  return Db.users.find({}, { order: 'number asc' })
}

exports.getByNumber = (number) => {
  return Db.users.find({ number }, { order: 'dfspIdentifier asc' })
}

exports.create = (user) => {
  return Db.users.insert(user)
}
