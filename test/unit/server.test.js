'use strict'

const P = require('bluebird')
const Test = require('tapes')(require('tape'))
const Sinon = require('sinon')
const Db = require('../../src/db')
const Glue = require('glue')
const Logger = require('@mojaloop/central-services-shared').Logger
const Config = require('../../src/lib/config')
const Migrator = require('../../src/lib/migrator')

Test('server', serverTest => {
  let sandbox
  let oldDatabaseUri
  let databaseUri = 'some-database-uri'

  serverTest.beforeEach(t => {
    sandbox = Sinon.sandbox.create()
    sandbox.stub(Db, 'connect')
    sandbox.stub(Glue, 'compose')
    sandbox.stub(Logger, 'info')
    sandbox.stub(Logger, 'error')
    sandbox.stub(Migrator, 'migrate')

    oldDatabaseUri = Config.DATABASE_URI
    Config.DATABASE_URI = databaseUri

    t.end()
  })

  serverTest.afterEach(t => {
    delete require.cache[require.resolve('../../src/server')]
    sandbox.restore()
    Config.DATABASE_URI = oldDatabaseUri
    t.end()
  })

  serverTest.test('exporting should', function (exportingTest) {
    let serverUri = 'http://central-end-user-registry'

    exportingTest.test('run all required actions when starting server', test => {
      let startStub = sandbox.stub().returns(P.resolve({}))
      let server = { start: startStub, info: { uri: serverUri } }

      Glue.compose.returns(P.resolve(server))
      Db.connect.returns(P.resolve({}))
      Migrator.migrate.returns(P.resolve({}))

      require('../../src/server')
        .then(() => {
          test.ok(Migrator.migrate.calledOnce)
          test.ok(Db.connect.calledOnce)
          test.ok(Db.connect.calledWith(databaseUri))
          test.ok(Glue.compose.calledOnce)
          test.ok(startStub.calledOnce)
          test.ok(Logger.info.calledOnce)
          test.ok(Logger.info.calledWith(`Server running at: ${serverUri}`))
          test.end()
        })
    })

    exportingTest.test('log any errors', test => {
      let error = new Error()
      Migrator.migrate.returns(P.reject(error))
      require('../../src/server')
      .catch(e => {
        test.equal(e, error)
        test.ok(Logger.error.calledWith(error))
        test.end()
      })
    })

    exportingTest.end()
  })

  serverTest.end()
})
