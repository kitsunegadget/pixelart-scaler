<template>
  <div class="pixel-scaler-bottom">
    <div class="load-button">
      <input id="inputFile" type="file" />
    </div>
    <div class="scale-style dragArea">
      スケーリング形式 { トグルメニュー } 変換ボタン
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  
})
</script>

<style lang="scss">
.pixel-scaler-bottom {
  display: flex;
  flex-direction: row;
  height: 100px;
  background: #3333dd;
  color: white;
}
</style>
