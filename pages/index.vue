<template>
  <div class="main-container">
    <Header @show-about="showAbout" />
    <About v-show="isShowAbout" @show-about="showAbout" />
    <Content />
    <Footer />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Header from '@/components/Header.vue'
import About from '@/components/About.vue'
import Content from '@/components/Content.vue'
import Footer from '@/components/Footer.vue'

export default Vue.extend({
  components: {
    Header,
    About,
    Content,
    Footer
  },
  data() {
    return {
      isShowAbout: false
    }
  },
  methods: {
    showAbout(e: Event) {
      e.stopPropagation()
      this.isShowAbout = !this.isShowAbout
    }
  }
})
</script>

<style lang="scss">
.main-container {
  width: 100%;
  height: 100%;
  @include flex-centering(column);
  justify-content: flex-start;
  background: $color-bluegray;
}

.container {
  padding: 0 10px;
  max-width: 1000px;
  height: 100%;
  margin: auto;

  @media (orientation: portrait) {
    padding: 0;
  }
}
</style>
