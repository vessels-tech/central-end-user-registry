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

const getUsers = async function (request, h) {
  const users = await Service.getAll()
  return h.response(usersResponse(users))
}

const getUserByNumber = async function (request, h) {
  const users = await Service.getByNumber(request.params.number)
  return h.response(usersResponse(users))
}

const registerIdentifier = async function (request, h) {
  const user = await Service.register(request.payload)
  return h.response(userResponse(user)).code(201)
}

const health = async function (request, h) {
  return h.response({ status: 'OK' })
}

module.exports = {
  getUsers,
  getUserByNumber,
  registerIdentifier,
  health
}
