import util from 'util'

export class Ocis {
  elements: Readonly<Record<string, string>> = {
    userNameSelector: '#oc-login-username',
    passwordSelector: '#oc-login-password',
    loginButtonSelector: 'button[type="submit"]',
    webContentSelector: '#web-content',
    resourceNameSelector: '#files-space-table [data-test-resource-name="%s"]'
  }

  async login({ username, password }): Promise<void> {
    await global.page.locator(this.elements.userNameSelector).fill(username)
    await global.page.locator(this.elements.passwordSelector).fill(password)
    await global.page.locator(this.elements.loginButtonSelector).click()
    await global.page.locator(this.elements.webContentSelector).waitFor()
  }

  async previewFile(filename: string): Promise<void> {
    await global.page.locator(util.format(this.elements.resourceNameSelector, filename)).click()
  }
}
