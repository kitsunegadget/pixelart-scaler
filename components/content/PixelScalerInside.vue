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
          id="image"
          :src="inputData"
          draggable="false"
        />
      </div>
      <div class="transform-arrow"></div>
      <div class="output-image"></div>
    </div>

    <div class="pixel-scaler-bottom dragArea" draggable="false">
      <div class="scale-style">
        スケーリング形式
      </div>
    </div>
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
    },
    imageLoaded: {
      type: Boolean,
      required: true
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
