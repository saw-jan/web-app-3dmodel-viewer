# 3D Model Viewer - ownCloud Web Extension

![3d model viewer ui](./docs/ss-light.png)

This is an extension for [ownCloud web](https://github.com/owncloud/web) for viewing 3D files. Currently, it can only display 3D models in `.glb` file format.

## Feature Highlights ✨

- Supported formats: [`.glb`]
- Zoom/Rotate model
- Fullscreen view
- Navigate between model files

## Docker Image

This extension is available as docker image: [sawjan/web-app-3dmodel-viewer](https://hub.docker.com/r/sawjan/web-app-3dmodel-viewer/tags)

Run the extension container with:

```bash
docker run --rm -p3000:80 sawjan/web-app-3dmodel-viewer
```
You can access the app at https://host.docker.internal:9200

## Build and Run

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

The app currently only supports 3D models in `.glb` format. You can find models on the following platforms:

- [sketchfab](https://sketchfab.com/)
- [3Dexport](https://3dexport.com/free-3d-models)
- [archive3D](https://archive3d.net/)
- [clara.io](https://clara.io/library)
- [downloadfree3D](https://downloadfree3d.com/file-format/glb/)
- [free3D](https://free3d.com/)
- [sketchup](https://3dwarehouse.sketchup.com/)
- [turbosquid](https://www.turbosquid.com/Search/3D-Models/free)
