'use strict';

module.exports = core;

const semver = require('semver')
const colors = require('colors/safe')

const pkg = require('../package.json')
const log = require('@zhazha-cli-dev/log')
const constants = require('./const')

function core() {
    try {
        checkPackageVersion()
        checkNodeVersion()
    } catch (e) {
        log.error(e.message)
    }
}

function checkPackageVersion() {
    log.success('cli', pkg.version)
}

function checkNodeVersion() {
    // 获取当前版本
    const currentVersion = process.version
    const lowestVersion = constants.LOWEST_NODE_VERSION
    // 和最低版本比较
    if (!semver.gte(currentVersion, lowestVersion)) {
        throw new Error(colors.red(`Node 版本过低，请使用大于${lowestVersion}的版本`))
    }
}
