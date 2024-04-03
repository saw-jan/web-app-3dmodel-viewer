import { Page } from '@playwright/test'
import { state } from '../hooks'
import config from '../config'
import util from 'util'

export class Ocis {
  static page: Page = state.page
  static elements: Readonly<Record<string, string>> = {
    userNameSelector: '#oc-login-username',
    passwordSelector: '#oc-login-password',
    loginButtonSelector: 'button[type="submit"]',
    webContentSelector: '#web-content',
    userMenuButtonSelector: '#_userMenuButton',
    logoutSelector: '#oc-topbar-account-logout',
    resourceUploadButton: '#upload-menu-btn',
    fileUploadInput: '#files-file-upload-input',
    uploadInfoCloseButton: '#close-upload-info-btn',
    resourceNameSelector: '#files-space-table [data-test-resource-name="%s"]'
  }

  static async login({ username, password }): Promise<void> {
    await Ocis.page.locator(this.elements.userNameSelector).fill(username)
    await Ocis.page.locator(this.elements.passwordSelector).fill(password)
    await Ocis.page.locator(this.elements.loginButtonSelector).click()
    await Ocis.page.locator(this.elements.webContentSelector).waitFor()
  }

  static async logout(): Promise<void> {
    await Ocis.page.locator(this.elements.userMenuButtonSelector).click()
    await Ocis.page.locator(this.elements.logoutSelector).click()
  }

  static async uploadFile(filename: string): Promise<void> {
    await Ocis.page.locator(this.elements.resourceUploadButton).click()
    await Ocis.page
      .locator(this.elements.fileUploadInput)
      .setInputFiles(`${config.assets}/${filename}`)
    await Ocis.page.locator(this.elements.uploadInfoCloseButton).click()
    await Ocis.page.locator(util.format(this.elements.resourceNameSelector, filename)).waitFor()
  }
}
