<template>
  <div class="content">
    <div class="container">
      <div class="content-inside">
        <PixelScaler />
        <div class="description">
          <span>{{ description.title }}</span>
          <ul
            v-for="note in description.notes"
            :key="note"
            class="description-note"
          >
            <li>{{ note }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PixelScaler from './content/PixelScaler.vue'

export default Vue.extend({
  components: {
    PixelScaler
  },
  data() {
    return {
      description: {
        title: 'ドット絵の色々なスケーリングを試してみよう！',
        notes: [
          '入力最大解像度は 512x512 まで。',
          '現在png形式のみ対応しています。'
        ]
      }
    }
  }
})
</script>
<style lang="scss">
.content {
  width: 100%;
  min-height: 500px;
  background-color: $color-white;
}
.description {
  margin: 10px 0;
  border: {
    color: $color-green;
    size: 1px;
    style: solid;
    radius: 10px;
  }

  > span {
    @include flex-centering(row);
    margin: 10px 0;
    font-size: 1.4em;
    color: $color-black6;
  }

  &-note {
    margin: 0;

    > li {
      margin: 5px 10px;
      font-size: 0.9em;
    }
  }
}
</style>
