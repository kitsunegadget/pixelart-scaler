<template>
  <div class="pixel-scaler-inside">
    <div class="pixel-scaler-top dragArea" draggable="false">
      <div class="input-image">
        <span v-show="!imageLoaded">
          <p>ドラッグ＆ドロップ</p>
          <p>もしくは</p>
          <p>画像を選択から読み込む</p>
        </span>
        <img
          v-show="imageLoaded"
          class="image"
          :src="inputData"
          draggable="false"
        />
      </div>
      <div class="converting-status">
        <v-progress-circular
          v-if="converting"
          indeterminate
          color="blue"
          :size="50"
        >
          <!-- <span class="sr-only">Loading...</span> -->
        </v-progress-circular>
        <div v-else class="converting-status-arrow">
          <v-icon x-large color="orange">mdi-arrow-right-thick</v-icon>
        </div>
      </div>
      <div class="output-image">
        <canvas ref="outputCanvas"></canvas>
        <!-- <img
          v-show="!converting"
          class="image"
          :src="outputData"
          draggable="false"
        /> -->
      </div>
    </div>

    <PixelScalerType @convert-start="convertClick" />
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
      converting: false
    }
  },
  watch: {
    inputData() {
      const canvas = this.$refs.outputCanvas as HTMLCanvasElement
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
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
      setTimeout(() => {
        // 仮想DOMのレンダーから逃れるためのタイムアウト
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
            } else if (type === 'epx2') {
              ctx.canvas.width *= 2
              ctx.canvas.height *= 2
              const newImageData = PxFilter.EPX(imageData, 2)
              ctx.putImageData(newImageData, 0, 0)
            } else if (type === 'epx3') {
              ctx.canvas.width *= 3
              ctx.canvas.height *= 3
              const newImageData = PxFilter.EPX(imageData, 3)
              ctx.putImageData(newImageData, 0, 0)
            } else if (type === 'epx4') {
              ctx.canvas.width *= 4
              ctx.canvas.height *= 4
              const x2ImageData = PxFilter.EPX(imageData, 2)
              const newImageData = PxFilter.EPX(x2ImageData, 2)
              ctx.putImageData(newImageData, 0, 0)
            } else if (type === 'eagle2') {
              ctx.canvas.width *= 2
              ctx.canvas.height *= 2
              const newImageData = PxFilter.Eagle(imageData, 2)
              ctx.putImageData(newImageData, 0, 0)
            } else if (type === 'eagle3') {
              ctx.canvas.width *= 3
              ctx.canvas.height *= 3
              const newImageData = PxFilter.Eagle(imageData, 3)
              ctx.putImageData(newImageData, 0, 0)
            } else if (type === 'eagle3xB') {
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
            } else if (type === 'xBR2') {
              ctx.canvas.width *= 2
              ctx.canvas.height *= 2
              const newImageData = PxFilter.XBR(imageData, 2)
              ctx.putImageData(newImageData, 0, 0)
            } else if (type === 'xBR3') {
              ctx.canvas.width *= 3
              ctx.canvas.height *= 3
              const newImageData = PxFilter.XBR(imageData, 3)
              ctx.putImageData(newImageData, 0, 0)
            } else if (type === 'xBR4') {
              ctx.canvas.width *= 4
              ctx.canvas.height *= 4
              const newImageData = PxFilter.XBR(imageData, 4)
              ctx.putImageData(newImageData, 0, 0)
            } else if (type === 'xBRz2') {
              ctx.canvas.width *= 2
              ctx.canvas.height *= 2
              const newImageData = PxFilter.XBRz(imageData, 2)
              ctx.putImageData(newImageData, 0, 0)
            } else if (type === '0') {
            }
            this.converting = false
          }
          const b = performance.now()
          console.log('displayTime: ', b - a)
        }
      }, 20)
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
    }
  }
})
</script>

<style lang="scss">
.pixel-scaler-inside {
  padding-top: 25px;
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  height: 100%;
}
.pixel-scaler-top {
  flex: 2;
  margin: 50px 0;
  @include flex-centering(row);
  flex-wrap: wrap;
  // background: #ddd;
  transition: all 1s ease;
}
.input-image {
  height: 400px;
  width: 400px;
  // background: #666;
  border: solid 1px $color-green;

  canvas {
    width: 100%;
    height: 100%;
    object-fit: contain;
    image-rendering: pixelated;
  }
  .image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    image-rendering: pixelated;
  }

  > span {
    @include flex-centering(column);
    height: 100%;
    color: $color-black6;
  }
}
.converting-status {
  @include flex-centering(row);
  height: 50px;
  width: 50px;
  margin: 0 40px;
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
.output-image {
  @extend .input-image;
}
</style>
