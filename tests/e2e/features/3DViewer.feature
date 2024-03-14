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
        Then the 3D model should be display in the viewport
        And the file name "model1.glb" should be shown in the topbar

        # toggle between standard and fullscreen mode
        When the user selects "Enter full screen mode"
        # should we use text that is on labels at all or just describe the action?
        # reasoning: label text might change or be different if the UI is set to a different language...
        Then the 3D model should be displayed in full screen mode
        And the topbar shouldn't be visible
        When the user selects "Exit full screen mode"
        # do we need a differentiation for exit by using the exit control element and exit by "ESC" key?
        Then the 3D model should be display in standard mode
        And the file name "model1.glb" should be shown in the topbar

        # rotate, zoom and reset 3D model
        When the user rotates the model
        And the user zooms into the model
        Then the size and position of the 3D model should be changed accordingly
        When the user selects "Reset"
        Then the 3D model should be display in the default size and position

        # show preview/next model
        When the user selects "Show next model"
        Then the 3D model "model2.glb" should be displayed
        And the file name "model2.glb" should be shown in the topbar
        When the user selects "Show previous model"
        Then the 3D model "model1.glb" should be displayed
        And the file name "model1.glb" should be shown in the topbar
