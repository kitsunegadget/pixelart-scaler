<template>
  <div class="about-content">
    <h3>{{ aboutTitle }}</h3>
    <article>
      <p>
        ドット画像の拡大に使われる基本的なフィルターを手元にある画像で簡単に触れることができます。
      </p>
    </article>
    <h5>使い方</h5>
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
      <!-- <ul>
          <li v-for="item in filterName" :key="item">
            {{ item }}
          </li>
        </ul> -->
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
.about-content {
  > h3 {
    margin-bottom: 10px;
  }

  > h5 {
    margin-top: 30px;
  }

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

.about-end {
  font-size: 0.9em;
}
</style>
