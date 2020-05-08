<template>
  <div class="about-content">
    <h2>
      {{ 'このサイトについて' }}
    </h2>
    <article>
      <p>
        {{
          'ドット画像の拡大に使われる基本的なスケールフィルターを手元にある画像で簡単に触れることができます。'
        }}
      </p>
    </article>
    <h3>
      {{ '使い方' }}
    </h3>
    <article>
      <ul>
        <li v-for="str in howToUse" :key="str">
          <p>{{ str }}</p>
        </li>
      </ul>
    </article>
    <h3>
      {{ '画像の取り扱い' }}
    </h3>
    <article>
      <p>
        {{ '画像の変換はデバイス内で行われるため、外部に送信することはありません。' }}
      </p>
    </article>
    <div class="about-content-productBy">
      <h3>
        {{ '作者' }}
      </h3>
      <div class="about-content-author">
        <span>
          {{ '@yuy_az_ : Kitsune Gadget' }}
        </span>
        <a href="https://twitter.com/kitsunegadget" target="_blank" rel="noopener noreferer">
          <v-icon left dense color="blue">{{ 'mdi-twitter' }}</v-icon>
        </a>
      </div>
    </div>
    <div class="about-end">
      <p>
        {{ 'Thanks all open source Scale Filters.' }}
      </p>
      <p>
        {{
          'Most original Scale Filters are under the GPL license, and so I publish source code of this application.'
        }}
        <a
          href="https://github.com/kitsunegadget/PixelArt-Scaler"
          target="_blank"
          rel="noopener noreferer"
        >
          <v-icon left dense color="black">{{ 'mdi-github' }}</v-icon>
        </a>
      </p>
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
      howToUse: [
        '画像を選択ボタン・もしくはドラッグ＆ドロップで読み込み、フィルタ一覧からクリックして適用されます。',
        '2x, 3x の表記は拡大スケールを表しています。',
        '表示された画像をクリックすると原寸表示と全体表示を切り替えることができます。',
        '読み込める最大サイズは、スケーリング倍率を考慮して 512x512 までとしています。',
        '左上の Save ボタンを押すと選択されたスケーリングでの拡大画像を保存することが出来ます。（「No Scaling」選択時は機能しません。）',
        '稀に処理が極端に遅くなることがあります。その場合はページを再読み込みしてみてください。'
      ],
      filterName: [
        '2xSaI, Super2xSaI, SuperEagle (https://vdnoort.home.xs4all.nl/emulation/2xsai/)',
        'HQx (Maxim Stepin)',
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
  > h2 {
    font-size: 2.4rem;
    margin-bottom: 10px;
  }

  h3 {
    font-size: 2rem;
    margin-top: 30px;
    margin-bottom: 10px;
    padding-left: 10px;
    border-left: solid 5px $color-black3;
    border-bottom: solid 1px $color-black3;
  }

  article {
    margin-left: 10px;
  }

  p {
    font-size: 1.5rem;
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
      font-size: 1.4rem;
      margin-right: 10px;
    }

    > a {
      text-decoration: none;

      i:hover {
        color: skyblue !important;
      }
    }
  }
}

.about-end {
  > p {
    font-size: 1.3rem;
    margin: 0;
  }

  a {
    text-decoration: none;

    i:hover {
      color: gray !important;
    }
  }
}
</style>
