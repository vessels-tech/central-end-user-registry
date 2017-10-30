const RC = require('rc')('CREG', require('../../config/default.json'))

module.exports = {
  DATABASE_URI: RC.DATABASE_URI,
  HOSTNAME: RC.HOSTNAME.replace(/\/$/, ''),
  PORT: RC.PORT
}
