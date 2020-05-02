<template>
  <div class="pixel-scaler-inside">
    <PixelScalerInsideAbove @click-save="clickSave" />
    <div class="pixel-scaler-inside-below">
      <PixelScalerType
        :converting="converting"
        :current-filter="currentFilter"
        @convert-start="convertClick"
      />
      <div class="output-image" v-bind="{ expand: !canvasExpanded }" @click="changeCanvasExpand">
        <canvas ref="outputCanvas"></canvas>
        <!-- <img class="image" :src="outputData" draggable="false" /> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// import axios from 'axios'
import PixelScalerInsideAbove from './PixelScalerInsideAbove.vue'
import PixelScalerType from './PixelScalerType.vue'
import PxFilter, { StandardFilter } from '@/modules/PixelFilter'
import Worker from '@/modules/convert.worker'

let worker: any
let inputImageData: ImageData

export default Vue.extend({
  components: {
    PixelScalerInsideAbove,
    PixelScalerType
  },
  props: {
    inputName: {
      type: String,
      default: '',
      required: true
    },
    inputData: {
      type: String,
      default: '',
      required: true
    }
  },
  data() {
    return {
      // outputData: '',
      converting: false,
      currentFilter: 'NoScale',
      canvasExpanded: false
    }
  },
  watch: {
    // watchが変更されても初マウント時は反応しないので注意
    // 初回はmountedで対処
    inputData() {
      const img = new Image()
      img.src = this.inputData
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (ctx) {
          // 入力画像とキャンバスサイズを合わせないと
          // ImageDataでcanvasをオーバーした画素が取得出来ない
          ctx.canvas.width = img.width
          ctx.canvas.height = img.height
          ctx.drawImage(img, 0, 0)
          img.style.display = 'none'
          inputImageData = ctx.getImageData(0, 0, img.width, img.height)
        }
        this.convertClick(this.currentFilter)
      }
    },
    converting() {
      this.$emit('converting-state', this.converting)
    }
  },
  mounted() {
    worker = new Worker()

    const img = new Image()
    img.src = this.inputData
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // 入力画像とキャンバスサイズを合わせないと
        // ImageDataでcanvasをオーバーした画素が取得出来ない
        ctx.canvas.width = img.width
        ctx.canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        img.style.display = 'none'
        inputImageData = ctx.getImageData(0, 0, img.width, img.height)
      }
      this.convertClick(this.currentFilter)
    }
  },
  destroyed() {
    worker.terminate()
  },
  methods: {
    convertClick(type: string) {
      if (this.converting) {
        // 変換中に再度押せないように
        return
      }
      this.converting = true
      this.currentFilter = type
      setTimeout(() => {
        // 仮想DOMの一括レンダーから逃れるためのタイムアウト
        // const a = performance.now()
        const canvas = this.$refs.outputCanvas as HTMLCanvasElement
        const ctx = canvas.getContext('2d')

        if (ctx) {
          // webWorkerによる並列処理
          if (window.Worker) {
            worker.postMessage([inputImageData, type])

            worker.onmessage = (e: MessageEvent) => {
              ctx.canvas.width = inputImageData.width * e.data.scales
              ctx.canvas.height = inputImageData.height * e.data.scales
              ctx.putImageData(e.data.imageData, 0, 0)
              this.converting = false

              // const b = performance.now()
              // console.log('displayTime: ', b - a)
            }
          } else {
            // Workerが使えない場合
            let newImageData
            let scale = 1
            if (type === 'NoScale') {
              // this.outputData = this.inputData
              //
            } else if (type === 'invert') {
              newImageData = StandardFilter.invert(inputImageData)
              //
            } else if (type === 'grayscale') {
              newImageData = StandardFilter.grayScale(inputImageData)
              //
            } else if (type === 'binarization') {
              newImageData = StandardFilter.binarization(inputImageData, 127)
              //
            } else if (type === 'Epx') {
              scale = 2
              newImageData = PxFilter.EPX(inputImageData, 2)
              //
            } else if (type === 'Scale3x') {
              scale = 3
              newImageData = PxFilter.EPX(inputImageData, 3)
              //
            } else if (type === 'Scale4x') {
              scale = 4
              newImageData = PxFilter.EPX(inputImageData, 4)
              //
            } else if (type === 'EpxB') {
              scale = 2
              newImageData = PxFilter.SNES9x(inputImageData, 2, 'B')
              //
            } else if (type === 'EpxC') {
              scale = 2
              newImageData = PxFilter.SNES9x(inputImageData, 2, 'C')
              //
            } else if (type === 'Epx3') {
              scale = 3
              newImageData = PxFilter.SNES9x(inputImageData, 3, '3')
              //
            } else if (type === 'Eagle') {
              scale = 2
              newImageData = PxFilter.Eagle(inputImageData, 2)
              //
            } else if (type === 'Eagle3x') {
              scale = 3
              newImageData = PxFilter.Eagle(inputImageData, 3)
              //
            } else if (type === 'Eagle3xB') {
              scale = 3
              newImageData = PxFilter.Eagle(inputImageData, 3, 'B')
              //
            } else if (type === '2xSaI') {
              scale = 2
              newImageData = PxFilter._2xSaI(inputImageData, 2)
              //
            } else if (type === 'Super2xSaI') {
              scale = 2
              newImageData = PxFilter.Super2xSaI(inputImageData, 2)
              //
            } else if (type === 'SuperEagle') {
              scale = 2
              newImageData = PxFilter.SuperEagle(inputImageData, 2)
              //
            } else if (type === 'HQ2x') {
              scale = 2
              newImageData = PxFilter.HQx(inputImageData, 2)
              //
            } else if (type === 'HQ3x') {
              scale = 3
              newImageData = PxFilter.HQx(inputImageData, 3)
              //
            } else if (type === 'HQ4x') {
              scale = 4
              newImageData = PxFilter.HQx(inputImageData, 4)
              //
            } else if (type === 'XBR2x') {
              scale = 2
              newImageData = PxFilter.XBR(inputImageData, 2)
              //
            } else if (type === 'XBR3x') {
              scale = 3
              newImageData = PxFilter.XBR(inputImageData, 3)
              //
            } else if (type === 'XBR4x') {
              scale = 4
              newImageData = PxFilter.XBR(inputImageData, 4)
              //
            } else if (type === 'XBRz2x') {
              scale = 2
              newImageData = PxFilter.XBRz(inputImageData, 2)
              //
            } else if (type === 'XBRz3x') {
              scale = 3
              newImageData = PxFilter.XBRz(inputImageData, 3)
              //
            } else if (type === 'XBRz4x') {
              scale = 4
              newImageData = PxFilter.XBRz(inputImageData, 4)
              //
            } else if (type === 'XBRz5x') {
              scale = 5
              newImageData = PxFilter.XBRz(inputImageData, 5)
              //
            } else if (type === 'XBRz6x') {
              scale = 6
              newImageData = PxFilter.XBRz(inputImageData, 6)
              //
            } else if (type === '0') {
            }

            ctx.canvas.width = inputImageData.width * scale
            ctx.canvas.height = inputImageData.height * scale
            ctx.putImageData(newImageData, 0, 0)
            this.converting = false

            // const b = performance.now()
            // console.log('displayTime: ', b - a)
          }
        }
      }, 0)
    },
    changeCanvasExpand() {
      this.canvasExpanded = !this.canvasExpanded
    },
    clickSave() {
      if (this.currentFilter !== 'NoScale') {
        const c = this.$refs.outputCanvas as HTMLCanvasElement
        const a = document.createElement('a')
        a.href = c.toDataURL()
        a.download = this.inputName + '_' + this.currentFilter
        a.click()
      }
    }
  }
})
</script>

