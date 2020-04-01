<template>
  <div class="pixel-scaler dragArea">
    <div v-show="isShowOverlay" class="drag-overlay dragArea">
      <div class="drag-overlay-cover dragArea" />
      <div class="drag-overlay-inside dragArea">
        変換したいドット画像をドロップ
      </div>
    </div>
    <PixelScalerTop class="dragArea" />
    <div class="pixel-scaler-bottom dragArea">
      <div class="scale-style dragArea">
        スケーリング形式 { トグルメニュー } 変換ボタン
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PixelScalerTop from './PixelScalerTop.vue'

export default Vue.extend({
  components: {
    PixelScalerTop
  },
  data() {
    return {
      isShowOverlay: false
    }
  },
  mounted() {
    document.addEventListener(
      'dragenter',
      (event: DragEvent) => {
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
      'dragover',
      event => {
        event.preventDefault()
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
        event.preventDefault()
        if (event !== null && event.target !== null) {
          const elem = event.target as HTMLElement
          if (elem.className.includes('dragArea')) {
            this.isShowOverlay = false
          }
        }
      },
      false
    )
  }
})
</script>

<style lang="scss">
.pixel-scaler {
  position: relative;
}
.drag-overlay {
  @include absolute-centering;
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
.pixel-scaler-bottom {
  height: 100px;
  background: #3333dd;
  color: white;
}
</style>
