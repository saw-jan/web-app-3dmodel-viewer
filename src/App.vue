<template>
  <AppBanner :file-id="fileId" />
  <main id="preview" ref="preview" class="oc-width-1-1" tabindex="-1" @keydown.esc="closeApp">
    <h1 class="oc-invisible-sr" v-text="pageTitle" />
    <AppTopBar :resource="activeModelFile" @close="closeApp" />
    <div class="oc-flex oc-width-1-1 oc-height-1-1">
      <div
        v-if="hasWebGLSupport"
        ref="sceneWrapper"
        id="scene-wrapper"
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
          :files="modelFiles"
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
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, unref, onMounted, onBeforeUnmount, computed } from 'vue'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  ACESFilmicToneMapping,
  EquirectangularReflectionMapping,
  Box3,
  Vector3,
  Euler,
  TextureLoader
} from 'three'
import WebGL from 'three/examples/jsm/capabilities/WebGL'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
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
  useClientService,
  AppBanner,
  AppTopBar
} from '@ownclouders/web-pkg'
import { Resource } from '@ownclouders/web-client/src'
import PreviewControls from './components/PreviewControls.vue'

const environment = new URL('./assets/custom_light.jpg', import.meta.url).href
const supportExtensions = ['glb']

const router = useRouter()
const route = useRoute()
const contextRouteQuery = useRouteQuery('contextRouteQuery')
const { getUrlForResource } = useAppFileHandling({ clientService: useClientService() })
const { activeFiles, currentFileContext, closeApp, loadFolderForFileContext } = useAppDefaults({
  applicationId: '3dmodel-viewer'
})

// 3d canvas
let camera: PerspectiveCamera, renderer: WebGLRenderer, controls: OrbitControls
const scene: Scene = new Scene()
let iniCamPosition: Vector3 | null = null
let iniCamZPosition: number = 0
const iniCamRotation: Euler = new Euler(0, 0, 0)
const animTimeoutSec = 2

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
const url = ref<string>()
const currentModel = ref()

// =====================
// lifecycle hooks
// =====================
onMounted(async () => {
  await loadFolderForFileContext(unref(currentFileContext))
  await setActiveModel(unref(currentFileContext).driveAliasAndItem)

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
    controls.minDistance = 1
    controls.maxDistance = 100

    // load environment texture
    try {
      await loadEnvironment()
      await renderModel()
    } catch (e) {
      cleanup3dScene()
      hasError.value = true
    }
  }
})
onBeforeUnmount(() => {
  cleanup3dScene()
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
    return supportExtensions.includes(file.extension?.toLowerCase())
  })

  return sortHelper(files, [{ name: unref(sortBy) }], unref(sortBy), unref(sortDir))
})
const activeModelFile = computed(() => unref(modelFiles)[unref(activeIndex)])
const pageTitle = computed(() => `Preview for ${unref(activeModelFile)?.name}`)
const fileId = computed(() => unref(currentFileContext).itemId)

// =====================
// methods
// =====================
async function updateUrl() {
  url.value = await getUrlForResource(unref(currentFileContext).space, unref(activeModelFile))
}
async function loadEnvironment() {
  const texture = await new TextureLoader().loadAsync(environment)
  texture.mapping = EquirectangularReflectionMapping
  scene.environment = texture
}
async function renderModel() {
  const model = await new GLTFLoader().loadAsync(unref(url), (xhr) => {
    const downloaded = Math.floor((xhr.loaded / xhr.total) * 100)
    if (downloaded % 5 === 0) {
      loadingProgress.value = downloaded
    }
  })

  const modelScene = model.scene
  // model size
  const box = new Box3().setFromObject(modelScene)
  iniCamPosition = box.getCenter(new Vector3())

  // direct camera at model
  camera.position.copy(iniCamPosition)
  iniCamZPosition = box.getSize(new Vector3()).length() + 1
  camera.position.z = iniCamZPosition
  camera.lookAt(iniCamPosition)

  // center model
  modelScene.position.sub(iniCamPosition)
  scene.add(modelScene)

  loadingModel.value = false
  currentModel.value = modelScene
  unref(sceneWrapper).appendChild(renderer.domElement)
  render(Date.now())
}
function render(animStartTime: number) {
  animationId.value = requestAnimationFrame(() => render(animStartTime))
  const elapsedTime = (Date.now() - animStartTime) / 1000
  if (elapsedTime < animTimeoutSec) {
    camera.position.x -= iniCamZPosition * 0.01
    camera.position.z -= iniCamZPosition * 0.01
  }
  controls.update()
  renderer.render(scene, camera)
}
async function renderNewModel() {
  cancelAnimationFrame(unref(animationId))
  scene.remove(scene.getObjectByName(unref(currentModel).name))

  await updateUrl()

  loadingModel.value = true
  hasError.value = false
  await renderModel()
}
function cleanup3dScene() {
  scene.traverse((obj) => {
    scene.remove(obj)
  })
  cancelAnimationFrame(unref(animationId))
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
