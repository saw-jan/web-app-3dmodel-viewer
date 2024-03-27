import { Page, expect } from '@playwright/test'
import { state } from '../hooks'
import { config } from '../config.js'
import util from 'util'

export class Viewer {
  page: Page = state.page
  elements: Readonly<Record<string, string>> = {
    userNameSelector: '#oc-login-username',
    passwordSelector: '#oc-login-password',
    loginButtonSelector: 'button[type="submit"]',
    webContentSelector: '#web-content',
    userMenuButtonSelector: '#_userMenuButton',
    logoutSelector: '#oc-topbar-account-logout',
    loginFormSelector: '.oc-login-form',
    resourceUploadButton: '#upload-menu-btn',
    fileUploadInput: '#files-file-upload-input',
    resourceNameSelector: '#files-space-table [data-test-resource-name="%s"]',
    appbarResourceNameSelector: '#app-top-bar-resource [data-test-resource-name="%s"]',
    uploadInfoCloseButton: '#close-upload-info-btn',
    appTopBar: '.oc-app-top-bar .oc-resource', // '.oc-app-top-bar',
    appTopBarResourceName: '.oc-resource-name',
    modelViewport: '#preview .model-viewport',
    modelViewportDescription: '#preview h1.oc-invisible-sr',
    modelViewportCanvas: '#preview .model-viewport canvas',
    controlButtonPrev: '.preview-controls-previous',
    controlButtonNext: '.preview-controls-next',
    controlButtonFullscreen: '.preview-controls-fullscreen',
    controlButtonReset: '. preview-controls-reset'
  }

  async login({ username, password }): Promise<void> {
    await this.page.locator(this.elements.userNameSelector).fill(username)
    await this.page.locator(this.elements.passwordSelector).fill(password)
    await this.page.locator(this.elements.loginButtonSelector).click()
    await this.page.locator(this.elements.webContentSelector).waitFor()
  }

  async logout(): Promise<void> {
    await this.page.locator(this.elements.userMenuButtonSelector).click()
    await this.page.locator(this.elements.logoutSelector).click()
  }

  async uploadFile(filename: string): Promise<void> {
    await this.page.locator(this.elements.resourceUploadButton).click()
    await this.page
      .locator(this.elements.fileUploadInput)
      .setInputFiles(`${config.assets}/${filename}`)
    await this.page.locator(this.elements.uploadInfoCloseButton).click()
    await this.page.locator(util.format(this.elements.resourceNameSelector, filename)).waitFor()
  }

  async previewFile(filename: string): Promise<void> {
    await this.page.locator(util.format(this.elements.resourceNameSelector, filename)).click()
    await expect(this.page.locator(this.elements.modelViewport)).toBeVisible()
  }

  async checkViewport(filename: string): Promise<void> {
    await expect(this.page.locator(this.elements.modelViewport)).toBeVisible()
    await expect(this.page.locator(this.elements.modelViewportCanvas)).toBeVisible()
    // check if file name is displayed in hidden h1 title element
    const description = await this.page.locator(this.elements.modelViewportDescription).innerText()
    await expect(description).toContain(filename)
    // todo: check if there are better ways to verify if the model is displayed in the viewport
  }

  async checkFileName(filename: string): Promise<void> {
    // from dicom viewer e2e test
    await expect(
      this.page.locator(util.format(this.elements.appbarResourceNameSelector, filename))
    ).toBeVisible()
    // own approach for checking file name
    const appTopBarResourceName = await this.page
      .locator(this.elements.appTopBarResourceName)
      .innerText()
    await expect(appTopBarResourceName.replace(/(\r\n|\n|\r)/gm, '').trim()).toContain(filename)
  }

  async checkTopbarVisibility(shouldBeVisible: boolean): Promise<void> {
    if (shouldBeVisible) {
      await expect(this.page.locator(this.elements.appTopBar)).toBeVisible()
    } else {
      await expect(this.page.locator(this.elements.appTopBar)).not.toBeVisible()
    }
  }

  async checkFullscreenMode(): Promise<void> {
    // todo: figure out how to test this...
    // label of the control element toggle?
    // browser window width?
    // get classes & pseudo classes of canvas and check if it contains :not(:root):fullscreen::backdrop
    await expect(true).toBe(true)
  }

  async checkStandardDisplayMode(): Promise<void> {
    // todo: figure out how to test this...
    // maybe again something with ::backdrop pseudo class?
    await expect(true).toBe(true)
  }

  async toggleFullscreenMode(): Promise<void> {
    await this.page.locator(this.elements.controlButtonFullscreen).click()
  }

  async resetViewport(): Promise<void> {
    await this.page.locator(this.elements.controlButtonReset).click()
  }

  async displayNextModel(): Promise<void> {
    await this.page.locator(this.elements.controlButtonNext).click()
  }

  async displayPreviousModel(): Promise<void> {
    await this.page.locator(this.elements.controlButtonPrev).click()
  }

  async modifyModel(): Promise<void> {
    // select viewport
    // move or wheel mouse interaction
    // await this.page.locator(this.elements.??).mouse.move()
    // mousewheel?
    // https://www.lambdatest.com/automation-testing-advisor/javascript/playwright-internal-mouseWheel
    /*
        https://playwright.dev/python/docs/api/class-mouse
        mouse.wheel(delta_x, delta_y)
        - delta_x (float#): Pixels to scroll horizontally
        - delta_y (float#): Pixels to scroll vertically

        await this.page.locator(this.elements.??).mouse.wheel()
        */
    /*
        https://webscraping.ai/faq/playwright/how-to-handle-mouse-actions-using-playwright
        await this.page.locator().mouse.move(startX, startY)
        await this.page.mouse.down()
        await this.page.mouse.move(endX, endY)
        await this.page.mouse.up()
        */
    /*
        https://playwright.dev/docs/input#mouse-click
        await page.locator('#item-to-be-dragged').hover();
        await page.mouse.down();
        await page.locator('#item-to-drop-at').hover();
        await page.mouse.up();
        */
  }
}
