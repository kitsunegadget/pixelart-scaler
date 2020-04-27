<template>
  <div class="about-privacy">
    <h3>{{ aboutPrivacyTittle }}</h3>
    <h5>画像の取り扱い</h5>
    <article>
      <p>画像の変換はデバイス内で行われるため、外部に送信することはありません。</p>
    </article>
    <h5>Cookieの取り扱い</h5>
    <article>
      <p>
        このページでは、Cookieを利用してGoogle経由の広告を配信しています。
        サイトにアクセスした際のCookieからユーザーに合わせた広告を表示するためのものです。
        必要であれば、こちらの広告設定からパーソナライズ広告を無効にすることが出来ます。
      </p>
      <p>
        また、統計情報取得に Google Analytics を利用しています。
        アクセス情報は統計のみに利用され、プライバシーに関わるような情報の取得は行いません。
        必要であれば、ブラウザの設定からCookieをブロックすることが出来ます。
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
  > h3 {
    margin-bottom: 30px;
  }

  > article > p {
    margin-left: 10px;
  }
}
</style>
