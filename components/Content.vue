<template>
  <div class="content">
    <div class="container">
      <div class="content-inside">
        <PixelScaler />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PixelScaler from './content/PixelScaler.vue'

export default Vue.extend({
  components: {
    PixelScaler
  }
})
</script>
<style lang="scss">
.content {
  width: 100%;
  // min-height: 500px;
  background-color: $color-white;
}
</style>
