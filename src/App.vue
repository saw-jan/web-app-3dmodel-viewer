<template>
  <div
    v-if="hasWebGLSupport"
    id="scene-wrapper"
    ref="sceneWrapper"
    :class="isModelReady ? 'model-viewport' : ''"
    @mousedown="changeCursor('grabbing')"
    @mouseup="changeCursor('grab')"
  >
    <div v-if="hasError">
      <NoContentMessage icon="file-warning">
        <template #message>
          <span>Something went wrong. Cannot render the model</span>
        </template>
      </NoContentMessage>
    </div>
    <div
      v-else-if="!isModelReady"
      id="spinner"
      class="oc-flex oc-flex-column oc-flex-middle oc-flex-center oc-height-1-1 oc-width-1-1"
    >
      <AppLoadingSpinner />
      <label class="oc-p-s">{{ loadingProgress }}%</label>
    </div>
    <PreviewControls
      class="oc-position-absolute oc-position-bottom-center"
      :total-models="modelFiles.length"
      :active-index="activeIndex"
      :is-full-screen-mode-activated="isFullScreenModeActivated"
      @toggle-previous="prev"
      @toggle-next="next"
      @toggle-full-screen="toggleFullscreenMode"
      @reset-position="resetModelPosition"
    />
  </div>
  <div v-else>
    <NoContentMessage icon="error-warning">
      <template #message>
        <span>This browser doesn't support WebGL</span>
      </template>
    </NoContentMessage>
  </div>
</template>

<script setup lang="ts">
import { ref, unref, onMounted, onBeforeUnmount, computed } from 'vue'
import {
  AmbientLight,
  AxesHelper,
  Scene,
  Mesh,
  PerspectiveCamera,
  PointLight,
  WebGLRenderer,
  ACESFilmicToneMapping,
  EquirectangularReflectionMapping,
  Box3,
  Vector3,
  Euler,
  TextureLoader,
  MeshPhongMaterial
} from 'three'
import WebGL from 'three/examples/jsm/capabilities/WebGL'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {
  AppLoadingSpinner,
  NoContentMessage,
  useAppDefaults,
  useRouteQuery,
  sortHelper,
  createFileRouteOptions,
  useRoute,
  useRouter,
  useAppFileHandling,
  useClientService
} from '@ownclouders/web-pkg'
import { Resource } from '@ownclouders/web-client/src'
import PreviewControls from './components/PreviewControls.vue'
import { supportedExtensions, supportedMimeTypes } from './mimeTypes'
import { id as appId } from '../public/manifest.json'

const environment = new URL('./assets/custom_light.jpg', import.meta.url).href

const router = useRouter()
const route = useRoute()
const contextRouteQuery = useRouteQuery('contextRouteQuery')
const { getUrlForResource } = useAppFileHandling({ clientService: useClientService() })
const { activeFiles, currentFileContext, loadFolderForFileContext } = useAppDefaults({
  applicationId: appId
})

// 3d canvas
let camera: PerspectiveCamera, renderer: WebGLRenderer, controls: OrbitControls
const scene: Scene = new Scene()
let iniCamPosition: Vector3 | null = null
let iniCamZPosition: number = 0
const iniCamRotation: Euler = new Euler(0, 0, 0)
const animTimeoutSec = 1

// =====================
// props
// =====================
defineProps({
  url: {
    type: String,
    required: true
  }
})

// =====================
// states
// =====================
const sceneWrapper = ref<HTMLElement | undefined>()
const hasWebGLSupport = ref<boolean>(WebGL.isWebGLAvailable())
const loadingModel = ref<boolean>(true)
const hasError = ref<boolean>(false)
const loadingProgress = ref<number>(0)
const isFullScreenModeActivated = ref<boolean>(false)
const activeIndex = ref<number>(0)
const animationId = ref<number | undefined>()
const currentUrl = ref<string>()
const currentModel = ref()

