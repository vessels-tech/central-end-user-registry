'use strict'

const Config = require('./lib/config')
const Pack = require('../package')
const ErrorHandling = require('@mojaloop/central-services-error-handling')
const Boom = require('boom')

module.exports = {
  server: {
    port: Config.PORT,
    routes: {
      validate: {
        options: ErrorHandling.validateRoutes(),
        failAction: async function (request, h, err) {
          throw Boom.boomify(err)
        }
      }
    }
  },
  register: {
    plugins: [
      { plugin: 'inert' },
      { plugin: 'vision' },
      { plugin: '@mojaloop/central-services-error-handling' },
      { plugin: './routes' },
      {
        plugin: 'hapi-swagger',
        options: {
          info: {
            'title': 'Central End User Registry API Documentation',
            'version': Pack.version
          }
        }
      },
      { plugin: 'blipp' }
    ]
  }
}
