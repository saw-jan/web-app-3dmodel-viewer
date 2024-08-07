module.exports = {
    default: {
        require: ["tests/e2e/**/*.ts"],
        requireModule: ["ts-node/register"],
        retry: process.env.RETRY || 0,
        format: ["@cucumber/pretty-formatter"]
    }
}

// see https://github.com/cucumber/cucumber-js/blob/main/docs/configuration.md for documentation