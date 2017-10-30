'use strict'

const Test = require('tape')
const host = process.env.HOST_IP || 'localhost'
const Request = require('supertest')(`http://${host}:3001`)

const post = (route, data, contentType = 'application/json') => {
  return Request.post(route).set('Content-Type', contentType).send(data)
}

const get = (route) => {
  return Request.get(route)
}

Test('return health', test => {
  get('/health')
    .expect(200)
    .expect('Content-Type', /json/)
    .then(res => {
      test.equal(res.body.status, 'OK')
      test.end()
    })
})

Test('can register and retrieve user', test => {
  const dfspIdentifier = '001:123'
  const number = '00000262'

  post('/register', { dfspIdentifier, number })
    .expect(201)
    .then(postResponse => {
      const number = postResponse.body.number
      get(`/users/${number}`)
        .expect(200)
        .then(getResponse => {
          test.equal(1, getResponse.body.length)
          test.equal(getResponse.body[0].number, number)
          test.equal(getResponse.body[0].dfspIdentifier, dfspIdentifier)
          test.end()
        })
    })
})

Test('throws error if duplicate registration', test => {
  const dfspIdentifier = '001:123'
  const number = '00000263'

  post('/register', { dfspIdentifier, number })
    .expect(201)
    .then(postResponse => {
      post('/register', { dfspIdentifier, number })
        .expect(422)
        .then(res => {
          test.equal(res.body.id, 'AlreadyExistsError')
          test.equal(res.body.message, 'The number has already been registered for this DFSP')
          test.end()
        })
    })
})

Test('throws error if number not found', test => {
  const number = '00000261'

  get(`/users/${number}`)
    .expect(404)
    .then(res => {
      test.equal(res.body.id, 'NotFoundError')
      test.end()
    })
})
