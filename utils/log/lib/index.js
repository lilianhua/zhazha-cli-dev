'use strict';

const npmlog = require('npmlog')
npmlog.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info'
npmlog.heading = 'zhazha'
// npmlog.headingStyle = { fg: 'red', bg: 'black' }
npmlog.addLevel('success', 2000, { fg: 'green' })

module.exports = npmlog;
