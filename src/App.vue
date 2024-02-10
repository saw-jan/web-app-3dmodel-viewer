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
  Vector3
} from 'three'
import WebGL from 'three/examples/jsm/capabilities/WebGL'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { AppLoadingSpinner, NoContentMessage } from '@ownclouders/web-pkg'

const environment = new URL('./assets/warehouse_1k.hdr', import.meta.url).href

// 3d canvas
let camera: PerspectiveCamera, renderer: WebGLRenderer, controls: OrbitControls
const scene: Scene = new Scene()

// props
const props = defineProps({ url: String })

// states
const sceneWrapper = ref<HTMLElement | undefined>()
const hasWebGLSupport = ref<boolean>(WebGL.isWebGLAvailable())
const loadingModel = ref<boolean>(true)
const hasError = ref<boolean>(false)
const loadingProgress = ref<number>(0)

onMounted(() => {
  if (unref(hasWebGLSupport)) {
    const { offsetWidth, offsetHeight } = unref(sceneWrapper)

    camera = new PerspectiveCamera(50, offsetWidth / offsetHeight, 0.1, 1000)

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

// methods
function renderModel() {
  const loader = new GLTFLoader()
  loader.load(
    props.url,
    (model) => {
      const modelScene = model.scene

      // model size
      const box = new Box3().setFromObject(modelScene)
      const center = box.getCenter(new Vector3())
      camera.position.copy(center)
      camera.position.z += box.getSize(new Vector3()).length() + 1
      camera.lookAt(center)

      // center model
      modelScene.position.sub(center)
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
