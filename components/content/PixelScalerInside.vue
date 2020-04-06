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
      <div class="transform-arrow"></div>
      <div class="output-image">
        <canvas id="output-canvas" ref="outputCanvas"></canvas>
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
      const invert = function(data: Uint8ClampedArray) {
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i] // R
          data[i + 1] = 255 - data[i + 1] // G
          data[i + 2] = 255 - data[i + 2] // B
        }
      }
      const grayscale = function(data: Uint8ClampedArray) {
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
          data[i] = avg
          data[i + 1] = avg
          data[i + 2] = avg
        }
      }

      const canvas = this.$refs.outputCanvas as HTMLCanvasElement
      let img = new Image()
      img.src = this.inputData
      img.onload = () => {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0)
          img.style.display = 'none'
          const imageData = ctx.getImageData(0, 0, img.width, img.height)

          // スケール処理によって出力される大きさを予め与える
          canvas.width = imageData.width
          canvas.height = imageData.height
        }
      }
      // 動的なキャンバスの大きさが1回目で反映出来ないため
      // ダブルバッファリングのようにもう一度Imageをつくって処理する
      img = new Image()
      img.src = this.inputData
      img.onload = () => {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0)
          img.style.display = 'none'
          const imageData = ctx.getImageData(0, 0, img.width, img.height)
          const data = imageData.data

          if (type === 1) {
            invert(data)
          } else if (type === 2) {
            grayscale(data)
          }
          canvas.width = imageData.width
          canvas.height = imageData.height
          ctx.putImageData(imageData, 0, 0)
        }
      }

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
  background: #222;
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
