'use strict'

const Test = require('tape')
const Db = require('../../../../src/db')
const Repo = require('../../../../src/domain/users/repo')

function createUser (number, dfspIdentifier) {
  return Repo.create({ dfspIdentifier, number })
}

function deleteUsers () {
  return Db.from('users').destroy()
}

Test('users repo', repoTest => {
  repoTest.test('create should', createTest => {
    createTest.test('create a new user', test => {
      const number = '12345678'
      const dfspIdentifier = '001:123'

      createUser(number, dfspIdentifier)
        .then((user) => {
          test.ok(user.id)
          test.ok(user.createdDate)
          test.equal(user.number, number)
          test.equal(user.dfspIdentifier, dfspIdentifier)
          test.end()
        })
    })

    createTest.end()
  })

  repoTest.test('getByNumber should', getByNumberTest => {
    getByNumberTest.test('get user by number', test => {
      const number = '12345679'
      const dfspIdentifier = '001:124'

      createUser(number, dfspIdentifier)
        .then((user) => {
          Repo.getByNumber(user.number)
            .then((foundNumbers) => {
              test.equal(1, foundNumbers.length)

              let found = foundNumbers[0]
              test.notEqual(found, user)
              test.equal(found.id, user.id)
              test.equal(found.number, user.number)
              test.equal(found.dfspIdentifier, user.dfspIdentifier)
              test.deepEqual(found.createdDate, user.createdDate)
              test.end()
            })
        })
    })

    getByNumberTest.test('return multiple records for number and order by dfspIdentifier ascending', test => {
      const number = '12345676'
      const dfspIdentifier1 = '001:129'
      const dfspIdentifier2 = '001:128'

      createUser(number, dfspIdentifier1)
        .then(() => createUser(number, dfspIdentifier2))
        .then(() => {
          Repo.getByNumber(number)
            .then((found) => {
              test.equal(2, found.length)
              test.equal(dfspIdentifier2, found[0].dfspIdentifier)
              test.equal(dfspIdentifier1, found[1].dfspIdentifier)
              test.end()
            })
        })
    })

    getByNumberTest.end()
  })

  repoTest.test('getAll should', getAllTest => {
    getAllTest.test('return all users and order by number ascending', test => {
      const user1Number = '12345677'
      const user1DfspIdentifier = '001:125'
      const user2Number = '12345676'
      const user2DfspIdentifier = '001:126'

      deleteUsers()
        .then(() => createUser(user1Number, user1DfspIdentifier))
        .then(() => createUser(user2Number, user2DfspIdentifier))
        .then(() => Repo.getAll())
        .then(users => {
          test.equal(users.length, 2)
          test.equal(users[0].number, user2Number)
          test.equal(users[0].dfspIdentifier, user2DfspIdentifier)
          test.equal(users[1].number, user1Number)
          test.equal(users[1].dfspIdentifier, user1DfspIdentifier)
          test.end()
        })
    })

    getAllTest.end()
  })

  repoTest.end()
})
