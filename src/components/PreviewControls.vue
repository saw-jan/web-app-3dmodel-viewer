<template>
  <div class="preview-controls">
    <div
      class="oc-background-brand oc-p-s oc-width-large oc-flex oc-flex-middle oc-flex-center oc-flex-around preview-controls-action-bar"
    >
      <oc-button
        v-oc-tooltip="previousDescription"
        class="preview-controls-previous"
        appearance="raw-inverse"
        variation="brand"
        :aria-label="previousDescription"
        @click="$emit('togglePrevious')"
      >
        <oc-icon size="large" name="arrow-drop-left" variation="inherit" />
      </oc-button>
      <p class="oc-m-rm preview-controls-action-count">
        <span aria-hidden="true" v-text="ariaHiddenFileCount" />
        <span class="oc-invisible-sr" v-text="screenreaderFileCount" />
      </p>
      <oc-button
        v-oc-tooltip="nextDescription"
        class="preview-controls-next"
        appearance="raw-inverse"
        variation="brand"
        :aria-label="nextDescription"
        @click="$emit('toggleNext')"
      >
        <oc-icon size="large" name="arrow-drop-right" variation="inherit" />
      </oc-button>
      <oc-button
        v-oc-tooltip="
          isFullScreenModeActivated ? exitFullScreenDescription : enterFullScreenDescription
        "
        class="preview-controls-fullscreen"
        appearance="raw-inverse"
        variation="brand"
        :aria-label="
          isFullScreenModeActivated ? exitFullScreenDescription : enterFullScreenDescription
        "
        @click="$emit('toggleFullScreen')"
      >
        <oc-icon
          fill-type="line"
          :name="isFullScreenModeActivated ? 'fullscreen-exit' : 'fullscreen'"
          variation="inherit"
        />
      </oc-button>
      <oc-button
        v-oc-tooltip="resetDescription"
        class="preview-controls-reset"
        appearance="raw-inverse"
        variation="brand"
        :aria-label="resetDescription"
        @click="$emit('resetPosition')"
      >
        <oc-icon fill-type="line" name="refresh" variation="inherit" />
      </oc-button>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { Resource } from '@ownclouders/web-client/src'

export default defineComponent({
  name: 'MediaControls',
  props: {
    files: {
      type: Array as PropType<Resource[]>,
      required: true
    },
    activeIndex: {
      type: Number,
      required: true
    },
    isFullScreenModeActivated: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggleFullScreen', 'toggleNext', 'togglePrevious', 'resetPosition'],
  setup(props, { emit }) {
    const ariaHiddenFileCount = computed(() => {
      return `${(props.activeIndex + 1).toString()} of ${props.files.length.toString()}`
    })
    const screenreaderFileCount = computed(() => {
      return `Media file ${(props.activeIndex + 1).toString()} of ${props.files.length.toString()}`
    })

    return {
      screenreaderFileCount,
      ariaHiddenFileCount,
      enterFullScreenDescription: 'Enter full screen mode',
      exitFullScreenDescription: 'Exit full screen mode',
      resetDescription: 'Reset model position',
      previousDescription: 'Show previous model',
      nextDescription: 'Show next model'
    }
  }
})
</script>

<style lang="scss" scoped>
.preview-controls {
  z-index: calc(var(--oc-z-index-modal) + 2);
  opacity: 0.9;
}

.preview-controls-action-count {
  color: var(--oc-color-swatch-brand-contrast);
}
</style>
