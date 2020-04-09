<template>
  <div class="pixel-scaler-bottom dragArea" draggable="false">
    <div class="scale-style">
      <!-- スケーリング形式 -->
      <v-btn-toggle class="type-button" v-model="text" tile group>
        <v-btn @click="$emit('convert-start', 'invert')">
          Negative
        </v-btn>
        <v-btn @click="$emit('convert-start', 'grayscale')">
          GrayScale
        </v-btn>
        <v-btn @click="$emit('convert-start', 'binarization')">
          Binarization
        </v-btn>
        <v-btn @click="$emit('convert-start', 'epx2')">
          Scale2x
        </v-btn>
        <v-btn @click="$emit('convert-start', 'epx3')">
          Scale3x
        </v-btn>
        <v-btn @click="$emit('convert-start', 'epx4')">
          Scale4x
        </v-btn>
        <v-btn @click="$emit('convert-start', 'eagle2')">
          Eagle2x
        </v-btn>
        <v-btn @click="$emit('convert-start', 'eagle3')">
          Eagle3x
        </v-btn>
        <v-btn @click="$emit('convert-start', 'eagle3xB')">
          Eagle3xB
        </v-btn>
        <v-btn @click="$emit('convert-start', 0)">
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

  .type-button {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
