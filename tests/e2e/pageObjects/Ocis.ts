import { Page } from '@playwright/test'
import { state } from '../hooks'
import { config } from '../config.js'
import util from 'util'

export class Ocis {
  page: Page = state.page
  elements: Readonly<Record<string, string>> = {
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

  //static
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
}
