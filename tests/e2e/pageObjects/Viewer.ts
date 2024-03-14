import { Page, expect } from '@playwright/test'
import { state } from '../hooks'
import { config } from '../config.js'
// import util from 'util' // check import

export class Viewer {
    page: Page = state.page
    elements: Readonly<Record<string, string>> = {
        userNameSelector : '#oc-login-username',
        passwordSelector : '#oc-login-password',
        loginButtonSelector : 'button[type="submit"]',
        webContentSelector : '#web-content',
        userMenuButtonSelector : '#_userMenuButton',
        logoutSelector : '#oc-topbar-account-logout',
        loginFormSelector : '.oc-login-form',
        resourceUploadButton : '#upload-menu-btn',
        fileUploadInput : '#files-file-upload-input',
        resourceNameSelector : '#files-space-table [data-test-resource-name="%s"]',
        appbarResourceNameSelector : '#app-top-bar-resource [data-test-resource-name="%s"]',
        uploadInfoCloseButton : '#close-upload-info-btn',
        appTopBar : '.oc-app-top-bar',
        appTopBarResourceName : '.oc-resource-name',
        modelViewport : '#preview .model-viewport',
        controlButtonPrev : '.preview-controls-previous',
        controlButtonNext : '.preview-controls-next',
        controlButtonFullscreen : '.preview-controls-fullscreen',
        controlButtonReset : '. preview-controls-reset'
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

    async upload({ filename }): Promise<void> {
        await this.page.locator(this.elements.resourceUploadButton).click()
        await this.page.locator(this.elements.fileUploadInput).setInputFiles(`${config.assets}/${filename}`)
        await this.page.locator(this.elements.uploadInfoCloseButton).click()
        // await this.page.locator(util.format(this.elements.resourceNameSelector, filename)).waitFor()
    }

    async preview3DModel({ filename }): Promise<void> {
        // await this.page.locator(util.format(this.elements.resourceNameSelector, filename)).click()
        // await expect(this.page.locator(this.elements.modelViewport)).toBeVisible()
        // await expect(this.page.locator(util.format(this.elements.appbarResourceNameSelector, filename))).toBeVisible()
    }
}