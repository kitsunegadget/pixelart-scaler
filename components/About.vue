<template>
  <div class="about">
    <div class="about-outside" @click="$emit('show-about', $event)"></div>
    <div class="about-select">
      <!-- <v-btn-toggle dark tile mandatory>
        <v-btn @click="changeCurrent('content')">このサイトについて</v-btn>
        <v-btn @click="changeCurrent('privacy')">プライバシーポリシー</v-btn>
      </v-btn-toggle> -->
      <v-icon color="white" large @click="$emit('show-about', $event)">
        {{ 'mdi-close-thick' }}
      </v-icon>
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
  width: 100%;
  height: 100%;
  @include flex-centering(column);
  justify-content: flex-start;
  padding: 60px;

  @media (orientation: portrait) {
    padding: 60px 5px;
  }

  &-outside {
    width: 100vw;
    position: fixed;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #0006;
  }

  &-select {
    width: 100%;
    max-width: 1000px;
    margin-top: -10px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;

    .v-icon {
      margin: 5px;

      &:hover {
        color: $color-whiteD !important;
      }
    }
  }

  &-inside {
    width: 100%;
    max-width: 1000px;
    padding: 30px;
    color: $color-black5;
    background: $color-white;
    max-height: 80vh;
    overflow-y: scroll;

    // for firefox
    scrollbar-width: thin;
    scrollbar-color: $color-black3 $color-white;

    // for webkit browser
    &::-webkit-scrollbar {
      display: block;
      overflow: hidden;
      width: 7px;

      &:hover {
        width: 10px;
      }
    }
    // &::-webkit-scrollbar-button {
    //   // background-color: $color-blue1;
    //   // // display: none;
    //   // height: 1px;
    // }
    // &::-webkit-scrollbar-corner {
    //   // background: #f00;
    // }
    &::-webkit-scrollbar-thumb {
      background: $color-black3;
    }
    // &::-webkit-scrollbar-track {
    //   // background: #000;
    // }
    // &::-webkit-scrollbar-track-piece {
    //   // background: #00f;
    // }
  }
}
</style>