<style lang="scss">
.pixel-scaler-inside {
  padding-bottom: 10px;
  width: 100%;
  height: 100%;
  // display: flex;
  // flex-direction: column;
  // align-content: space-between;
}
.pixel-scaler-inside-below {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  // flex-wrap: wrap;
  width: 100%;
  height: 100%;
  transition: all 1s ease;

  @media (orientation: portrait) {
    flex-direction: column;
    align-items: center;
  }
}
.output-image {
  height: 640px;
  width: 640px;
  // background: #666;
  border: solid 1px $color-bluegray;
  box-sizing: content-box;
  @include flex-centering(row);
  cursor: pointer;

  canvas {
    width: 100%;
    height: 100%;
    // max-height: 640px;
    // max-width: 640px;
    object-fit: contain;
    image-rendering: pixelated;
    transition: all ease 1s;
  }

  .image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    image-rendering: pixelated;
    transition: all ease 1s;
  }

  &[expand] {
    display: block;
    overflow: scroll;

    canvas {
      width: initial;
      height: initial;
      max-height: none;
      max-width: none;
    }

    .image {
      width: initial;
      height: initial;
      max-height: none;
      max-width: none;
    }
  }

  @media (orientation: portrait) {
    height: 40vh;
    width: calc(100% - 17px);
  }
}
.converting-status {
  @include flex-centering(row);
  height: 50px;
  width: 50px;
  margin: 0;
  // background: #222;

  &-arrow {
    animation: rot 0.7s ease;
  }
}
@keyframes rot {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(360deg);
  }
}
</style>
