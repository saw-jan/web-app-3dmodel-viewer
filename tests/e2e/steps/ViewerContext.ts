import { Given, When, Then, DataTable } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import config from '../config'

import { Ocis } from '../pageObjects/Ocis'
import { Viewer } from '../pageObjects/Viewer'
import { uploadFile } from '../utils/helpers'
import util from 'util'

const ocis = new Ocis()
const viewer = new Viewer()

Given(
  'the following 3D models have been uploaded:',
  async function (filesForUpload: DataTable): Promise<void> {
    for (const file of filesForUpload.hashes()) {
      await uploadFile(file.filename)
      // assert if file is listed in the file list after upload
      const locator = await global.page
        .locator(util.format(ocis.elements.resourceNameSelector, file.filename))
        .toString()
      expect(locator).toContain(file.filename)
    }
  }
)

Given(
  'the user has logged in with username {string} and password {string}',
  async function (user: string, password: string): Promise<void> {
    await global.page.goto(config.baseUrlOcis)
    await ocis.login({ username: user, password: password })
  }
  // to do: assert that the user has successfully logged in
)

When(
  'the user previews the file {string} in the 3D model viewer',
  async function (filename: string): Promise<void> {
    await ocis.previewFile(filename)
  }
)

Then(
  'the 3D model {string} should be displayed in the viewport',
  async function (filename: string): Promise<void> {
    // check if viewport and canvas are visible
    await expect(global.page.locator(viewer.elements.modelViewport)).toBeVisible()
    await expect(global.page.locator(viewer.elements.modelViewportCanvas)).toBeVisible()
    // wait for model (and its description) to be loaded
    await global.page.waitForSelector(viewer.elements.modelViewportDescription)
    // check if the filename is displayed in hidden h1 title element of the viewport
    const viewportDescription = await viewer.getViewportDescription()
    expect(viewportDescription).toContain(filename)
  }
)

Then(
  'the file name {string} should be shown in the topbar',
  async function (filename: string): Promise<void> {
    // check if topbar is visible
    await expect(global.page.locator(viewer.elements.appTopBar)).toBeVisible()
    const topbarFilename = await viewer.getTopbarResourceName()
    expect(topbarFilename).toBe(filename)
  }
)

When('the user enters fullscreen mode', async function (): Promise<void> {
  await viewer.toggleFullscreenMode()
})

Then('the 3D model should be displayed in fullscreen mode', async function (): Promise<void> {
  const viewportWrapperSize = await viewer.getViewportWrapperSize()
  const windowInnerSize = await viewer.getWindowInnerSize()
  // in fullscreen mode, model viewport wrapper should have same size as browser window
  expect(viewportWrapperSize[0]).toBe(windowInnerSize[0])
  expect(viewportWrapperSize[1]).toBe(windowInnerSize[1])
  // additionally test if fullscreen pseudo class exists
  await expect(global.page.locator(viewer.elements.modelViewportWrapperFullscreen)).toBeVisible()
})

When('the user exits fullscreen mode', async function (): Promise<void> {
  await viewer.toggleFullscreenMode()
})

Then('the 3D model should be displayed in standard mode', async function (): Promise<void> {
  // check if fullscreen pseudo class is hidden (doesn't exist)
  await expect(global.page.locator(viewer.elements.modelViewportWrapperFullscreen)).toBeHidden()
  // check if top bar is visible
  await expect(global.page.locator(viewer.elements.appTopBar)).toBeVisible()
})

When('the user navigates to the next model', async function (): Promise<void> {
  await viewer.navigateToNextModel()
})

When('the user navigates to the previous model', async function (): Promise<void> {
  await viewer.navigateToPreviousModel()
})
