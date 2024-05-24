export class ModelViewerPage {
  elements: Readonly<Record<string, string>> = {
    appTopBar: '.oc-app-top-bar .oc-resource',
    appTopBarResourceBasename: '.oc-resource-basename',
    appTopBarResourceExtension: '.oc-resource-extension',
    modelViewport: '#preview .model-viewport',
    modelViewportWrapper: '#preview #scene-wrapper',
    modelViewportWrapperFullScreen: '#scene-wrapper:fullscreen',
    modelViewportDescription: '#preview h1.oc-invisible-sr',
    modelViewportCanvas: '#preview .model-viewport canvas',
    controlButtonPrevious: '.preview-controls-previous',
    controlButtonNext: '.preview-controls-next',
    controlButtonFullScreen: '.preview-controls-fullscreen'
  }

  async getViewportDescription(): Promise<string> {
    const viewportDescription = await global.page
      .locator(this.elements.modelViewportDescription)
      .innerText()
    // removing the string "Preview for "
    // because the locator modelVieportDescription returns "Preview for <filename>"
    // instead of just <filename>
    return viewportDescription.replace('Preview for ', '')
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

  async toggleFullScreenMode(): Promise<void> {
    await global.page.locator(this.elements.controlButtonFullScreen).click()
  }

  async navigateToNextModel(): Promise<void> {
    await global.page.locator(this.elements.controlButtonNext).click()
  }

  async navigateToPreviousModel(): Promise<void> {
    await global.page.locator(this.elements.controlButtonPrevious).click()
  }
}
