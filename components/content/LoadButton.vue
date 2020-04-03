<template>
  <div class="load-button" v-bind="{ loaded: imageLoaded }">
    <input
      id="fileElem"
      ref="fileInput"
      type="file"
      :accept="inputAccept"
      style="display: none;"
      @change="$emit('input-changed', $event)"
    />
    <Button id="fileSelect" class="btn btn-outline-info" @click="fileSelect">
      画像を選択
    </Button>
    <p></p>
    <p v-bind="{ loaded: imageLoaded }">もしくは、ドラッグ＆ドロップ</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    imageLoaded: {
      type: Boolean,
      required: true
    },
    inputAccept: {
      type: String,
      required: true
    }
  },
  methods: {
    fileSelect() {
      const elem = this.$refs.fileInput as HTMLElement
      elem.click()
    }
  }
})
</script>

<style lang="scss">
.load-button {
  position: absolute;
  @include flex-centering(column);
  transition: all 1s ease;
  overflow: hidden;
  height: 100px;

  &[loaded] {
    transform: translateY(-200px);
  }

  > p {
    margin: 0;
    padding: 5px 0;
    transition: all 0.5s ease;

    &[loaded] {
      opacity: 0;
    }
  }
}
</style>
