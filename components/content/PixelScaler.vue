<template>
  <div class="pixel-scaler dragArea">
    <div v-show="isShowOverlay" class="drag-overlay dragArea">
      <div class="drag-overlay-cover dragArea" />
      <div class="drag-overlay-inside dragArea">
        変換したいドット画像をドロップ
      </div>
    </div>
    <PixelScalerTop class="dragArea" :input-data="inputData" />
    <PixelScalerBottom class="dragArea" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PixelScalerTop from './PixelScalerTop.vue'
import PixelScalerBottom from './PixelScalerBottom.vue'

export default Vue.extend({
  components: {
    PixelScalerTop,
    PixelScalerBottom
  },
  data() {
    return {
      isShowOverlay: false,
      inputData: ''
    }
  },
  mounted() {
    document.addEventListener(
      'dragover',
      (event: DragEvent) => {
        event.preventDefault()
        if (event !== null && event.target !== null) {
          const elem = event.target as HTMLElement
          if (elem.className.includes('dragArea')) {
            this.isShowOverlay = true
          }
        }
      },
      false
    )
    document.addEventListener(
      'dragleave',
      (event: DragEvent) => {
        if (event !== null && event.target !== null) {
          const elem = event.target as HTMLElement
          if (elem.className.includes('drag-overlay-cover')) {
            this.isShowOverlay = false
          }
        }
      },
      false
    )
    document.addEventListener(
      'drop',
      (event: DragEvent) => {
        event.preventDefault()
        if (event !== null) {
          if (event.target !== null) {
            const elem = event.target as HTMLElement
            if (elem.className.includes('dragArea')) {
              this.isShowOverlay = false
            }
          }
          if (
            event.dataTransfer !== null &&
            event.dataTransfer.files[0] !== undefined
          ) {
            const data = event.dataTransfer.files[0]
            if (data.type === 'image/png') {
              const blob = data.slice(0, data.size, data.type)
              this.inputData = URL.createObjectURL(blob)
            }
          }
        }
      },
      false
    )
  }
})
</script>

<style lang="scss">
.pixel-scaler {
  position: relative;
}
.drag-overlay {
  @include absolute-centering;
  padding: 10px;
  opacity: 0.9;
  background: #fff;

  &-inside {
    height: 100%;
    border: dashed #eee 10px;
    color: #999;
    font-size: 1.6em;
    @include flex-centering(row);
  }

  &-cover {
    @include absolute-centering;
  }
}
</style>