// =====================
// lifecycle hooks
// =====================
onMounted(async () => {
  await loadFolderForFileContext(unref(currentFileContext))
  await setActiveModel(unref(currentFileContext).driveAliasAndItem as string)

  if (unref(hasWebGLSupport)) {
    const { offsetWidth, offsetHeight } = unref(sceneWrapper)

    camera = new PerspectiveCamera(50, offsetWidth / offsetHeight, 0.1, 1000)
    camera.rotation.copy(iniCamRotation)

    renderer = new WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(offsetWidth, offsetHeight)
    renderer.toneMapping = ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2

    // camera controls
    controls = new OrbitControls(camera, renderer.domElement)
    controls.minDistance = 0
    controls.maxDistance = 100

    // load environment texture
    try {
      await loadEnvironment()
      await renderModel(unref(fileType))
      loadLights()
    } catch (e) {
      teardown3dScene()
      hasError.value = true
    }
  }
})
onBeforeUnmount(() => {
  teardown3dScene()
})

// =====================
// computed properties
// =====================
const isModelReady = computed(() => !unref(loadingModel) && !unref(hasError))
const sortBy = computed(() => {
  if (!unref(contextRouteQuery)) {
    return 'name'
  }
  return unref(contextRouteQuery)['sort-by'] ?? 'name'
})
const sortDir = computed(() => {
  if (!unref(contextRouteQuery)) {
    return 'desc'
  }
  return unref(contextRouteQuery)['sort-dir'] ?? 'asc'
})
const modelFiles = computed<Resource[]>(() => {
  if (!unref(activeFiles)) {
    return []
  }

  const files = unref(activeFiles).filter((file: Resource) => {
    return (
      supportedExtensions.includes(file.extension?.toLowerCase()) &&
      supportedMimeTypes.includes(file.mimeType?.toLowerCase())
    )
  })

  return sortHelper(files, [{ name: unref(sortBy) }], unref(sortBy), unref(sortDir))
})
const activeModelFile = computed(() => unref(modelFiles)[unref(activeIndex)])
const fileType = computed(() => unref(activeModelFile)?.extension)

// =====================
// methods
// =====================
async function updateUrl() {
  currentUrl.value = await getUrlForResource(
    unref(currentFileContext).space,
    unref(activeModelFile)
  )
}

async function loadEnvironment() {
  const texture = await new TextureLoader().loadAsync(environment)
  texture.mapping = EquirectangularReflectionMapping
  scene.environment = texture
}

const LoaderMap = {
  glb: GLTFLoader,
  stl: STLLoader,
  fbx: FBXLoader,
  obj: OBJLoader,
  ply: PLYLoader
}

const materialParams = {
  transparent: true,
  opacity: 0.8,
  color: 0xd7d7d7,
  flatShading: true
}

const lightParams = {
  color: 0xffffff,
  intensity: 1000,
  posX: 2.5,
  posY: 15,
  posZ: 25,
  ambient: true
}

async function renderModel(extension: string) {
  const ModelLoader = LoaderMap[extension]

  const model = await new ModelLoader().loadAsync(unref(currentUrl), (xhr) => {
    const downloaded = Math.floor((xhr.loaded / xhr.total) * 100)
    if (downloaded % 5 === 0) {
      loadingProgress.value = downloaded
    }
  })

  if (import.meta.env.MODE === 'development') {
    debug(model)
  }

  const box = new Box3()
  if (!model.hasOwnProperty('scene') && ['stl', 'ply'].includes(extension)) {
    const mesh = new Mesh(model, defaultMaterial())
    scene.add(mesh)
    box.setFromBufferAttribute(model.attributes.position)
  } else if (!model.hasOwnProperty('scene') && (extension === 'fbx' || extension === 'obj')) {
    box.setFromObject(model)
    model.traverse(function (child) {
      if (child.isMesh) {
        child.material = defaultMaterial()
      }
    })
    scene.add(model)
  } else {
    box.setFromObject(model.scene)
  }

  iniCamPosition = box.getCenter(new Vector3())

  // direct camera at model
  camera.position.copy(iniCamPosition)
  iniCamZPosition = box.getSize(new Vector3()).length() + 1
  camera.position.z = iniCamZPosition
  camera.lookAt(iniCamPosition)

  loadingModel.value = false
  if (extension === 'glb') {
    const modelScene = model.scene
    // center model
    modelScene.position.sub(iniCamPosition)
    scene.add(modelScene)
    currentModel.value = modelScene
  } else {
    currentModel.value = scene
  }

  unref(sceneWrapper).appendChild(renderer.domElement)
  render(Date.now())
}

