<template>
  <div class="about">
    <div class="about-outside" @click="$emit('show-about', $event)"></div>
    <div class="about-content">
      <h3>{{ aboutTitle }}</h3>
      <article>
        <p>
          ドット画像の拡大に使われるフィルターを手元にある画像で簡単に触れることができます。
        </p>
        <p></p>
      </article>
      <h4>使い方</h4>
      <article>
        <p>
          画像を選択・もしくはドロップで読み込み、フィルタ一覧からクリックして適用されます。
        </p>
        <p>2x, 3x の表記は拡大スケールを表しています。</p>
        <p>表示された画像をクリックすると原寸表示と全体表示を切り替えることができます。</p>
      </article>
      <div class="about-content-productBy">
        <h6>作者</h6>
        <div class="about-content-author">
          <span>Kitsune Gadget</span>
          <a :href="twitterAuthorLink" target="_blank" no-looper>
            <v-icon left dense color="blue">mdi-twitter</v-icon>
          </a>
        </div>
      </div>
      <div class="about-end">
        Thanks All Open Source Pixel Filters.
        <ul>
          <li v-for="item in filterName" :key="item">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      aboutTitle: 'このサイトについて',
      twitterAuthorLink: 'https://twitter.com/kitsunegadget/',
      filterName: [
        '2xSaI, Super2xSaI, SuperEagle (https://vdnoort.home.xs4all.nl/emulation/2xsai/)',
        'HQx (http://en.wikipedia.org/wiki/Hqx)',
        'XBR (Hyllian)',
        'XBRz (https://sourceforge.net/projects/xbrz/)',
        '2dImageFilter (https://github.com/Hawkynt/2dimagefilter)',
        'js-hqx (https://github.com/phoboslab/js-hqx)'
      ]
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

  &-outside {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  &-content {
    padding: 30px;
    background: #fff;
    color: $color-black6;

    > article > p {
      margin-left: 10px;
    }

    &-productBy {
      margin: 30px 0;
    }

    &-author {
      font-weight: bold;
      margin: 0 10px;
      @include flex-centering(row);
      justify-content: flex-start;

      > span {
        margin-right: 10px;
      }
    }
  }

  &-end {
    font-size: 0.9em;
  }
}
</style>
