export const mimeTypes = {
  fbx: 'application/octet-stream',
  stl: 'application/vnd.ms-pki.stl',
  obj: 'application/x-tgif',
  glb: 'model/gltf-binary'
  // gltf: 'model/gltf+json'
}

export const supportedExtensions = Object.keys(mimeTypes)
export const supportedMimeTypes = Object.values(mimeTypes)
