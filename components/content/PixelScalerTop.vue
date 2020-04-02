<template>
  <div class="pixel-scaler-top" draggable="false">
    <div class="input-image">
      <span v-show="!imageChanged">
        <p>ドラッグ＆ドロップ</p>
        <p>もしくは</p>
        <p>画像を選択から読み込む</p>
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
  min-height: 350px;
  margin: 0px 0;
  // background: #ddd;
}
.input-image {
  height: 256px;
  width: 256px;
  // background: #666;
  border: solid 1px $color-green;

  #image {
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
</style>
