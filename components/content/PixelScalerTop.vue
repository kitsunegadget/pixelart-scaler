<template>
  <div class="pixel-scaler-top" draggable="false">
    <div class="input-image">
      <span v-show="!imageChanged">
        画像をドロップもしくは選択ボタンから読み込む。
      </span>
      <img
        v-show="imageChanged"
        id="image"
        :src="inputData"
        draggable="false"
      />
    </div>
    <div class="transform-arrow"></div>
    <div class="output-image"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    inputData: {
      type: String,
      default: '',
      required: true
    }
  },
  data() {
    return {
      imageChanged: false
    }
  },
  watch: {
    inputData() {
      this.imageChanged = true
    }
  }
})
</script>
<style lang="scss">
.pixel-scaler-top {
  @include flex-centering(row);
  height: 400px;
  // background: #ddd;
}
.input-image {
  margin: 40px 20px;
  height: 256px;
  width: 256px;
  background: #666;

  #image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
.transform-arrow {
  height: 50px;
  width: 50px;
  margin: 20px;
  background: #222;
}
.output-image {
  @extend .input-image;
}
</style>
