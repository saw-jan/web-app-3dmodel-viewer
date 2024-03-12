Feature: preview 3D model
    As a user
    I want to preview a 3D model
    So that I can make sure this is the correct file (e.g. before sharing it with others)


    Scenario: preview 3D model
        Given the user has logged in with username "admin" and password "admin"
        And the user has uploaded the following 3D models:
            | model1.glb |
            | model2.glb |

        # preview 3D model
        When the user opens the file "model1.glb" in the 3D model viewer
        Then the 3D model will be display in the viewport
        And the file name "model1.glb" will be shown in the topbar

        # toggle between standard and fullscreen mode
        When the user clicks on “Enter full screen mode”
        Then the 3D model will be displayed in full screen mode
        And the topbar won’t be visible
        When the user clicks on “Exit full screen mode”
        Then the 3D model will be display in standard mode
        And the file name "model1.glb" will be shown in the topbar

        # rotate, zoom and reset 3D model
        When the user rotates the model using the mouse
        And the user zooms into the model using the mouse
        Then the size and position of the 3D model will be changed accordingly
        When the user clicks on “Reset”
        Then the 3D model will be display in the default size and position

        # show preview/next model
        When the user opens the file "model1.glb" in the 3D model viewer
        And the user clicks on “Show next model”
        Then the 3D model "model2.glb" will be displayed
        And the file name "model2.glb" will be shown in the topbar
        When the user clicks on “Show previous model”
        Then the 3D model "model1.glb" will be displayed
        And the file name "model1.glb" will be shown in the topbar
