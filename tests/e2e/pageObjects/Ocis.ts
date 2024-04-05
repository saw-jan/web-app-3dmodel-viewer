import { Page } from '@playwright/test'
import { state } from '../hooks'
import util from 'util'

export class Ocis {
  //static
  page: Page = state.page
  //static
  elements: Readonly<Record<string, string>> = {
    userNameSelector: '#oc-login-username',
    passwordSelector: '#oc-login-password',
    loginButtonSelector: 'button[type="submit"]',
    webContentSelector: '#web-content',
    resourceNameSelector: '#files-space-table [data-test-resource-name="%s"]',
    userMenuButtonSelector: '#_userMenuButton',
    logoutSelector: '#oc-topbar-account-logout',
  }

  async login({ username, password }): Promise<void> {
    await this.page.locator(this.elements.userNameSelector).fill(username)
    await this.page.locator(this.elements.passwordSelector).fill(password)
    await this.page.locator(this.elements.loginButtonSelector).click()
    await this.page.locator(this.elements.webContentSelector).waitFor()
  }

  async previewFile(filename: string): Promise<void> {
    await this.page.locator(util.format(this.elements.resourceNameSelector, filename)).click()
  }

  // function currently not used in the given scenario...
  async logout(): Promise<void> {
    await this.page.locator(this.elements.userMenuButtonSelector).click()
    await this.page.locator(this.elements.logoutSelector).click()
  }
}
