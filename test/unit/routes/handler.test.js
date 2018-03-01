'use strict'

const Test = require('tapes')(require('tape'))
const Sinon = require('sinon')
const P = require('bluebird')
const NotFoundError = require('@mojaloop/central-services-shared').NotFoundError

const Handler = require('../../../src/routes/handler')
const Service = require('../../../src/domain/users/service')

Test('routes handler test', handlerTest => {
  let sandbox

  handlerTest.beforeEach(test => {
    sandbox = Sinon.sandbox.create()
    sandbox.stub(Service)
    test.end()
  })

  handlerTest.afterEach(test => {
    sandbox.restore()
    test.end()
  })

  handlerTest.test('health should', healthTest => {
    healthTest.test('return status: OK', async function (test) {
      const h = {
        response: (output) => {
          test.equal(output.status, 'OK')
          test.end()
        }
      }
      await Handler.health({}, h)
    })

    healthTest.end()
  })

  handlerTest.test('getUsers should', getUsersTest => {
    getUsersTest.test('returns users from Service', async function (test) {
      const number = '12345678'
      const dfspIdentifier = '001:123'
      const user = { id: 1, number, dfspIdentifier }
      await Service.getAll.returns(P.resolve([user]))

      const h = {
        response: (output) => {
          test.deepEqual(output, [{ number, dfspIdentifier }])
          test.end()
        }
      }

      await Handler.getUsers({}, h)
    })
    getUsersTest.end()
  })

  handlerTest.test('getUserByNumber should', userByNumberTest => {
    userByNumberTest.test('return user from Service.getByNumber', async function (test) {
      const number = '12345678'
      const dfspIdentifier = '001:123'
      const user = { id: 1, number, dfspIdentifier }
      await Service.getByNumber.returns(P.resolve([user]))

      const request = {
        params: { number }
      }
      const h = {
        response: (output) => {
          test.equal(1, output.length)
          test.deepEqual(output[0], { number, dfspIdentifier })
          test.end()
        }
      }

      await Handler.getUserByNumber(request, h)
    })

    userByNumberTest.test('return NotFoundError if users is null', async function (test) {
      const number = '12345678'
      await Service.getByNumber.returns(P.resolve(null))

      const request = {
        params: { number }
      }
      const h = {}

      try {
        await Handler.getUserByNumber(request, h)
      } catch (err) {
        test.ok(err instanceof NotFoundError)
        test.equal(err.message, 'The requested number does not exist')
        test.end()
      }
    })

    userByNumberTest.test('return NotFoundError if users is empty', async function (test) {
      const number = '12345678'
      await Service.getByNumber.returns(P.resolve([]))

      const request = {
        params: { number }
      }
      const h = {}

      try {
        await Handler.getUserByNumber(request, h)
      } catch (err) {
        test.ok(err instanceof NotFoundError)
        test.equal(err.message, 'The requested number does not exist')
        test.end()
      }
    })

    userByNumberTest.end()
  })

  handlerTest.test('registerIdentifier should', registerIdentifierTest => {
    registerIdentifierTest.test('register user with Service', async function (test) {
      const number = '12345678'
      const dfspIdentifier = '001:123'
      const user = { id: 2, dfspIdentifier, number }

      await Service.register.withArgs(Sinon.match({ number, dfspIdentifier })).returns(P.resolve(user))

      const request = {
        payload: { number, dfspIdentifier }
      }
      const h = {
        response: (output) => {
          test.deepEqual(output, { number, dfspIdentifier })
          return {
            code: (statusCode) => {
              test.equal(statusCode, 201)
              test.end()
            }
          }
        }
      }

      await Handler.registerIdentifier(request, h)
    })

    registerIdentifierTest.test('throw NotFoundException if directory yields empty', async function (test) {
      const number = '12345678'
      const dfspIdentifier = '001:123'

      let error = new Error()
      await Service.register.withArgs(Sinon.match({ number, dfspIdentifier })).returns(P.reject(error))

      const request = {
        payload: { number, dfspIdentifier }
      }
      let h = {}

      try {
        await Handler.registerIdentifier(request, h.response)
      } catch (err) {
        test.equal(err, error)
        test.end()
      }
    })

    registerIdentifierTest.end()
  })

  handlerTest.end()
})
