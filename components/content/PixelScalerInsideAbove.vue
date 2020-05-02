<template>
  <div class="pixel-scaler-inside-above">
    <v-btn color="success" small depressed @click="$emit('click-save')">
      <v-icon left small>{{ 'mdi-content-save' }}</v-icon>
      {{ 'Save' }}
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
      {{ 'Tweet' }}
    </a>
    <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  //
})
</script>

<style lang="scss">
.pixel-scaler-inside-above {
  height: 72px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  @media (max-width: 450px) {
    justify-content: space-between;
  }

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
