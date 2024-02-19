# 3D Model Viewer - ownCloud Web Extension

![3d model viewer ui](./docs/ss-light.png)

It is an extension for [ownCloud web](https://github.com/owncloud/web) for viewing 3D files. Currently, it can only open `.glb` file format.

## Feature Highlights ✨

- Zoom/Rotate model
- Fullscreen view
- Navigate between model files

## Docker Image

This extension is available as docker image: [sawjan/web-app-3dmodel-viewer](https://hub.docker.com/r/sawjan/web-app-3dmodel-viewer/tags)

Run the extension container with:

```bash
docker run --rm -p3000:80 sawjan/web-app-3dmodel-viewer
```

## Build and Run

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

   Now, you can access the web at https://localhost:9200

For 3D models: [sketchfab](https://sketchfab.com/) (Download the models in `.glb` format)
