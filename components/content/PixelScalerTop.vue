<template>
  <div class="pixel-scaler-top">
    <div class="input-image"></div>
    <div class="transform-arrow"></div>
    <div class="output-image"></div>
  </div>
</template>

<style lang="scss">
.pixel-scaler-top {
  position: relative;
  @include flex-centering(row);
  // height: 500px;
  background: #ddd;
}
.input-image {
  margin: 20px;
  height: 256px;
  width: 256px;
  background: #666;
}
.transform-arrow {
  height: 50px;
  width: 50px;
  margin: 20px;
  background: #222;
}
.output-image {
  @extend .input-image;
}
</style>
