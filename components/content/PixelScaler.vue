<template>
  <div class="pixel-scaler">
    <PixelScalerTop />
    <div class="pixel-scaler-bottom">
      <div class="scale-style">
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
  }
})
</script>

<style lang="scss">
.pixel-scaler-bottom {
  height: 100px;
  background: #3333dd;
  color: white;
}
</style>
