exports.config = {
    // environment
    baseUrlOcis: process.env.BASE_URL_OCIS ?? 'https://localhost:9200', // 'https://host.docker.internal:9200',
    assets: './tests/e2e/filesForUpload',
    adminUser: process.env.ADMIN_USERNAME || 'admin',
    adminPassword: process.env.ADMIN_PASSWORD || 'admin',
    // cucumber
    retry: process.env.RETRY || 0,
    // playwright
    slowMo: parseInt(process.env.SLOW_MO) || 0,
    timeout: parseInt(process.env.TIMEOUT) || 60,
    minTimeout: parseInt(process.env.MIN_TIMEOUT) || 5,
    headless: process.env.HEADLESS === 'true'
}