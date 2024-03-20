const { config } = require('./tests/e2e/config.js')

module.exports = {
    default: {
        require: ["tests/e2e/**/*.ts"],
        requireModule: ["ts-node/register"],
        retry: config.retry,
        format: ["@cucumber/pretty-formatter"]
    }
}


// see https://github.com/cucumber/cucumber-js/blob/main/docs/configuration.md for documentation