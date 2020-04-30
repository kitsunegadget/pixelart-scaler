<template>
  <div class="pixel-scaler-inside">
    <PixelScalerInsideAbove :output-data="outputData" :current-filter="currentFilter" />
    <div class="pixel-scaler-inside-below">
      <PixelScalerType :converting="converting" @convert-start="convertClick" />
      <!-- <div class="converting-status">
        <v-progress-circular v-if="converting" indeterminate color="blue" :size="50">
          <span class="sr-only">Loading...</span>
        </v-progress-circular>
        <div v-else class="converting-status-arrow">
          <v-icon x-large color="orange">mdi-arrow-right-thick</v-icon>
        </div>
      </div> -->
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

export default Vue.extend({
  components: {
    PixelScalerInsideAbove,
    PixelScalerType
  },
  props: {
    inputData: {
      type: String,
      default: '',
      required: true
    },
    imageLoaded: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      outputData: '',
      converting: false,
      currentFilter: 'NoScale',
      canvasExpanded: false
    }
  },
  watch: {
    inputData() {
      this.convertClick(this.currentFilter)
    },
    converting() {
      this.$emit('converting-state', this.converting)
    }
  },
  mounted() {
    this.convertClick(this.currentFilter)
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
        // 仮想DOMのレンダーから逃れるためのタイムアウト
        // const a = performance.now()
        const canvas = this.$refs.outputCanvas as HTMLCanvasElement
        // const canvas = document.createElement('canvas')
        const img = new Image()
        img.src = this.inputData
        img.onload = () => {
          const ctx = canvas.getContext('2d')
          if (ctx) {
            // 入力画像とキャンバスサイズを合わせないと
            // ImageDataでcanvasをオーバーした画素が取得出来ない
            ctx.canvas.width = img.width
            ctx.canvas.height = img.height
            ctx.drawImage(img, 0, 0)
            img.style.display = 'none'
            const imageData = ctx.getImageData(0, 0, img.width, img.height)
            let newImageData = imageData

            if (type === 'NoScale') {
              // this.outputData = this.inputData
              //
            } else if (type === 'invert') {
              newImageData = StandardFilter.invert(imageData)
              //
            } else if (type === 'grayscale') {
              newImageData = StandardFilter.grayScale(imageData)
              //
            } else if (type === 'binarization') {
              newImageData = StandardFilter.binarization(imageData, 127)
              //
            } else if (type === 'Epx2') {
              newImageData = PxFilter.EPX(ctx, imageData, 2)
              //
            } else if (type === 'Epx3') {
              newImageData = PxFilter.EPX(ctx, imageData, 3)
              //
            } else if (type === 'Epx4') {
              newImageData = PxFilter.EPX(ctx, imageData, 4)
              //
            } else if (type === 'EpxB') {
              newImageData = PxFilter.SNES9x(ctx, imageData, 2, 'B')
              //
            } else if (type === 'EpxC') {
              newImageData = PxFilter.SNES9x(ctx, imageData, 2, 'C')
              //
            } else if (type === 'Epx33') {
              newImageData = PxFilter.SNES9x(ctx, imageData, 3, '3')
              //
            } else if (type === 'Eagle2') {
              newImageData = PxFilter.Eagle(ctx, imageData, 2)
              //
            } else if (type === 'Eagle3') {
              newImageData = PxFilter.Eagle(ctx, imageData, 3)
              //
            } else if (type === 'Eagle3xB') {
              newImageData = PxFilter.Eagle(ctx, imageData, 3, 'B')
              //
            } else if (type === '2xSaI') {
              newImageData = PxFilter._2xSaI(ctx, imageData, 2)
              //
            } else if (type === 'Super2xSaI') {
              newImageData = PxFilter.Super2xSaI(ctx, imageData, 2)
              //
            } else if (type === 'SuperEagle') {
              newImageData = PxFilter.SuperEagle(ctx, imageData, 2)
              //
            } else if (type === 'HQx2') {
              newImageData = PxFilter.HQx(ctx, img, 2)
              //
            } else if (type === 'HQx3') {
              newImageData = PxFilter.HQx(ctx, img, 3)
              //
            } else if (type === 'HQx4') {
              newImageData = PxFilter.HQx(ctx, img, 4)
              //
            } else if (type === 'XBR2') {
              newImageData = PxFilter.XBR(ctx, imageData, 2)
              //
            } else if (type === 'XBR3') {
              newImageData = PxFilter.XBR(ctx, imageData, 3)
              //
            } else if (type === 'XBR4') {
              newImageData = PxFilter.XBR(ctx, imageData, 4)
              //
            } else if (type === 'XBRz2') {
              newImageData = PxFilter.XBRz(ctx, imageData, 2)
              //
            } else if (type === 'XBRz3') {
              newImageData = PxFilter.XBRz(ctx, imageData, 3)
              //
            } else if (type === 'XBRz4') {
              newImageData = PxFilter.XBRz(ctx, imageData, 4)
              //
            } else if (type === 'XBRz5') {
              newImageData = PxFilter.XBRz(ctx, imageData, 5)
              //
            } else if (type === 'XBRz6') {
              newImageData = PxFilter.XBRz(ctx, imageData, 6)
              //
            } else if (type === '0') {
            }
            ctx.putImageData(newImageData, 0, 0)
            this.converting = false
          }
          // const b = performance.now()
          // console.log('displayTime: ', b - a)
        }
      }, 20)
    },
    changeCanvasExpand() {
      this.canvasExpanded = !this.canvasExpanded
      // console.log(this.canvasExpanded)
    }
  }
})
</script>

<style lang="scss">
.pixel-scaler-inside {
  padding-bottom: 10px;
  width: 100%;
  height: 100%;
}
.pixel-scaler-inside-below {
  // padding-top: 72px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  transition: all 1s ease;

  @media (orientation: portrait) {
    flex-direction: column;
    width: 100vw;
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
    width: 99vw;
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
