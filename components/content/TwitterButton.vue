<template>
  <div class="twitter-share">
    <a
      href="https://twitter.com/share?ref_src=twsrc%5Etfw"
      class="twitter-share-button"
      data-size="large"
      data-text="「ドット絵スケーラー」"
      data-url="https://kitsunegadget.xyz/pixelart-scaler/"
      data-show-count="false"
    >
      {{ 'Tweet' }}
    </a>
    <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
  </div>
</template>

<style lang="scss">
.twitter-share {
  margin-top: 4px;
}
.twitter-share-absolute {
  position: absolute !important;
  bottom: 30px;
}
</style>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  //
})
</script>
