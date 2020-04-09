<template>
  <div class="main-container">
    <Header />
    <Content />
    <Footer />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Header from '@/components/Header.vue'
import Content from '@/components/Content.vue'
import Footer from '@/components/Footer.vue'

export default Vue.extend({
  components: {
    Header,
    Content,
    Footer
  }
})
</script>

<style lang="scss">
.main-container {
  width: 100%;
  height: 100%;
  @include flex-centering(column);
  justify-content: flex-start;
}
</style>
