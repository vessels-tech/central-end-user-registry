'use strict'

const Test = require('tapes')(require('tape'))
const Pack = require('../../package')
const Config = require('../../src/lib/config')

let getManifest = () => {
  return require('../../src/manifest')
}

Test('manifest', function (manifestTest) {
  manifestTest.beforeEach(t => {
    t.end()
  })

  manifestTest.afterEach(t => {
    delete require.cache[require.resolve('../../src/manifest')]
    t.end()
  })

  manifestTest.test('should', function (connectionsTest) {
    connectionsTest.test('have server section', function (assert) {
      let Manifest = getManifest()
      assert.ok(Manifest.server)
      assert.end()
    })

    connectionsTest.test('have one server with configured port', function (assert) {
      let Manifest = getManifest()
      assert.equal(typeof Manifest.server, 'object')
      assert.equal(Manifest.server.port, Config.PORT)
      assert.end()
    })

    connectionsTest.test('have server validation fail action throwing Boom serverError', async function (assert) {
      let Manifest = getManifest()
      try {
        let _
        await Manifest.server.routes.validate.failAction(_, _, new Error('boomify'))
      } catch (err) {
        assert.equal(err.message, 'boomify')
        assert.equal(err.output.statusCode, 500)
        assert.equal(err.output.payload.error, 'Internal Server Error')
      }
      assert.end()
    })

    connectionsTest.end()
  })

  manifestTest.test('should', function (registrationsTest) {
    let Manifest

    registrationsTest.beforeEach(t => {
      Manifest = getManifest()
      t.end()
    })

    registrationsTest.test('have register section', function (assert) {
      assert.ok(Manifest.register)
      assert.end()
    })

    registrationsTest.test('register inert plugin', function (assert) {
      assert.ok(findPluginByPath(Manifest.register.plugins, 'inert'))
      assert.end()
    })

    registrationsTest.test('register vision plugin', function (assert) {
      assert.ok(findPluginByPath(Manifest.register.plugins, 'vision'))
      assert.end()
    })

    registrationsTest.test('register routes', function (assert) {
      assert.ok(findPluginByPath(Manifest.register.plugins, './routes'))
      assert.end()
    })

    registrationsTest.test('register hapi-swagger plugin', function (assert) {
      let found = findPluginByRegisterName(Manifest.register.plugins, 'hapi-swagger')

      assert.ok(found)
      assert.equal(found.options.info.title, 'Central End User Registry API Documentation')
      assert.equal(found.options.info.version, Pack.version)
      assert.end()
    })

    registrationsTest.test('register blipp plugin', function (assert) {
      assert.ok(findPluginByPath(Manifest.register.plugins, 'blipp'))
      assert.end()
    })

    registrationsTest.end()
  })

  manifestTest.end()
})

function findPluginByPath (plugins, path) {
  return plugins.find(function (p) {
    return p.plugin && (typeof p.plugin === 'string') && p.plugin === path
  })
}

function findPluginByRegisterName (plugins, registerName) {
  return plugins.find(function (p) {
    return p && (typeof p === 'object') && p.plugin && p.plugin === registerName
  })
}
