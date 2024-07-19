Feature: preview 3D model
    As a user
    I want to preview a 3D model
    So that I can make sure this is the correct file (e.g. before sharing it with others)


    Scenario: preview model with 3D viewer
        Given the following 3D models have been uploaded:
            | filename   |
            | model1.glb |
            | model2.glb |
        And the user has logged in with username "admin" and password "admin"

        # preview 3D model
        When the user previews the file "model1.glb" in the 3D model viewer
        Then the 3D model "model1.glb" should be displayed in the viewport
        And the file name "model1.glb" should be shown in the topbar

        # toggle between standard mode and full screen mode
        When the user enters full screen mode
        Then the 3D model should be displayed in full screen mode
        When the user exits full screen mode
        Then the 3D model should be displayed in standard mode

        # show preview/next model
        When the user navigates to the next model
        Then the 3D model "model2.glb" should be displayed in the viewport
        And the file name "model2.glb" should be shown in the topbar
        When the user navigates to the previous model
        Then the 3D model "model1.glb" should be displayed in the viewport
        And the file name "model1.glb" should be shown in the topbar
