<template>
  <div ref="pixelScaler" class="pixel-scaler" draggable="false">
    <div v-show="isShowErrorOverlay" class="error-overlay" @click="closeErrorOverlay()">
      <div class="error-overlay-close" @click="closeErrorOverlay()">
        <v-icon color="white" large>mdi-close-thick</v-icon>
      </div>
      <div class="error-overlay-text">
        {{ currentError }}
      </div>
    </div>

    <div v-show="isShowDragOverlay" class="drag-overlay">
      <div class="drag-overlay-cover" />
      <div class="drag-overlay-inside">
        {{ '変換したいドット画像をドロップ' }}
      </div>
    </div>

    <LoadButton
      :input-accept="inputAccept"
      :image-loaded="imageLoaded"
      :image-converting="imageConverting"
      @input-changed="inputChanged"
    />

    <transition name="fade" mode="out-in">
      <Description v-if="!imageLoaded" />
      <PixelScalerInside
        v-else
        :input-name="inputName"
        :input-data="inputData"
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

enum ErrorType {
  inputSizeOver,
  inputReadError,
  inputTypeError
}

export default Vue.extend({
  components: {
    Description,
    LoadButton,
    PixelScalerInside
  },
  data() {
    return {
      isShowErrorOverlay: false,
      isShowDragOverlay: false,
      inputAccept: 'image/png',
      inputData: '',
      inputName: '',
      imageLoaded: false,
      imageConverting: false,
      currentError: '',
      errorText: {
        inputSizeOver: '画像が大きすぎます。最大サイズは 512x512 です。',
        inputReadError: '画像が読み込めませんでした。',
        inputTypeError: 'ファイル形式は「.png」のみ対応しています。'
      }
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
            this.isShowDragOverlay = true
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
            this.isShowDragOverlay = false
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
        this.closeErrorOverlay()
        if (event !== null && event.target !== null) {
          const elem = event.target as HTMLElement
          if (elem.className.includes('drag-overlay-cover')) {
            this.isShowDragOverlay = false

            if (event.dataTransfer !== null && event.dataTransfer.files[0] !== undefined) {
              const data = event.dataTransfer.files[0]
              if (data.type === 'image/png') {
                // const blob = data.slice(0, data.size, data.type)
                const reader = new FileReader()
                reader.onload = async () => {
                  if (reader.result !== null) {
                    if (await this.isCheckImageSize(reader.result as string)) {
                      URL.revokeObjectURL(this.inputData)
                      this.inputName = this.getFileName(data.name)
                      this.inputData = reader.result as string
                      this.imageLoaded = true
                    } else {
                      this.showErrorOverlay(ErrorType.inputSizeOver)
                    }
                  } else {
                    this.showErrorOverlay(ErrorType.inputReadError)
                  }
                }
                reader.readAsDataURL(data)
              } else {
                this.showErrorOverlay(ErrorType.inputTypeError)
              }
            }
          }
        }
      },
      false
    )
  },
  methods: {
    getFileName(str: string) {
      const re = /\.[0-9a-zA-Z]+$/
      return str.replace(re, '')
    },
    inputChanged(event: any) {
      if (event !== null && event.target.files[0] !== undefined) {
        const data = event.target.files[0]
        if (data.type === 'image/png') {
          // const blob = data.slice(0, data.size, data.type)
          const reader = new FileReader()
          reader.onload = async () => {
            if (reader.result !== null) {
              if (await this.isCheckImageSize(reader.result as string)) {
                URL.revokeObjectURL(this.inputData)
                this.inputName = this.getFileName(data.name)
                this.inputData = reader.result as string
                this.imageLoaded = true
              } else {
                this.showErrorOverlay(ErrorType.inputSizeOver)
              }
            } else {
              this.showErrorOverlay(ErrorType.inputReadError)
            }
          }
          reader.readAsDataURL(data)
        } else {
          this.showErrorOverlay(ErrorType.inputTypeError)
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
    closeErrorOverlay() {
      this.isShowErrorOverlay = false
    },
    showErrorOverlay(type: ErrorType) {
      this.isShowErrorOverlay = true

      if (type === ErrorType.inputSizeOver) {
        this.currentError = this.errorText.inputSizeOver
      } else if (type === ErrorType.inputReadError) {
        this.currentError = this.errorText.inputReadError
      } else if (type === ErrorType.inputTypeError) {
        this.currentError = this.errorText.inputTypeError
      }
    }
  }
})
</script>

<style lang="scss">
.pixel-scaler {
  position: relative;
  width: 100%;
  margin: 10px 0;
  @include flex-centering(column);
  min-height: 500px;

  @media (orientation: portrait) {
    padding: 0 5px;
    min-height: initial;
    max-height: 80vh;
  }
}

.error-overlay {
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
    font-size: 1.6rem;
    height: 100px;
    padding: 30px;
    background: $color-white;
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
  background: $color-white;

  &-inside {
    height: 100%;
    border: dashed $color-whiteE 10px;
    color: $color-black9;
    font-size: 3rem;
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
