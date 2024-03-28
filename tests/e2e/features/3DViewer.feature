Feature: preview 3D model
    As a user
    I want to preview a 3D model
    So that I can make sure this is the correct file (e.g. before sharing it with others)


    Scenario: preview 3D model
        Given the user has logged in with username "admin" and password "admin"
        And the user has uploaded the following 3D models:
            | filename   |
            | model1.glb |
            | model2.glb |

        # preview 3D model
        When the user previews the file "model1.glb" in the 3D model viewer
        Then the 3D model "model1.glb" should be displayed in the viewport
        And the file name "model1.glb" should be shown in the topbar

        # toggle between standard and fullscreen mode
        When the user enters fullscreen mode
        Then the 3D model should be displayed in fullscreen mode
        # And the topbar should not be visible
        When the user exits fullscreen mode
        Then the 3D model should be display in standard mode
        # And the file name "model1.glb" should be shown in the topbar

        # rotate, zoom and reset 3D model
        # When the user rotates the model
        # And the user zooms into the model
        # Then the size and position of the 3D model should be changed accordingly
        # When the user resets the viewport
        # Then the 3D model should be display in the default size and position

        # show preview/next model
        When the user navigates to the next model
        Then the 3D model "model2.glb" should be displayed in the viewport
        And the file name "model2.glb" should be shown in the topbar
        When the user navigates to the previous model
        Then the 3D model "model1.glb" should be displayed in the viewport
        And the file name "model1.glb" should be shown in the topbar
