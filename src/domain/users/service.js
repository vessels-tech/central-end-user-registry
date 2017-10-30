'use strict'

const Repo = require('./repo')
const AlreadyExistsError = require('../../errors/already-exists-error')

const register = (payload) => {
  return getByNumber(payload.number)
    .then(existing => {
      let duplicate = existing.find(f => f.dfspIdentifier === payload.dfspIdentifier)
      if (duplicate) {
        throw new AlreadyExistsError('The number has already been registered for this DFSP')
      }
      return Repo.create({ dfspIdentifier: payload.dfspIdentifier, number: payload.number })
    })
}

const getAll = () => {
  return Repo.getAll()
}

const getByNumber = (number) => {
  return Repo.getByNumber(number)
}

module.exports = {
  register,
  getAll,
  getByNumber
}
