<template>
  <div
    v-if="hasWebGLSupport"
    ref="sceneWrapper"
    id="scene-wrapper"
    :class="isModelReady ? 'model-viewport' : ''"
    @mousedown="changeCursor('grabbing')"
    @mouseup="changeCursor('grab')"
  >
    <div
      v-if="!isModelReady"
      id="spinner"
      class="oc-flex oc-flex-column oc-flex-middle oc-flex-center oc-height-1-1 oc-width-1-1"
    >
      <AppLoadingSpinner />
      <label class="oc-p-s">{{ loadingProgress }}%</label>
    </div>
    <div v-else-if="hasError">
      <NoContentMessage icon="file-warning">
        <template #message>
          <span>Something went wrong. Cannot render the model</span>
        </template>
      </NoContentMessage>
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
  Euler
} from 'three'
import WebGL from 'three/examples/jsm/capabilities/WebGL'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {
  AppLoadingSpinner,
  NoContentMessage,
  useAppDefaults,
  useRouteQuery,
  sortHelper,
  createFileRouteOptions,
  useRoute,
  useRouter
} from '@ownclouders/web-pkg'
import { Resource } from '@ownclouders/web-client/src'
import PreviewControls from './components/PreviewControls.vue'

const environment = new URL('./assets/warehouse_1k.hdr', import.meta.url).href

const router = useRouter()
const route = useRoute()
const contextRouteQuery = useRouteQuery('contextRouteQuery')
const appDefaults = useAppDefaults({ applicationId: '3dmodel-viewer' })
// Todo: 'activeFiles' only contains current file
const { activeFiles, currentFileContext } = appDefaults

const supportExtensions = ['glb']

// 3d canvas
let camera: PerspectiveCamera, renderer: WebGLRenderer, controls: OrbitControls
const scene: Scene = new Scene()
let iniCamPosition: Vector3 | null = null
let iniCamZPosition: number = 0
const iniCamRotation: Euler = new Euler(0, 0, 0)

// props
const props = defineProps({ url: String })

// states
const sceneWrapper = ref<HTMLElement | undefined>()
const hasWebGLSupport = ref<boolean>(WebGL.isWebGLAvailable())
const loadingModel = ref<boolean>(true)
const hasError = ref<boolean>(false)
const loadingProgress = ref<number>(0)
const isFullScreenModeActivated = ref<boolean>(false)
const activeIndex = ref<number>(0)

onMounted(() => {
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

    // add environment texture
    new RGBELoader().load(
      environment,
      (texture) => {
        texture.mapping = EquirectangularReflectionMapping
        scene.environment = texture

        renderModel()
      },
      (xhr) => {}, // onProgress
      () => {
        hasError.value = true
      }
    )
  }
})

onBeforeUnmount(() => {
  scene.traverse((obj) => {
    scene.remove(obj)
  })
  renderer.dispose()
})

// computed properties
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
const activeModelFile = computed(() => {
  return unref(modelFiles)[unref(activeIndex)]
})

const updateLocalHistory = () => {
  if (!unref(currentFileContext)) {
    return
  }

  const { params, query } = createFileRouteOptions(
    unref(unref(currentFileContext).space),
    unref(activeModelFile)
  )
  router.replace({
    ...unref(route),
    params: { ...unref(route).params, ...params },
    query: { ...unref(route).query, ...query }
  })
}

// methods
function renderModel() {
  const loader = new GLTFLoader()
  loader.load(
    props.url,
    (model) => {
      const modelScene = model.scene

      // model size
      const box = new Box3().setFromObject(modelScene)
      iniCamPosition = box.getCenter(new Vector3())

      // set camera at model
      camera.position.copy(iniCamPosition)
      iniCamZPosition += box.getSize(new Vector3()).length() + 1
      camera.position.z = iniCamZPosition
      camera.lookAt(iniCamPosition)

      // center model
      modelScene.position.sub(iniCamPosition)
      scene.add(modelScene)

      loadingModel.value = false
      unref(sceneWrapper).appendChild(renderer.domElement)
      render()
    },
    (xhr) => {
      const downloaded = Math.floor((xhr.loaded / xhr.total) * 100)
      if (downloaded % 5 === 0) {
        loadingProgress.value = downloaded
      }
    },
    () => {
      hasError.value = true
    }
  )
}

function render() {
  requestAnimationFrame(render)
  controls.update()
  renderer.render(scene, camera)
}

function changeCursor(state: string) {
  const el = unref(sceneWrapper)
  if (el.classList.contains('model-viewport')) {
    el.style.cursor = state
  }
}

function next() {
  if (!isModelReady) {
    return
  }
  if (unref(activeIndex) + 1 >= unref(modelFiles).length) {
    activeIndex.value = 0
    updateLocalHistory()
    return
  }
  activeIndex.value++
  updateLocalHistory()
}

function prev() {
  if (!isModelReady) {
    return
  }
  if (unref(activeIndex) === 0) {
    activeIndex.value = unref(modelFiles).length - 1
    updateLocalHistory()
    return
  }
  activeIndex.value--
  updateLocalHistory()
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
  camera.position.copy(iniCamPosition)
  camera.position.z = iniCamZPosition
  camera.rotation.copy(iniCamRotation)
  camera.lookAt(iniCamPosition)
}
</script>

<style lang="scss" scoped>
#scene-wrapper {
  width: 100%;
  height: 100%;

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
