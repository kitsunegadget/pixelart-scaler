<template>
  <div class="pixel-scaler-inside dragArea">
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
      <!-- <img
          v-show="!converting"
          class="image"
          :src="outputData"
          draggable="false"
        /> -->
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// import axios from 'axios'
import PixelScalerType from './PixelScalerType.vue'
import PxFilter, { StandardFilter } from '@/plugins/PixelFilter'

export default Vue.extend({
  components: {
    PixelScalerType
  },
  props: {
    inputData: {
      type: String,
      default: '',
      required: true
    },
    outputData: {
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
      converting: false,
      currentFilter: 'NoScale',
      canvasExpanded: false
    }
  },
  watch: {
    inputData() {
      const canvas = this.$refs.outputCanvas as HTMLCanvasElement
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // ctx.clearRect(0, 0, canvas.width, canvas.height)
        this.convertClick(this.currentFilter)
      }
    },
    converting() {
      this.$emit('converting-state', this.converting)
    }
  },
  methods: {
    convertClick(type: string) {
      if (this.converting) {
        // 変換中に再度押せないように
        return
      }
      this.converting = true
      this.currentFilter = type
      // setTimeout(() => {
      // 仮想DOMのレンダーから逃れるためのタイムアウト
      // だったが、利用しなくなった
      const a = performance.now()
      const canvas = this.$refs.outputCanvas as HTMLCanvasElement
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

          if (type === 'invert') {
            const newImageData = StandardFilter.invert(imageData)
            ctx.putImageData(newImageData, 0, 0)
          } else if (type === 'grayscale') {
            const newImageData = StandardFilter.grayScale(imageData)
            ctx.putImageData(newImageData, 0, 0)
          } else if (type === 'binarization') {
            const newImageData = StandardFilter.binarization(imageData, 127)
            ctx.putImageData(newImageData, 0, 0)
          } else if (type === 'Epx2') {
            ctx.canvas.width *= 2
            ctx.canvas.height *= 2
            const newImageData = PxFilter.EPX(imageData, 2)
            ctx.putImageData(newImageData, 0, 0)
          } else if (type === 'Epx3') {
            ctx.canvas.width *= 3
            ctx.canvas.height *= 3
            const newImageData = PxFilter.EPX(imageData, 3)
            ctx.putImageData(newImageData, 0, 0)
          } else if (type === 'Epx4') {
            ctx.canvas.width *= 4
            ctx.canvas.height *= 4
            const x2ImageData = PxFilter.EPX(imageData, 2)
            const newImageData = PxFilter.EPX(x2ImageData, 2)
            ctx.putImageData(newImageData, 0, 0)
          } else if (type === 'EpxB') {
            ctx.canvas.width *= 2
            ctx.canvas.height *= 2
            const newImageData = PxFilter.SNES9x(imageData, 2, 'B')
            ctx.putImageData(newImageData, 0, 0)
          } else if (type === 'EpxC') {
            ctx.canvas.width *= 2
            ctx.canvas.height *= 2
            const newImageData = PxFilter.SNES9x(imageData, 2, 'C')
            ctx.putImageData(newImageData, 0, 0)
          } else if (type === 'Epx33') {
            ctx.canvas.width *= 3
            ctx.canvas.height *= 3
            const newImageData = PxFilter.SNES9x(imageData, 3, '3')
            ctx.putImageData(newImageData, 0, 0)
          } else if (type === 'Eagle2') {
            ctx.canvas.width *= 2
            ctx.canvas.height *= 2
            const newImageData = PxFilter.Eagle(imageData, 2)
            ctx.putImageData(newImageData, 0, 0)
          } else if (type === 'Eagle3') {
            ctx.canvas.width *= 3
            ctx.canvas.height *= 3
            const newImageData = PxFilter.Eagle(imageData, 3)
            ctx.putImageData(newImageData, 0, 0)
          } else if (type === 'Eagle3xB') {
            ctx.canvas.width *= 3
            ctx.canvas.height *= 3
            const newImageData = PxFilter.Eagle(imageData, 3, 'B')
            ctx.putImageData(newImageData, 0, 0)
          } else if (type === '2xSaI') {
            ctx.canvas.width *= 2
            ctx.canvas.height *= 2
            const newImageData = PxFilter._2xSaI(imageData, 2)
            ctx.putImageData(newImageData, 0, 0)
          } else if (type === 'Super2xSaI') {
            ctx.canvas.width *= 2
            ctx.canvas.height *= 2
            const newImageData = PxFilter.Super2xSaI(imageData, 2)
            ctx.putImageData(newImageData, 0, 0)
          } else if (type === 'SuperEagle') {
            ctx.canvas.width *= 2
            ctx.canvas.height *= 2
            const newImageData = PxFilter.SuperEagle(imageData, 2)
            ctx.putImageData(newImageData, 0, 0)
          } else if (type === 'HQx2') {
            ctx.canvas.width *= 2
            ctx.canvas.height *= 2
            const newImageData = PxFilter.HQx(img, 2)
            ctx.putImageData(newImageData, 0, 0)
          } else if (type === 'HQx3') {
            ctx.canvas.width *= 3
            ctx.canvas.height *= 3
            const newImageData = PxFilter.HQx(img, 3)
            ctx.putImageData(newImageData, 0, 0)
          } else if (type === 'HQx4') {
            ctx.canvas.width *= 4
            ctx.canvas.height *= 4
            const newImageData = PxFilter.HQx(img, 4)
            ctx.putImageData(newImageData, 0, 0)
          } else if (type === 'XBR2') {
            ctx.canvas.width *= 2
            ctx.canvas.height *= 2
            const newImageData = PxFilter.XBR(imageData, 2)
            ctx.putImageData(newImageData, 0, 0)
          } else if (type === 'XBR3') {
            ctx.canvas.width *= 3
            ctx.canvas.height *= 3
            const newImageData = PxFilter.XBR(imageData, 3)
            ctx.putImageData(newImageData, 0, 0)
          } else if (type === 'XBR4') {
            ctx.canvas.width *= 4
            ctx.canvas.height *= 4
            const newImageData = PxFilter.XBR(imageData, 4)
            ctx.putImageData(newImageData, 0, 0)
          } else if (type === 'XBRz2') {
            ctx.canvas.width *= 2
            ctx.canvas.height *= 2
            const newImageData = PxFilter.XBRz(imageData, 2)
            ctx.putImageData(newImageData, 0, 0)
          } else if (type === 'XBRz3') {
            ctx.canvas.width *= 3
            ctx.canvas.height *= 3
            const newImageData = PxFilter.XBRz(imageData, 3)
            ctx.putImageData(newImageData, 0, 0)
          } else if (type === 'XBRz4') {
            ctx.canvas.width *= 4
            ctx.canvas.height *= 4
            const newImageData = PxFilter.XBRz(imageData, 4)
            ctx.putImageData(newImageData, 0, 0)
          } else if (type === 'XBRz5') {
            ctx.canvas.width *= 5
            ctx.canvas.height *= 5
            const newImageData = PxFilter.XBRz(imageData, 5)
            ctx.putImageData(newImageData, 0, 0)
          } else if (type === 'XBRz6') {
            ctx.canvas.width *= 6
            ctx.canvas.height *= 6
            const newImageData = PxFilter.XBRz(imageData, 6)
            ctx.putImageData(newImageData, 0, 0)
          } else if (type === '0') {
          }
          this.converting = false
        }
        const b = performance.now()
        console.log('displayTime: ', b - a)
      }
      // }, 200)
      // const dataURI = this.inputData.split(',')
      // const dataType = dataURI[0].split(';')[0].slice(5)
      // const baseData = dataURI[1]
      // console.log(dataType)
      // const postURL =
      //   'http://localhost:5001/nuxt-pixel-scaler/asia-northeast1/transformTest'
      // // post data
      // axios
      //   .post(
      //     postURL,
      //     {
      //       scaleType: '',
      //       type: dataType,
      //       data: baseData
      //     },
      //     {
      //       headers: {
      //         'Content-Type': 'text/plain'
      //       }
      //     }
      //   )
      //   .then(res => {
      //     if (res.status === 200) {
      //       console.log(res.data)
      //     }
      //   })
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
  padding-top: 72px;
  padding-bottom: 10px;
  @include flex-centering(row);
  justify-content: space-around;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  transition: all 1s ease;
}
.output-image {
  height: 640px;
  width: 640px;
  // background: #666;
  border: solid 1px $color-green;
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
  }

  @media (orientation: portrait) {
    height: 45vh;
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
