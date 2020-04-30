<template>
  <div class="pixel-scaler-inside-above">
    <v-btn color="success" small @click="saveClick">
      <v-icon left small>mdi-content-save</v-icon>
      Save
    </v-btn>
    <div class="dunmmy" />
    <a
      href="https://twitter.com/share?ref_src=twsrc%5Etfw"
      class="twitter-share-button"
      data-size="large"
      data-text="「ドット絵スケーラー」で画像を拡大してみよう！"
      data-url="https://pixelart-scaler.kitsunegadget.xyz/"
      data-show-count="false"
    >
      Tweet
    </a>
    <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    outputData: {
      type: String,
      default: ''
    },
    currentFilter: {
      type: String,
      default: 'NoScale'
    }
  },
  methods: {
    saveClick() {
      //
    }
  }
})
</script>

<style lang="scss">
.pixel-scaler-inside-above {
  width: 100%;
  height: 72px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  > button {
    text-transform: none;
    margin: 0 5px;
    width: 75px;

    // i {
    //   margin-right: 2px;
    // }
  }

  .twitter-share-button {
    margin: 0 5px;
  }
}
</style>
