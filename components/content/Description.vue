<template>
  <div class="description">
    <h2>{{ description.title }}</h2>
    <div class="description-note">
      <ul v-for="note in description.notes" :key="note">
        <li>{{ note }}</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      description: {
        title: 'ドット絵の色々なスケーリングを試してみよう！',
        notes: [
          '入力最大解像度は 512x512 まで',
          '現在png形式のみ対応しています'
        ]
      },
      loaded: 'loaded'
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
    color: $color-green;
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
}
</style>
