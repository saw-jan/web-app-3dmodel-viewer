import { Page, expect } from '@playwright/test'
import { state } from '../hooks'
import util from 'util'

export class Viewer {
  page: Page = state.page
  elements: Readonly<Record<string, string>> = {
    resourceNameSelector: '#files-space-table [data-test-resource-name="%s"]',
    appbarResourceNameSelector: '#app-top-bar-resource [data-test-resource-name="%s"]',
    appTopBar: '.oc-app-top-bar .oc-resource', // '.oc-app-top-bar',
    appTopBarResourceName: '.oc-resource-name',
    modelViewport: '#preview .model-viewport',
    modelViewportWrapper: '#preview #scene-wrapper',
    modelViewportWrapperFullscreen: '#scene-wrapper:fullscreen',
    modelViewportDescription: '#preview h1.oc-invisible-sr',
    modelViewportCanvas: '#preview .model-viewport canvas',
    controlButtonPrev: '.preview-controls-previous',
    controlButtonNext: '.preview-controls-next',
    controlButtonFullscreen: '.preview-controls-fullscreen',
    controlButtonReset: '. preview-controls-reset'
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

  async checkTopbarVisibility(): Promise<void> {
    await expect(this.page.locator(this.elements.appTopBar)).toBeVisible()
  }

  async checkFullscreenMode(): Promise<void> {
    // modelViewportWrapper should have same size as browser window
    const windowInnerHeight = await this.page.evaluate(() => window.innerHeight)
    const windowInnerWidth = await this.page.evaluate(() => window.innerWidth)
    await expect(this.page.locator(this.elements.modelViewportWrapper)).toHaveCSS(
      'height',
      windowInnerHeight.toString() + 'px'
    )
    await expect(this.page.locator(this.elements.modelViewportWrapper)).toHaveCSS(
      'width',
      windowInnerWidth.toString() + 'px'
    )
    // alternative approach for testing this: fullscreen pseudo class exists
    await expect(this.page.locator(this.elements.modelViewportWrapperFullscreen)).toBeVisible()
  }

  async checkStandardDisplayMode(): Promise<void> {
    // fullscreen pseudo class is hidden (doesn't exist)
    await expect(this.page.locator(this.elements.modelViewportWrapperFullscreen)).toBeHidden()
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
    // locator.focus()	Focus the element
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
