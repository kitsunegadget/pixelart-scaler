<template>
  <div class="pixel-scaler-inside-above">
    <v-btn color="success" small depressed style="font-size: 1.3rem;" @click="$emit('click-save')">
      <v-icon left small>{{ 'mdi-content-save' }}</v-icon>
      {{ 'Save' }}
    </v-btn>
    <div class="dunmmy" />
    <TwitterButton />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TwitterButton from './TwitterButton.vue'

export default Vue.extend({
  components: {
    TwitterButton,
  },
})
</script>

<style lang="scss">
.pixel-scaler-inside-above {
  height: 72px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  @media (max-width: 450px) {
    justify-content: space-between;
  }

  > button {
    text-transform: none;
    margin: 0 5px;
    width: 75px;

    // i {
    //   margin-right: 2px;
    // }
  }

  .twitter-share-button {
    margin: 0 5px;
  }
}
</style>
