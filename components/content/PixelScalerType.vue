<template>
  <div class="pixel-scaler-bottom dragArea" draggable="false">
    <div class="scale-style">
      <!-- スケーリング形式 -->
      <!-- <v-btn-toggle v-model="text" class="type-button" tile group>
        <v-btn @click="$emit('convert-start', 'invert')">
          Negative
        </v-btn>
        <v-btn @click="$emit('convert-start', 'grayscale')">
          GrayScale
        </v-btn>
        <v-btn @click="$emit('convert-start', 'binarization')">
          Binarization
        </v-btn>
      </v-btn-toggle> -->
      <v-btn-toggle v-model="text" class="type-button" tile group mandatory>
        <v-btn @click="$emit('convert-start', 'epx2')">
          EPX / Scale 2x
        </v-btn>
        <v-btn @click="$emit('convert-start', 'epx3')">
          Scale 3x
        </v-btn>
        <v-btn @click="$emit('convert-start', 'epx4')">
          Scale 4x
        </v-btn>
        <v-btn @click="$emit('convert-start', 'epxB')">
          EPXB 2x
        </v-btn>
        <v-btn @click="$emit('convert-start', 'epxC')">
          EPXC 2x
        </v-btn>
        <v-btn @click="$emit('convert-start', 'epx33')">
          EPX3 3x
        </v-btn>
        <v-btn @click="$emit('convert-start', 'eagle2')">
          Eagle 2x
        </v-btn>
        <!-- <v-btn @click="$emit('convert-start', 'eagle3')">
          Eagle 3x
        </v-btn> -->
        <!-- <v-btn @click="$emit('convert-start', 'eagle3xB')">
          Eagle 3xB
        </v-btn> -->
        <v-btn @click="$emit('convert-start', '2xSaI')">
          SaI 2x
        </v-btn>
        <v-btn @click="$emit('convert-start', 'Super2xSaI')">
          SuperSaI 2x
        </v-btn>
        <v-btn @click="$emit('convert-start', 'SuperEagle')">
          SuperEagle 2x
        </v-btn>
        <v-btn @click="$emit('convert-start', 'HQx2')">
          HQ 2x
        </v-btn>
        <v-btn @click="$emit('convert-start', 'HQx3')">
          HQ 3x
        </v-btn>
        <v-btn @click="$emit('convert-start', 'HQx4')">
          HQ 4x
        </v-btn>
        <v-btn @click="$emit('convert-start', 'xBR2')">
          xBR 2x
        </v-btn>
        <v-btn @click="$emit('convert-start', 'xBR3')">
          xBR 3x
        </v-btn>
        <v-btn @click="$emit('convert-start', 'xBR4')">
          xBR 4x
        </v-btn>
        <v-btn @click="$emit('convert-start', 'xBRz2')">
          xBRz 2x
        </v-btn>
        <v-btn @click="$emit('convert-start', 'xBRz3')">
          xBRz 3x
        </v-btn>
        <v-btn @click="$emit('convert-start', 'xBRz4')">
          xBRz 4x
        </v-btn>
        <v-btn @click="$emit('convert-start', 'xBRz5')">
          xBRz 5x
        </v-btn>
        <v-btn @click="$emit('convert-start', 'xBRz6')">
          xBRz 6x
        </v-btn>
        <v-btn @click="$emit('convert-start', '0')">
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
