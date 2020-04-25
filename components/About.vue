<template>
  <div class="about">
    <div class="about-outside" @click="$emit('show-about', $event)"></div>
    <div class="about-select">
      <v-btn-toggle mandatory>
        <v-btn @click="changeCurrent('content')">このサイトについて</v-btn>
        <v-btn @click="changeCurrent('privacy')">プライバシーポリシー</v-btn>
      </v-btn-toggle>
      <v-icon color="white" large @click="$emit('show-about', $event)"
        >mdi-close-circle-outline</v-icon
      >
    </div>
    <div class="about-inside">
      <AboutContent v-if="currentContent === 'content'" />
      <AboutPrivacy v-else />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import AboutContent from './AboutContent.vue'
import AboutPrivacy from './AboutPrivacy.vue'

export default Vue.extend({
  components: {
    AboutContent,
    AboutPrivacy
  },
  data() {
    return {
      currentContent: 'content'
    }
  },
  methods: {
    changeCurrent(content: string) {
      this.currentContent = content
    }
  }
})
</script>

<style lang="scss">
.about {
  position: absolute;
  z-index: 2;
  height: 100%;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 60px;
  // width: 100%;
  // width: 90vw;
  // height: 90vh;
  background: #0006;

  @media (orientation: portrait) {
    padding: 60px 5px;
  }

  &-outside {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  &-select {
    display: flex;
    justify-content: space-between;
  }

  &-inside {
    padding: 30px;
    color: $color-black6;
    background: #fff;
  }
}
</style>
