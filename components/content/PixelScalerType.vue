<template>
  <div class="pixel-scaler-bottom dragArea" draggable="false">
    <div class="scale-style">
      <!-- スケーリング形式 -->
      <v-btn-toggle v-model="text" tile group>
        <v-btn @click="$emit('convert-start', 1)">
          Negative
        </v-btn>
        <v-btn @click="$emit('convert-start', 2)">
          GrayScale
        </v-btn>
        <v-btn @click="$emit('convert-start', 3)">
          Test
        </v-btn>
      </v-btn-toggle>
    </div>
  </div>
</template>

<style lang="scss">
.pixel-scaler-bottom {
  flex: 1;
  display: flex;
  flex-direction: row;
  background: #3344dd;
  color: white;
}
.scale-style {
  margin: 10px;
}
</style>
