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
    <v-btn
      id="fileSelect"
      :ripple="{ center: true }"
      large
      tile
      outlined
      color="teal"
      class="ma-2"
      v-bind="{ disabled: imageConverting }"
      style="font-size: 1.4rem;"
      @click="fileSelect"
    >
      <v-icon left>{{ 'mdi-image' }}</v-icon>
      {{ '画像を選択' }}
    </v-btn>
    <p></p>
    <p v-bind="{ loaded: imageLoaded }">
      {{ 'もしくは、ドラッグ＆ドロップ' }}
    </p>
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
    },
    imageConverting: {
      type: Boolean,
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
  margin-left: 1px;
  top: 2.5px;
  transform: translateY(200px);

  &[loaded] {
    transform: translateY(0);
  }

  > p {
    font-size: 1.4rem;
    margin: 0;
    padding: 5px 0;
    transition: all 0.5s ease;

    &[loaded] {
      opacity: 0;
      visibility: hidden;
    }
  }
}
</style>
