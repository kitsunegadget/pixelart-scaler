<template>
  <div class="about-privacy">
    <h2>
      {{ aboutPrivacyTittle }}
    </h2>
    <h3>
      {{ '画像の取り扱い' }}
    </h3>
    <article>
      <p>
        {{ '画像の変換はデバイス内で行われるため、外部に送信することはありません。' }}
      </p>
    </article>
    <!-- <h3>
      {{ '広告の配信' }}
    </h3>
    <article>
      <p>
        {{ 'このページでは、Google経由の広告を配信しています。' }}
      </p>
      <p>
        {{ '他のサイトにアクセスした広告Cookieからユーザーに合わせた広告を表示します。' }}
      </p>
      <p>
        {{ '必要であれば、' }}
        <a href="https://adssettings.google.com/authenticated" target="_blank" rel="noopener">
          {{ 'こちら (https://adssettings.google.com/authenticated)' }}
        </a>
        {{ 'の広告設定からパーソナライズ広告を無効にすることが出来ます。' }}
      </p>
    </article> -->
    <h3>
      {{ 'Google Analytics' }}
    </h3>
    <article>
      <p>
        {{ 'このページでは "Google Analytics" を利用しています。' }}
      </p>
      <p>
        {{
          'トラフィックデータはCookieを利用し、匿名で収集されます。これは個人を特定するものではありません。'
        }}
      </p>
      <p>
        {{ '必要であれば、ブラウザの設定からCookieをブロックすることが出来ます。' }}
      </p>
    </article>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      aboutPrivacyTittle: 'プライバシーポリシー'
    }
  }
})
</script>

<style lang="scss">
.about-privacy {
  > h2 {
    margin-bottom: 30px;
  }

  > article > p {
    margin: 0;
    margin-left: 10px;
  }

  > h3 {
    margin-top: 30px;
    margin-bottom: 10px;
    padding-left: 10px;
    border-left: solid 5px $color-black3;
    border-bottom: solid 1px $color-black3;
  }

  a {
    text-decoration: none;
  }
}
</style>
