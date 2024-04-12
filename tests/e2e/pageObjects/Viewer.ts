export class Viewer {
  elements: Readonly<Record<string, string>> = {
    appTopBar: '.oc-app-top-bar .oc-resource',
    appTopBarResourceBasename: '.oc-resource-basename',
    appTopBarResourceExtension: '.oc-resource-extension',
    modelViewport: '#preview .model-viewport',
    modelViewportWrapper: '#preview #scene-wrapper',
    modelViewportWrapperFullscreen: '#scene-wrapper:fullscreen',
    modelViewportDescription: '#preview h1.oc-invisible-sr',
    modelViewportCanvas: '#preview .model-viewport canvas',
    controlButtonPrev: '.preview-controls-previous',
    controlButtonNext: '.preview-controls-next',
    controlButtonFullscreen: '.preview-controls-fullscreen',
    controlButtonReset: '.preview-controls-reset'
  }

  async getViewportDescription(): Promise<string> {
    return await global.page.locator(this.elements.modelViewportDescription).innerText()
  }

  async getTopbarResourceName(): Promise<string> {
    const topbarResourceBasename = await global.page
      .locator(this.elements.appTopBarResourceBasename)
      .innerText()
    const topbarResourceExtension = await global.page
      .locator(this.elements.appTopBarResourceExtension)
      .innerText()
    return topbarResourceBasename + topbarResourceExtension
  }

  async getViewportWrapperSize(): Promise<[string, string]> {
    const element = await global.page.waitForSelector(this.elements.modelViewportWrapper)
    const viewportHeight = await element.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue('height')
    })
    const viewportWidth = await element.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue('width')
    })
    // slice removes 'px' at the end of value
    return [viewportHeight.slice(0, -2), viewportWidth.slice(0, -2)]
  }

  async getWindowInnerSize(): Promise<[string, string]> {
    const windowInnerHeight = await global.page.evaluate(() => window.innerHeight)
    const windowInnerWidth = await global.page.evaluate(() => window.innerWidth)
    return [windowInnerHeight.toString(), windowInnerWidth.toString()]
  }

  async toggleFullscreenMode(): Promise<void> {
    await global.page.locator(this.elements.controlButtonFullscreen).click()
  }

  async resetViewport(): Promise<void> {
    await global.page.locator(this.elements.controlButtonReset).click()
  }

  async displayNextModel(): Promise<void> {
    await global.page.locator(this.elements.controlButtonNext).click()
  }

  async displayPreviousModel(): Promise<void> {
    await global.page.locator(this.elements.controlButtonPrev).click()
  }

  async modifyModelRotation(): Promise<void> {
    await global.page.locator(this.elements.modelViewportCanvas).focus()

    // defining some values for mouse movement that will certainly be within viewport
    const viewportBoundingBox = await global.page
      .locator(this.elements.modelViewportCanvas)
      .boundingBox()
    const spacing = 180
    const xMouseStartCoordinate = viewportBoundingBox.x + spacing
    const xMouseEndCoordinate = viewportBoundingBox.x + viewportBoundingBox.width - 2 * spacing
    const yMouseCoordinate = viewportBoundingBox.y + viewportBoundingBox.height / 2

    await global.page.mouse.move(xMouseStartCoordinate, yMouseCoordinate)
    await global.page.mouse.down()
    await global.page.mouse.move(xMouseEndCoordinate, yMouseCoordinate)
    await global.page.mouse.up()
  }

  async modifyModelZoom(): Promise<void> {
    await global.page.locator(this.elements.modelViewportCanvas).focus()
    await global.page.mouse.move(100, 100)
    await global.page.mouse.wheel(0, -200)
  }
}
