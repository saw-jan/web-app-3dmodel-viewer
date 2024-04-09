import { Page, expect } from '@playwright/test'
import { state } from '../hooks'
import util from 'util'

export class Viewer {
  page: Page = state.page
  elements: Readonly<Record<string, string>> = {
    appbarResourceNameSelector: '#app-top-bar-resource [data-test-resource-name="%s"]',
    appTopBar: '.oc-app-top-bar .oc-resource', // '.oc-app-top-bar',
    appTopBarResourceBasename: '.oc-resource-basename',
    appTopBarResourceExtension: '.oc-resource-extension',
    modelViewport: '#preview .model-viewport',
    modelViewportWrapper: '#preview #scene-wrapper',
    modelViewportWrapperFullscreen: '#scene-wrapper:fullscreen',
    modelViewportDescription: '#preview h1.oc-invisible-sr', // 'oc-hidden-announcer',
    modelViewportCanvas: '#preview .model-viewport', // '#preview .model-viewport canvas'
    controlButtonPrev: '.preview-controls-previous',
    controlButtonNext: '.preview-controls-next',
    controlButtonFullscreen: '.preview-controls-fullscreen',
    controlButtonReset: '. preview-controls-reset'
  }

  async getViewportDescription(): Promise<string> {
    return await this.page.locator(this.elements.modelViewportDescription).innerText()
  }

  async getTopbarResourceName(): Promise<string> {
    const topbarResourceBasename = await this.page
      .locator(this.elements.appTopBarResourceBasename)
      .innerText()
    const topbarResourceExtension = await this.page
      .locator(this.elements.appTopBarResourceExtension)
      .innerText()
    return topbarResourceBasename + topbarResourceExtension
  }

  async getViewportWrapperSize(): Promise<[string, string]> {
    const element = await this.page.waitForSelector(this.elements.modelViewportWrapper)
    const viewportHeight = await element.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue('height')
    })
    const viewportWidth = await element.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue('width')
    })
    // slice removes px at the end of value
    return [viewportHeight.slice(0, -2), viewportWidth.slice(0, -2)]
  }

  async getWindowInnerSize(): Promise<[string, string]> {
    const windowInnerHeight = await this.page.evaluate(() => window.innerHeight)
    const windowInnerWidth = await this.page.evaluate(() => window.innerWidth)
    return [windowInnerHeight.toString(), windowInnerWidth.toString()]
  }

  async checkTopbarVisibility(): Promise<void> {
    await expect(this.page.locator(this.elements.appTopBar)).toBeVisible()
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

  // helper function
  async getComputedStyleForSelector(selector: string, cssAttribute: string): Promise<string> {
    const element = await this.page.waitForSelector(selector)
    const value = await element.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue(cssAttribute)
    })
    return value
    //returns Promise object
  }
}
