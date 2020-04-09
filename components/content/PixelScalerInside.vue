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
import Imagenize from '@/plugins/imagenize'

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
    convertClick(type: Number) {
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
            const n = new Imagenize(ctx, img)

            if (type === 1) {
              const newData = n.invert()
              const newImageData = new ImageData(newData, img.width)
              ctx.putImageData(newImageData, 0, 0)
            } else if (type === 2) {
              const newData = n.grayScale()
              const newImageData = new ImageData(newData, img.width)
              ctx.putImageData(newImageData, 0, 0)
            } else if (type === 3) {
              const newData = n.Binarization(127)
              const newImageData = new ImageData(newData, img.width)
              ctx.putImageData(newImageData, 0, 0)
            } else if (type === 4) {
              ctx.canvas.width *= 2
              ctx.canvas.height *= 2
              const newData = n.EPX()
              const newImageData = new ImageData(newData, ctx.canvas.width)
              ctx.putImageData(newImageData, 0, 0)
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
  height: 320px;
  width: 320px;
  // background: #666;
  border: solid 1px $color-green;

  canvas {
    width: 100%;
    height: 100%;
    object-fit: contain;
    image-rendering: crisp-edges;
  }
  .image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    image-rendering: crisp-edges;
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
