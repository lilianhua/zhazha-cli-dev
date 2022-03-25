'use strict';

module.exports = core;

const path = require('path')

const semver = require('semver')
const colors = require('colors/safe')
const userHome = require('user-home')
const pathExist = require('path-exists').sync

const pkg = require('../package.json')
const log = require('@zhazha-cli-dev/log')
const constants = require('./const')

let args

async function core() {
    try {
        // 检查package版本
        checkPackageVersion()
        // 检查node版本
        checkNodeVersion()
        // 检查是否是root账户登录，如果是降级处理
        checkRoot()
        // 检查用户主目录是否存在
        checkUserHome()
        // 检查入参和debug模式开发
        checkInputArgs()
        // 环境变量检查
        checkEnv()
        // 检查是否有全局更新
        await checkGlobalUpdate()
    } catch (e) {
        log.error(e.message)
    }
}

async function checkGlobalUpdate() {
    // 获取当前的包名和版本
    const pkgName = pkg.name
    const currentVersion = pkg.version
    // 获取npm上的版本信息
    const {getNpmServerVersion} = require('@zhazha-cli-dev/get')
    const lastVersion = await getNpmServerVersion(currentVersion, pkgName)
    if (lastVersion && semver.gt(lastVersion, currentVersion)) {
        log.warn(colors.yellow(`请手动更新${pkgName},
        当前版本为${currentVersion},最新版本为${lastVersion}，
        更新命令：npm install -g ${pkgName}`))
    }
}

function createDefaultConfig() {
    const cliConfig = {
        home: userHome
    }
    if (process.env.CLI_HOME) {
        cliConfig['cliHome'] = path.resolve(userHome, process.env.CLI_HOME)
    } else {
        cliConfig['cliHome'] = path.resolve(userHome, constants.DEFAULT_CLI_HOME)
    }
    process.env.CLI_HOME_PATH = cliConfig.cliHome
}

function checkEnv() {
    const dotEnv = require('dotenv')
    const dotEnvPath = path.resolve(userHome, '.env')
    if (pathExist(dotEnvPath)) {
        dotEnv.config({
            path: dotEnvPath
        })
    }
    createDefaultConfig()
    log.verbose('环境变量', process.env.CLI_HOME_PATH)
}

function checkInputArgs() {
    args = require('minimist')(process.argv.slice(2))
    checkArgs()
}

function checkArgs() {
    if (args.debug) {
        process.env.LOG_LEVEL = 'verbose'
    } else {
        process.env.LOG_LEVEL = 'info'
    }
    log.level = process.env.LOG_LEVEL
}

function checkUserHome() {
    if (!userHome || !pathExist(userHome)) {
        throw new Error(colors.red('当前用户主目录不存在！！！'))
    }
}

function checkRoot() {
    //TODO 2.0.0版本报错：必须用esmodule方式引入
    const rootCheck = require('root-check')
    rootCheck()
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
