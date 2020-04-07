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
      <div class="transform-arrow">
        <div
          v-show="converting"
          ref="converting"
          class="spinner-border text-success"
          role="status"
        >
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div class="output-image">
        <canvas id="output-canvas" ref="outputCanvas"></canvas>
        <canvas id="output-canvas" ref="outputCanvas2"></canvas>
        <img
          v-show="imageTransformed"
          class="image"
          :src="outputData"
          draggable="false"
        />
      </div>
    </div>

    <div class="pixel-scaler-bottom dragArea" draggable="false">
      <div class="scale-style">
        <!-- スケーリング形式 -->
        <Button class="btn btn-secondary" @click="convertClick(1)">
          Invert
        </Button>
        <Button class="btn btn-secondary" @click="convertClick(2)">
          Grayscale
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// import axios from 'axios'
import Imagenize from '@/plugins/imagenize'

export default Vue.extend({
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
    },
    imageTransformed: {
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
    }
  },
  methods: {
    convertClick(type: Number) {
      this.converting = true
      setTimeout(() => {
        // 仮想DOMのレンダーから逃れるためのタイムアウト
        const canvas = this.$refs.outputCanvas as HTMLCanvasElement
        const img = new Image()
        img.src = this.inputData
        img.onload = async () => {
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.imageSmoothingEnabled = false
            // 入力画像とキャンバスサイズを合わせないと
            // ImageDataでcanvasをオーバーした画素が取得出来ない
            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0)
            img.style.display = 'none'
            const imageData = ctx.getImageData(0, 0, img.width, img.height)
            const data = imageData.data

            const n = new Imagenize(data, img.width)
            if (type === 1) {
              const newData = await n.invert()
              const newImageData = new ImageData(newData[0], newData[1])
              ctx.putImageData(newImageData, 0, 0)
              this.converting = false
            } else if (type === 2) {
              const newData = await n.grayScale()
              const newImageData = new ImageData(newData[0], newData[1])
              ctx.putImageData(newImageData, 0, 0)
              this.converting = false
            }
          }
        }
      }, 100)
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
  height: 256px;
  width: 256px;
  // background: #666;
  border: solid 1px $color-green;

  canvas {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  > span {
    @include flex-centering(column);
    height: 100%;
    color: $color-black6;
  }
}
.transform-arrow {
  height: 50px;
  width: 50px;
  margin: 0 40px;
  // background: #222;
}
.output-image {
  @extend .input-image;
}

.pixel-scaler-bottom {
  flex: 1;
  display: flex;
  flex-direction: row;
  background: #3333dd;
  color: white;
}
.scale-style {
  margin: 10px;
}
</style>
