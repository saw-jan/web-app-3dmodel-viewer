Feature: preview 3D model
  As a user
  I want to preview a 3D model
  So that I can make sure this is the correct file (e.g. before sharing it with others)

  Background:
    Given the user has logged in with username "admin" and password "admin"
    And a 3D model (.glb file) has been uploaded
    #should the filename be specified here?

  Scenario: preview 3D model
    When the user opens the file in the 3D model viewer
    Then the 3D model will be display in the browser
    And the file name will be shown in the topbar

  Scenario: toggle between standard and fullscreen mode
    When the user opens the file in the 3D model viewer
    And the user clicks on “Enter full screen mode”
    Then the 3D model will be displayed in full screen mode
    And the topbar won’t be visible
    When the user clicks on “Exit full screen mode”
    Then the 3D model will be display in standard mode
    And the file name will be shown in the topbar

  Scenario: rotate, zoom and reset 3D model
    When the user opens the file in the 3D model viewer
    And the user rotates the model using the mouse
    And the user zooms into the model using the mouse
    Then the size and position of the 3D model will be changed accordingly
    When the user clicks on “Reset”
    Then the 3D model will be display in the default size and position

  Scenario: show preview/next model
    Given multiple 3D models (.glb file) have been uploaded
    # should the filenames of all the models and the folder structure be specified here?
    When the user opens the first file in the 3D model viewer
    # should the file be referred to by filename instead of "first file"?
    And the user clicks on “Show next model”
    Then the second 3D model will be displayed
    # should the model be referred to by filename instead of "second 3D model"?
    When the user clicks on “Show previous model”
    Then the first 3D model will be displayed
    # should the model be referred to by filename instead of "first 3D model"? 
