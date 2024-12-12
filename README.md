# 3D Model Viewer - ownCloud Web Extension

![3d model viewer ui](./docs/ss-light.png)

This is an extension for [ownCloud web](https://github.com/owncloud/web) for viewing 3D files.

## Feature Highlights ✨

- Supported formats: [`.glb`, `.stl`, `.fbx`, `.obj`]
- Zoom/Rotate model
- Fullscreen view
- Navigate between model files

## [Demonstration](https://ocis.in-nepal.de/s/dSlOHjJcQSYuPxV)

## Installation

1. Download the zip file from the [releases page](https://github.com/saw-jan/web-app-3dmodel-viewer/releases)
2. Extract the zip file to the apps directory of the oCIS server, [which is set using the `WEB_ASSET_APPS_PATH` environment variable](https://doc.owncloud.com/ocis/next/deployment/webui/webui-customisation.html#extend-web-ui-with-apps)

### App Installation With [oCIS Deployment](https://github.com/owncloud/ocis/tree/master/deployments/examples/ocis_full)

1. Copy [`deployments/3dviewer.yaml`](./deployments/3dviewer.yaml) into the [web_extensions](https://github.com/owncloud/ocis/tree/master/deployments/examples/ocis_full/web_extensions)
   subfolder of oCIS full deployment example.
2. Add `MODEL_3D_VIEWER=:web_extensions/3dviewer.yaml` to the `## oCIS Web Extensions ##` section of the `.env` file of your installation (file is located in [deployments/examples/ocis_full](https://github.com/owncloud/ocis/tree/master/deployments/examples/ocis_full)) and append it to the `COMPOSE_FILE` variable.

   ```env
   ## oCIS Web Extensions ##
   MODEL_3D_VIEWER=:web_extensions/3dviewer.yaml

   COMPOSE_FILE=docker-compose.yml${...}${3D_VIEWER:-}
   ```

3. Run `docker compose up` to run oCIS with the extensions

   oCIS URL: [ocis.owncloud.test](https://ocis.owncloud.test)

   See the [docs](https://github.com/owncloud/ocis/tree/master/deployments/examples/ocis_full) for more information.

## Build and Run for development

For building and running the app from the code base, follow these steps:

1. Install the dependencies

   ```bash
   pnpm i
   ```

2. Build the extension

   ```bash
   pnpm build
   ```

   For development, build with watch.

   ```bash
   pnpm build:w
   ```

3. Start the extension and the web services

   ```bash
   docker compose up
   ```

Now, you can access the app at https://localhost:9200

## 3D models

You can find models on the following platforms:

- [sketchfab](https://sketchfab.com/)
- [3Dexport](https://3dexport.com/free-3d-models)
- [archive3D](https://archive3d.net/)
- [clara.io](https://clara.io/library)
- [downloadfree3D](https://downloadfree3d.com/file-format/glb/)
- [free3D](https://free3d.com/)
- [sketchup](https://3dwarehouse.sketchup.com/)
- [turbosquid](https://www.turbosquid.com/Search/3D-Models/free)
