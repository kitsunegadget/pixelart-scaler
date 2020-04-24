<template>
  <footer class="footer">
    <div class="container">
      <span>
        &copy; 2020 Kitsune Gadget
      </span>
    </div>
  </footer>
</template>

<style lang="scss">
.footer {
  margin: 10px 0;
  color: $color-white;
  width: 100%;

  span {
    @include flex-centering(row);
    font-size: 0.75em;
  }
}
</style>
