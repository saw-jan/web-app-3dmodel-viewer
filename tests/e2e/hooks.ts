import { Before, BeforeAll, After, AfterAll, setDefaultTimeout } from '@cucumber/cucumber'
import { chromium } from '@playwright/test'
import config from './config'
import { deleteAllFiles, emptyTrashbin } from './utils/helpers'

setDefaultTimeout(config.timeout * 1000)

BeforeAll(async function (): Promise<void> {
  global.browser = await chromium.launch({
    slowMo: config.slowMo,
    headless: config.headless,
    channel: 'chrome'
  })
})

Before(async function (): Promise<void> {
  global.context = await global.browser.newContext({ ignoreHTTPSErrors: true })
  global.page = await global.context.newPage()
})

AfterAll(async function (): Promise<void> {
  await global.browser.close()
})

After(async function (): Promise<void> {
  await deleteAllFiles()
  await emptyTrashbin()
  await global.page.close()
})
