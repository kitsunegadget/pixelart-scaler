<template>
  <div ref="pixelScaler" class="pixel-scaler" draggable="false">
    <div v-show="isShowImageSizeOver" class="image-size-over" @click="closeImageSizeOver($event)">
      <div class="image-size-over-close" @click="closeImageSizeOver($event)">
        <v-icon color="white" large>mdi-close-thick</v-icon>
      </div>
      <div class="image-size-over-text">
        画像が大きすぎます。最大サイズは 512x512 です。
      </div>
    </div>

    <div v-show="isShowOverlay" class="drag-overlay">
      <div class="drag-overlay-cover" />
      <div class="drag-overlay-inside">
        変換したいドット画像をドロップ
      </div>
    </div>

    <LoadButton
      class="dragArea"
      :input-accept="inputAccept"
      :image-loaded="imageLoaded"
      :image-converting="imageConverting"
      @input-changed="inputChanged"
    />

    <transition name="fade" mode="out-in">
      <Description v-if="!imageLoaded" />
      <PixelScalerInside
        v-else
        :input-data="inputData"
        :image-loaded="imageLoaded"
        :image-converting="imageConverting"
        @converting-state="convertingState"
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
      isShowImageSizeOver: false,
      isShowOverlay: false,
      inputAccept: 'image/png',
      inputData: '',
      imageLoaded: false,
      imageConverting: false
    }
  },
  mounted() {
    // document.addEventListener('dragenter', (event: DragEvent) => {
    //   event.stopPropagation()
    //   console.log(event.target)
    // })
    document.addEventListener(
      'dragover',
      (event: DragEvent) => {
        event.stopPropagation()
        event.preventDefault()
        if (event !== null && event.target !== null) {
          const elem = event.target as HTMLElement
          const pixelScaler = this.$refs.pixelScaler as HTMLElement
          if (pixelScaler !== undefined && pixelScaler.compareDocumentPosition(elem) & 16) {
            // if (elem.className.includes('dragArea') || elem.className.includes('convert-button')) {
            this.isShowOverlay = true
          } else if (event.dataTransfer !== null) {
            event.dataTransfer.dropEffect = 'none'
          }
        }
      },
      false
    )
    document.addEventListener(
      'dragleave',
      (event: DragEvent) => {
        event.stopPropagation()
        event.preventDefault()
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
            if (elem.className.includes('drag-overlay-cover')) {
              this.isShowOverlay = false

              if (event.dataTransfer !== null && event.dataTransfer.files[0] !== undefined) {
                const data = event.dataTransfer.files[0]
                if (data.type === 'image/png') {
                  // const blob = data.slice(0, data.size, data.type)
                  const reader = new FileReader()
                  reader.onload = async () => {
                    if (reader.result !== null) {
                      if (await this.isCheckImageSize(reader.result as string)) {
                        this.inputData = reader.result as string
                        this.imageLoaded = true
                      } else {
                        this.isShowImageSizeOver = true
                      }
                    }
                  }
                  reader.readAsDataURL(data)

                  // URL.revokeObjectURL(this.inputData)
                  // this.inputData = URL.createObjectURL(data)
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
          const reader = new FileReader()
          reader.onload = async () => {
            if (reader.result !== null) {
              if (await this.isCheckImageSize(reader.result as string)) {
                this.inputData = reader.result as string
                this.imageLoaded = true
              } else {
                this.isShowImageSizeOver = true
              }
            }
          }
          reader.readAsDataURL(data)

          // URL.revokeObjectURL(this.inputData)
          // this.inputData = URL.createObjectURL(data)
        }
      }
    },
    convertingState(status: boolean) {
      this.imageConverting = status
    },
    isCheckImageSize(data: string) {
      return new Promise(resolve => {
        const img = new Image()
        img.onload = () => {
          if (img.width > 512 || img.height > 512) {
            resolve(false)
          } else {
            resolve(true)
          }
        }
        img.src = data
      })
    },
    closeImageSizeOver(e: Event) {
      e.preventDefault()
      this.isShowImageSizeOver = false
    }
  }
})
</script>

<style lang="scss">
.pixel-scaler {
  position: relative;
  // height: 700px;
  width: 100%;
  margin: 10px 0;
  @include flex-centering(column);
  max-height: 80vh;
}

.image-size-over {
  z-index: 1;
  @include absolute-centering;
  @include flex-centering(column);
  background: #000a;
  cursor: pointer;

  &-close {
    margin-bottom: 30px;
    transition: all 0.5s ease;

    &:hover {
      transform: rotateZ(180deg);
    }
  }

  &-text {
    height: 100px;
    padding: 30px;
    background: #eee;
    @include flex-centering(row);
    color: $color-red1;
    cursor: initial;
  }
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
