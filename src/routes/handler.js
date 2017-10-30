'use strict'

const Service = require('../domain/users/service')
const NotFoundError = require('@mojaloop/central-services-shared').NotFoundError

const usersResponse = (users) => {
  if (!users || users.length === 0) {
    throw new NotFoundError('The requested number does not exist')
  }
  return users.map(userResponse)
}

const userResponse = (user) => {
  return {
    number: user.number,
    dfspIdentifier: user.dfspIdentifier
  }
}

const getUsers = (req, rep) => {
  return Service.getAll()
    .then(users => rep(usersResponse(users)))
}

const getUserByNumber = (req, rep) => {
  return Service.getByNumber(req.params.number)
    .then(users => rep(usersResponse(users)))
    .catch(rep)
}

const registerIdentifier = (req, rep) => {
  return Service.register(req.payload)
    .then(user => rep(userResponse(user)).code(201))
    .catch(rep)
}

const health = (req, rep) => {
  return rep({ status: 'OK' })
}

module.exports = {
  getUsers,
  getUserByNumber,
  registerIdentifier,
  health
}
