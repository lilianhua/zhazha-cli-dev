'use strict';

module.exports = core;

const pkg = require('../package.json')
const log = require('@zhazha-cli-dev/log')

function core() {
    checkPackageVersion()
}

function checkPackageVersion() {
    console.log(pkg.version)
    log.success('cli','notice log')
}
