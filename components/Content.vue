<template>
  <div class="content">
    <div class="container">
      <div class="content-inside">
        <div class="description">
          <span>ドット絵の色々なスケーリングを試してみよう！</span>
          <p>入力最大解像度は 512x512 まで。</p>
          <p>現在png形式のみ対応しています。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.content {
  width: 100%;
  height: 500px;
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
    font-size: 1.4em;
    color: $color-black6;
  }
  > p {
    margin: 5px 10px;
    font-size: 0.9em;
  }
}
</style>