function loadLights(): void {
  const light = new PointLight(lightParams.color, lightParams.intensity)
  light.position.set(lightParams.posX, lightParams.posY, lightParams.posZ)
  scene.add(light)

  if (lightParams.ambient) {
    const ambientLight = new AmbientLight()
    scene.add(ambientLight)
  }
}

function defaultMaterial(): MeshPhongMaterial {
  return new MeshPhongMaterial(materialParams)
}

function render(animStartTime: number) {
  animationId.value = requestAnimationFrame(() => render(animStartTime))
  // TODO: enable animation
  // const elapsedTime = (Date.now() - animStartTime) / 1000
  // if (elapsedTime < animTimeoutSec) {
  //   camera.position.x -= iniCamZPosition * 0.01
  //   camera.position.z -= iniCamZPosition * 0.01
  // }
  controls.update()
  renderer.render(scene, camera)
}

async function renderNewModel() {
  cancelAnimationFrame(unref(animationId))

  await updateUrl()

  loadingModel.value = true
  hasError.value = false
  await renderModel(unref(fileType))
}

function unloadCurrentModel(): void {
  for (let i = scene.children.length - 1; i >= 0; i--) {
    let obj = scene.children[i]
    if (unref(obj.type) === 'Group' || unref(obj.type) === 'Mesh') {
      scene.remove(obj)
    }
  }
}

function teardown3dScene() {
  cancelAnimationFrame(unref(animationId))
  unloadCurrentModel()
  renderer.dispose()
}

function changeCursor(state: string) {
  const el = unref(sceneWrapper)
  if (el.classList.contains('model-viewport')) {
    el.style.cursor = state
  }
}

async function setActiveModel(driveAliasAndItem: string) {
  for (let i = 0; i < unref(modelFiles).length; i++) {
    if (
      unref(unref(currentFileContext).space)?.getDriveAliasAndItem(unref(modelFiles)[i]) ===
      driveAliasAndItem
    ) {
      activeIndex.value = i
      await updateUrl()
      return
    }
  }
}

function updateLocalHistory() {
  if (!unref(currentFileContext)) {
    return
  }

  const { params, query } = createFileRouteOptions(
    unref(currentFileContext).space,
    unref(activeModelFile)
  )
  router.replace({
    ...unref(route),
    params: { ...unref(route).params, ...params },
    query: { ...unref(route).query, ...query }
  })
}

async function next() {
  if (!unref(isModelReady)) {
    return
  }

  if (unref(activeIndex) + 1 >= unref(modelFiles).length) {
    activeIndex.value = 0
  } else {
    activeIndex.value++
  }

  updateLocalHistory()
  unloadCurrentModel()
  // TODO: how to prevent activeFiles from being reduced
  // load activeFiles
  await loadFolderForFileContext(unref(currentFileContext))
  await renderNewModel()
}

async function prev() {
  if (!unref(isModelReady)) {
    return
  }

  if (unref(activeIndex) === 0) {
    activeIndex.value = unref(modelFiles).length - 1
  } else {
    activeIndex.value--
  }

  updateLocalHistory()
  unloadCurrentModel()
  // TODO: how to prevent activeFiles from being reduced
  // load activeFiles
  await loadFolderForFileContext(unref(currentFileContext))
  await renderNewModel()
}

function toggleFullscreenMode() {
  const activateFullscreen = !unref(isFullScreenModeActivated)
  const el = unref(sceneWrapper)
  isFullScreenModeActivated.value = activateFullscreen
  if (activateFullscreen) {
    if (el.requestFullscreen) {
      el.requestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }
}

function resetModelPosition() {
  if (unref(isModelReady)) {
    camera.position.copy(iniCamPosition)
    camera.position.z = iniCamZPosition
    camera.rotation.copy(iniCamRotation)
    camera.lookAt(iniCamPosition)
  }
}

function debug(model: object) {
  scene.add(new AxesHelper(10))
  console.log('####### DEBUG 3D MODEL #######')
  console.log(model)
  console.log('#####################')
}
</script>

<style lang="scss" scoped>
#scene-wrapper {
  width: 100%;
  height: 100%;
  background-color: var(--oc-color-background-default);

  &.model-viewport {
    cursor: grab;
  }
}

#spinner {
  & > div {
    width: unset;
    height: unset;
  }
}
</style>
