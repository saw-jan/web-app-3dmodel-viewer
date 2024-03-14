import { Given, When, Then } from '@cucumber/cucumber'
import { state } from '../hooks'
import { config } from '../config.js'

import { Viewer } from '../pageObjects/Viewer'
import { getUser } from '../userStore'


Given('the user has logged in with username {string} and password {string}', function (username, password) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
})

/*
// from dicom viewer e2e tests
Given('the user {string} has logged in', async function(user: string): Promise<void> {
    const page = state.page
    const viewer = new Viewer()
    await page.goto(config.baseUrlOcis)
    const stepUser = await getUser({user})
    await viewer.login({ username: stepUser.displayName, password: stepUser.password })
})
*/

Given('the user has uploaded the following 3D models', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
})
// todo check how a list of models can be passed into this test
/*
// from dicom viewer e2e test
Given('the user has uploaded the dicom file {string}', async function (filename: string): Promise<void> {
    const viewer = new Viewer()
    await viewer.uploadFile({ filename })
})
*/

When('the user previews the file {string} in the 3D model viewer', async function (filename: string): Promise<void> {
    const viewer = new Viewer()
    await viewer.previewFile({ filename })
})

Then('the 3D model {string} should be displayed in the viewport', async function (filename: string): Promise<void> {
    // Write code here that turns the phrase above into concrete actions
    const viewer = new Viewer()
    await viewer.checkViewport({ filename })
})

Then('the file name {string} should be shown in the topbar', async function (filename: string): Promise<void> {
    // Write code here that turns the phrase above into concrete actions
    const viewer = new Viewer()
    await viewer.checkFileName({ filename })
})

When('the user enters fullscreen mode"', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
})

Then('the 3D model should be displayed in fullscreen mode', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
})

Then('the topbar should not be visible', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
})

When('the user exits fullscreen mode', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
})

Then('the 3D model should be display in standard mode', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
})

When('the user rotates the model', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
})

When('the user zooms into the model', function () {
   // Write code here that turns the phrase above into concrete actions
   return 'pending';
})

Then('the size and position of the 3D model will be changed accordingly', function () {
    // not sure how to test this? maybe check if rotation and zoom factor differ from original position?
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

When('the user resets the viewport', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
})

Then('the 3D model should be display in the default size and position', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
})

When('the user navigates to the next model', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
})

When('the user navigates to the previous model', function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
})
