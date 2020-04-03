<template>
  <div class="pixel-scaler dragArea" draggable="false">
    <div v-show="isShowOverlay" class="drag-overlay dragArea">
      <div class="drag-overlay-cover dragArea" />
      <div class="drag-overlay-inside dragArea">
        変換したいドット画像をドロップ
      </div>
    </div>

    <LoadButton
      :input-accept="inputAccept"
      :image-loaded="imageLoaded"
      @input-changed="inputChanged"
    />

    <transition name="fade" mode="out-in">
      <Description
        v-if="!imageLoaded"
        class="dragArea"
        :image-loaded="imageLoaded"
      />
      <PixelScalerInside
        v-else
        class="dragArea"
        :input-data="inputData"
        :image-loaded="imageLoaded"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Description from './Description.vue'
import LoadButton from './LoadButton.vue'
import PixelScalerInside from './PixelScalerInside.vue'

export default Vue.extend({
  components: {
    Description,
    LoadButton,
    PixelScalerInside
  },
  data() {
    return {
      isShowOverlay: false,
      inputAccept: 'image/png',
      inputData: '',
      imageLoaded: false
    }
  },
  mounted() {
    document.addEventListener(
      'dragover',
      (event: DragEvent) => {
        event.stopPropagation()
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
        event.stopPropagation()
        event.preventDefault()
        if (event !== null) {
          if (event.target !== null) {
            const elem = event.target as HTMLElement
            if (elem.className.includes('dragArea')) {
              this.isShowOverlay = false

              if (
                event.dataTransfer !== null &&
                event.dataTransfer.files[0] !== undefined
              ) {
                const data = event.dataTransfer.files[0]
                if (data.type === 'image/png') {
                  // const blob = data.slice(0, data.size, data.type)
                  this.inputData = URL.createObjectURL(data)
                  this.imageLoaded = true
                }
              }
            }
          }
        }
      },
      false
    )
  },
  methods: {
    inputChanged(event: any) {
      if (event !== null && event.target.files[0] !== undefined) {
        const data = event.target.files[0]
        if (data.type === 'image/png') {
          // const blob = data.slice(0, data.size, data.type)
          this.inputData = URL.createObjectURL(data)
          this.imageLoaded = true
        }
      }
    }
  }
})
</script>

<style lang="scss">
.pixel-scaler {
  position: relative;
  height: 500px;
  width: 100%;
  margin: 10px 0;
  @include flex-centering(column);
}
.drag-overlay {
  @include absolute-centering;
  z-index: 2;
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

.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  transition: opacity 1s ease;
}
.fade-enter-to {
  opacity: 1;
}
</style>
