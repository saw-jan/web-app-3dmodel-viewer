import { Given, When, Then } from '@cucumber/cucumber'
import { state } from '../hooks'
import { config } from "../config.js"

import { Viewer } from "../pageObjects/Viewer"
import { getUser } from "../userStore";


//launch url - from swikriti's blog, check if this is still needed?
const url = 'http://localhost:9200'


#Scenario: preview 3D model
    Given('the user has logged in with username {string} and password {string}', function (string, string2) {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });

    Given('a 3D model \\(.glb file) has been uploaded', function () {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });

    When('the user opens the file in the 3D model viewer', function () {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });

    Then('the 3D model will be display in the browser', function () {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });

    Then('the file name will be shown in the topbar', function () {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });


#Scenario: toggle between standard and fullscreen mode
    Given('the user has logged in with username {string} and password {string}', function (string, string2) {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });

    Given('a 3D model \\(.glb file) has been uploaded', function () {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });

    When('the user opens the file in the 3D model viewer', function () {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });

    When('the user clicks on “Enter full screen mode”', function () {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });

    Then('the 3D model will be displayed in full screen mode', function () {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });

    Then('the topbar won’t be visible', function () {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });

    When('the user clicks on “Exit full screen mode”', function () {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });

    Then('the 3D model will be display in standard mode', function () {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });

    Then('the file name will be shown in the topbar', function () {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });


#Scenario: rotate, zoom and reset 3D model
    Given('the user has logged in with username {string} and password {string}', function (string, string2) {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });

    Given('a 3D model \\(.glb file) has been uploaded', function () {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });

    When('the user opens the file in the 3D model viewer', function () {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });

    When('the user rotates the model using the mouse', function () {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });

    When('the user zooms into the model using the mouse', function () {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });

    Then('the size and position of the 3D model will be changed accordingly', function () {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });

    When('the user clicks on “Reset”', function () {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });

    Then('the 3D model will be display in the default size and position', function () {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });


#Scenario: show preview/next model
    Given('the user has logged in with username {string} and password {string}', function (string, string2) {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });

    Given('a 3D model \\(.glb file) has been uploaded', function () {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });

    Given('multiple 3D models \\(.glb file) have been uploaded', function () {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });

    When('the user opens the first file in the 3D model viewer', function () {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });

    When('the user clicks on “Show next model”', function () {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });

    Then('the second 3D model will be displayed', function () {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });

    When('the user clicks on “Show previous model”', function () {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });

    Then('the first 3D model will be displayed', function () {
        // Write code here that turns the phrase above into concrete actions
        return 'pending';
    });

