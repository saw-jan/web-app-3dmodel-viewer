import { Given, When, Then, DataTable } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { state } from '../hooks'
import config from '../config'

import { Ocis } from '../pageObjects/Ocis'
import { Viewer } from '../pageObjects/Viewer'
import { uploadFile, delay } from '../utils/helpers'

Given(
  'the following 3D models have been uploaded:',
  async function (filesForUpload: DataTable): Promise<void> {
    for (const file of filesForUpload.hashes()) {
      await uploadFile(file.filename)
    }
  }
)

Given(
  'the user has logged in with username {string} and password {string}',
  async function (user: string, password: string): Promise<void> {
    const page = state.page
    await page.goto(config.baseUrlOcis)
    const ocis = new Ocis()
    await ocis.login({ username: user, password: password })
  }
)

When(
  'the user previews the file {string} in the 3D model viewer',
  async function (filename: string): Promise<void> {
    const ocis = new Ocis()
    await ocis.previewFile(filename)
  }
)

Then(
  'the 3D model {string} should be displayed in the viewport',
  async function (filename: string): Promise<void> {
    const viewer = new Viewer()
    // add some delay to allow model to be loaded
    await delay(1000)
    // check if the filename is displayed in hidden h1 title element of the viewport
    const viewportDescription = await viewer.getViewportDescription()
    expect(viewportDescription).toContain(filename)
  }
)

Then(
  'the file name {string} should be shown in the topbar',
  async function (filename: string): Promise<void> {
    const viewer = new Viewer()
    const topbarFilename = await viewer.getTopbarResourceName()
    expect(topbarFilename).toContain(filename)
  }
)

When('the user enters fullscreen mode', async function (): Promise<void> {
  const viewer = new Viewer()
  await viewer.toggleFullscreenMode()
})

Then('the 3D model should be displayed in fullscreen mode', async function (): Promise<void> {
  const viewer = new Viewer()
  const viewportWrapperSize = await viewer.getViewportWrapperSize()
  const windowInnerSize = await viewer.getWindowInnerSize()
  // in fullscreen mode, model viewport wrapper should have same size as browser window
  expect(viewportWrapperSize[0]).toBe(windowInnerSize[0])
  expect(viewportWrapperSize[1]).toBe(windowInnerSize[1])
})

When('the user exits fullscreen mode', async function (): Promise<void> {
  const viewer = new Viewer()
  await viewer.toggleFullscreenMode()
})

Then('the 3D model should be display in standard mode', async function (): Promise<void> {
  const viewer = new Viewer()
  await viewer.checkStandardDisplayMode()
  await viewer.checkTopbarVisibility()
})

When('the user rotates the model', function () {
  // modify camera.rotation with random value or initiate some mouse event?
  return 'pending'
})

When('the user zooms into the model', function () {
  // modify camera.position.z with random value
  return 'pending'
})

Then('the size and position of the 3D model will be changed accordingly', function () {
  // not sure how to test this? maybe check if rotation and zoom factor differ from original position?
  // check if camera.position and camera.position.z have been modified (!= initCamPosition)
  return 'pending'
})

When('the user resets the viewport', async function (): Promise<void> {
  const viewer = new Viewer()
  await viewer.resetViewport()
})

Then('the 3D model should be display in the default size and position', function () {
  // check if camera.position and camera.position.z are equal to initCamPosition
  return 'pending'
})

When('the user navigates to the next model', async function (): Promise<void> {
  const viewer = new Viewer()
  await viewer.displayNextModel()
})

When('the user navigates to the previous model', async function (): Promise<void> {
  const viewer = new Viewer()
  await viewer.displayPreviousModel()
})
