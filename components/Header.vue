<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <h1 class="title">
          {{ title }}
        </h1>
        <div class="right-nav">
          <ul>
            <li v-for="nav in navItems" :key="nav.id">
              <span @click="$emit('show-about', $event)">{{ nav.name }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue'
import nuxtConfig from '../nuxt.config'

export default Vue.extend({
  data() {
    return {
      title: nuxtConfig.head.title,
      navItems: [
        {
          id: 0,
          name: 'このサイトについて'
        }
      ],
      isShowAbout: false
    }
  }
})
</script>

<style lang="scss">
.header {
  width: 100%;
  height: 50px;
  background: $color-bluegray;
  color: $color-white;
  z-index: 1;
  box-shadow: 0 0 5px #666a;

  .title {
    font-size: 1.4em !important;
    font-weight: bold;
    @include flex-centering(row);
    margin: 0 10px;
    // line-height: 1.3em;
    cursor: default;
  }
}

.header-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100%;
}

.right-nav {
  height: 100%;

  ul {
    margin-right: 10px;
    padding: 0;
    height: 100%;
  }
  li {
    height: 100%;
    margin: 0 2px;
    list-style: none;
    @include flex-centering(row);
  }
  span {
    font-size: 0.8em;
    display: block;
    cursor: pointer;

    &:hover {
      color: $color-blue2;
    }
  }
}
</style>
