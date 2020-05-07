<template>
  <div class="description">
    <h2>{{ description.title }}</h2>
    <div class="description-note">
      <ul v-for="note in description.notes" :key="note">
        <li>{{ note }}</li>
      </ul>
    </div>
    <a
      href="https://twitter.com/share?ref_src=twsrc%5Etfw"
      class="twitter-share-button"
      data-size="large"
      data-text="「ドット絵スケーラー」"
      data-url="https://pixelart-scaler.web.app/"
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
  data() {
    return {
      description: {
        title: 'ドット絵のスケーリングを試してみよう！',
        notes: ['入力最大解像度は 512x512 まで', 'png形式のみ対応しています']
      }
    }
  }
})
</script>

<style lang="scss">
.description {
  width: 100%;
  height: 550px;
  @include flex-centering(column);
  justify-content: space-around;
  // background: #f2ffe7;
  border: {
    color: $color-bluegray;
    size: 1px;
    style: solid;
    radius: 10px;
  }
  overflow: hidden;

  > h2 {
    @include flex-centering(row);
    margin: 15px 0;
    font-size: 1.6em;
    font-weight: 600;
    color: $color-black6;

    @media (max-width: 525px) {
      font-size: 1.3em;
    }
    @media (max-width: 425px) {
      font-size: 1.15em;
    }
    @media (max-width: 375px) {
      font-size: 1.1em;
    }
    @media (max-width: 350px) {
      font-size: 1em;
    }
  }

  &-note {
    margin: 15px 0;
    // transition: all 1s ease;

    > ul {
      margin: 0;
      // margin-left: -20px;
      > li {
        margin: 5px 10px;
        font-size: 0.9em;
      }
    }
  }

  .twitter-share-button {
    position: absolute !important;
    bottom: 30px;
  }
}
</style>
