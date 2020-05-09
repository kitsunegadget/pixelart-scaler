<template>
  <div class="description">
    <div class="description-title">
      <img src="@/assets/titlelogo.png" height="64" alt="ドット絵スケーラー" />
      <h2>{{ description.title }}</h2>
    </div>
    <div class="description-note">
      <ul v-for="note in description.notes" :key="note">
        <li>{{ note }}</li>
      </ul>
    </div>
    <TwitterButton class="twitter-share-absolute" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TwitterButton from './TwitterButton.vue'

export default Vue.extend({
  components: {
    TwitterButton,
  },
  data() {
    return {
      description: {
        title: 'ドット絵のスケーリングを試してみよう！',
        notes: ['入力最大解像度は 512x512 まで', 'png形式のみ対応しています'],
      },
    }
  },
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

  .description-title {
    margin-top: -40px;
    @include flex-centering(column);
    flex-wrap: nowrap;

    img {
      font-size: 3rem;
      font-weight: 500;
      image-rendering: pixelated;
    }

    h2 {
      @include flex-centering(row);
      margin: 15px 0;
      font-size: 2.4rem;
      font-weight: 500;
      color: $color-black5;

      @media (max-width: 525px) {
        font-size: 2rem;
      }
      @media (max-width: 425px) {
        font-size: 1.7rem;
      }
      @media (max-width: 375px) {
        font-size: 1.6rem;
      }
      @media (max-width: 350px) {
        font-size: 1.5rem;
      }
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
        font-size: 1.4rem;
      }
    }
  }
}
</style>
