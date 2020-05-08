<template>
  <footer class="footer">
    <div class="container">
      <span>
        {{ '&copy; 2020 Kitsune Gadget' }}
      </span>
    </div>
  </footer>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  //
})
</script>

<style lang="scss">
.footer {
  margin: 10px 0;
  color: $color-white;
  width: 100%;

  span {
    @include flex-centering(row);
    font-size: 1.2rem;
  }
}
</style>
