<template>
  <div class="pixel-scaler dragArea">
    <div v-show="isShowOverlay" class="drag-overlay dragArea">
      <div class="drag-overlay-cover dragArea" />
      <div class="drag-overlay-inside dragArea">
        変換したいドット画像をドロップ
      </div>
    </div>

    <div class="load-button dragArea">
      <input
        id="fileElem"
        ref="fileInput"
        type="file"
        :accept="inputAccept"
        style="display: none;"
        @change="inputChanged($event)"
      />
      <Button
        id="fileSelect"
        class="btn btn-outline-info"
        @click="fileSelect()"
      >
        画像を選択
      </Button>
    </div>

    <PixelScalerTop class="dragArea" :input-data="inputData" />
    <PixelScalerBottom class="dragArea" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PixelScalerTop from './PixelScalerTop.vue'
import PixelScalerBottom from './PixelScalerBottom.vue'

export default Vue.extend({
  components: {
    PixelScalerTop,
    PixelScalerBottom
  },
  data() {
    return {
      isShowOverlay: false,
      inputAccept: 'image/png',
      inputData: ''
    }
  },
  mounted() {
    document.addEventListener(
      'dragover',
      (event: DragEvent) => {
        event.stopPropagation()
        event.preventDefault()
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
        event.stopPropagation()
        event.preventDefault()
        if (event !== null) {
          if (event.target !== null) {
            const elem = event.target as HTMLElement
            if (elem.className.includes('dragArea')) {
              this.isShowOverlay = false
            }
          }
          if (
            event.dataTransfer !== null &&
            event.dataTransfer.files[0] !== undefined
          ) {
            const data = event.dataTransfer.files[0]
            if (data.type === 'image/png') {
              // const blob = data.slice(0, data.size, data.type)
              this.inputData = URL.createObjectURL(data)
            }
          }
        }
      },
      false
    )
  },
  methods: {
    fileSelect() {
      const elem = this.$refs.fileInput as HTMLElement
      elem.click()
    },
    inputChanged(event: any) {
      if (event !== null && event.target.files[0] !== undefined) {
        const data = event.target.files[0]
        if (data.type === 'image/png') {
          // const blob = data.slice(0, data.size, data.type)
          this.inputData = URL.createObjectURL(data)
        }
      }
    }
  }
})
</script>

<style lang="scss">
.pixel-scaler {
  position: relative;
  @include flex-centering(column);
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
.load-button {
  margin-top: 30px;
  margin-bottom: 10px;
}
</style>
