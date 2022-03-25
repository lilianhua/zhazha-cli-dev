'use strict';

const urlJoin = require('url-join')
const axios = require('axios')
const semver = require('semver')

const NPM_URL = 'https://registry.npmjs.org'
const TAOBAO_NPM_URL = 'https://registry.npm.taobao.org'

async function getNpmInfo(pkgName, registry) {
    if (!pkgName) {
        return null
    }
    const registryUrl = registry || getDefaultRegistry()
    const npmInfoUrl = urlJoin(registryUrl, pkgName)
    console.log(npmInfoUrl)
    return axios.get(npmInfoUrl).then(response => {
        if (response.status === 200) {
            return response.data
        }
        return null
    }).catch(error => {
        return Promise.reject(error)
    })
}

function getDefaultRegistry(isOriginal = false) {
    return isOriginal ? NPM_URL : TAOBAO_NPM_URL
}

function getSemverVersions(baseVersion, versions) {
    return versions
        .filter(version => semver.satisfies(version, `^${baseVersion}`))
        .sort((a, b) => semver.gt(b, a))
}

async function getNpmServerVersion(baseVersion, pkgName, registry) {
    const versions = await getNpmVersion(pkgName, registry)
    const newVersions = getSemverVersions(baseVersion, versions)
    if (newVersions && newVersions.length > 0) {
        return newVersions[0]
    }
    return null
}

async function getNpmVersion(pkgName, registry) {
    const data = await getNpmInfo(pkgName, registry)
    if (data) {
        return Object.keys(data.versions)
    } else {
        return []
    }
}

module.exports = {
    getNpmInfo,
    getNpmVersion,
    getNpmServerVersion
}
