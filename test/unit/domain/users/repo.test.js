'use strict'

const Test = require('tapes')(require('tape'))
const Sinon = require('sinon')
const P = require('bluebird')
const Repo = require('../../../../src/domain/users/repo')
const Db = require('../../../../src/db')

Test('User Repo test', repoTest => {
  let sandbox

  repoTest.beforeEach(test => {
    sandbox = Sinon.sandbox.create()

    Db.users = {
      insert: sandbox.stub(),
      findOne: sandbox.stub(),
      find: sandbox.stub()
    }

    test.end()
  })

  repoTest.afterEach(test => {
    sandbox.restore()
    test.end()
  })

  repoTest.test('getByNumber should', getByNumberTest => {
    getByNumberTest.test('find one user by number', test => {
      const number = '12345678'

      Db.users.find.returns(P.resolve([{ number }]))

      Repo.getByNumber(number)
      .then(response => {
        test.equal(1, response.length)
        test.equal(response[0].number, number)
        test.ok(Db.users.find.calledWith(Sinon.match({ number }), { order: 'dfspIdentifier asc' }))
        test.end()
      })
    })

    getByNumberTest.end()
  })

  repoTest.test('getAll should', getAllTest => {
    getAllTest.test('get all users and order by number', test => {
      const number1 = '12345678'
      const number2 = '12345679'

      Db.users.find.returns(P.resolve([{ number: number1 }, { number: number2 }]))

      Repo.getAll()
      .then(response => {
        test.equal(response.length, 2)
        test.equal(response[0].number, number1)
        test.equal(response[1].number, number2)
        test.ok(Db.users.find.calledWith({}, { order: 'number asc' }))
        test.end()
      })
    })

    getAllTest.end()
  })

  repoTest.test('create should', createTest => {
    createTest.test('insert user', test => {
      const user = { url: 'test', number: 'test' }
      Db.users.insert.returns(P.resolve(user))

      Repo.create(user)
      .then(() => {
        test.ok(Db.users.insert.calledWith(user))
        test.end()
      })
    })

    createTest.end()
  })

  repoTest.end()
})
