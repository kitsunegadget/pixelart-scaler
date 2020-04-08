<template>
  <header class="header">
    <div class="container">
      <h1 class="title">
        {{ title }}
      </h1>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue'
import nuxtConfig from '../nuxt.config'
export default Vue.extend({
  data() {
    return {
      title: nuxtConfig.head.title
    }
  }
})
</script>

<style lang="scss">
.header {
  width: 100%;
  height: 56px;
  background: {
    color: $color-green;
  }
  color: $color-white;
  z-index: 1;
  box-shadow: 0 0 5px #666a;

  .title {
    font-size: 1.6em !important;
    margin: 12px 10px;
    //line-height: 1.3em;
    cursor: default;
  }
}
</style>
