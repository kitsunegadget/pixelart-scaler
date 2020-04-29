<template>
  <div class="pixel-scaler-type" draggable="false">
    <div v-show="converting" class="disabled-overlay"></div>
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
      <v-btn-toggle color="blue" class="type-button" dense borderless tile group mandatory>
        <v-btn
          :loading="loading.loadingNoScale"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('NoScale')"
        >
          No Scaling
        </v-btn>
        <hr />

        <v-btn
          :loading="loading.loadingEpx2"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('Epx2')"
        >
          EPX / Scale 2x
        </v-btn>
        <v-btn
          :loading="loading.loadingEpx3"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('Epx3')"
        >
          Scale 3x
        </v-btn>
        <v-btn
          :loading="loading.loadingEpx4"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('Epx4')"
        >
          Scale 4x
        </v-btn>
        <hr />

        <v-btn
          :loading="loading.loadingEpxB"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('EpxB')"
        >
          EPXB 2x
        </v-btn>
        <v-btn
          :loading="loading.loadingEpxC"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('EpxC')"
        >
          EPXC 2x
        </v-btn>
        <v-btn
          :loading="loading.loadingEpx33"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('Epx33')"
        >
          EPX3 3x
        </v-btn>
        <hr />

        <v-btn
          :loading="loading.loadingEagle2"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('Eagle2')"
        >
          Eagle 2x
        </v-btn>
        <!-- <v-btn @click="$emit('convert-start', 'eagle3')">
          Eagle 3x
        </v-btn> -->
        <!-- <v-btn @click="$emit('convert-start', 'eagle3xB')">
          Eagle 3xB
        </v-btn> -->
        <hr />

        <v-btn
          :loading="loading.loading2xSaI"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('2xSaI')"
        >
          SaI 2x
        </v-btn>
        <v-btn
          :loading="loading.loadingSuper2xSaI"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('Super2xSaI')"
        >
          SuperSaI 2x
        </v-btn>
        <v-btn
          :loading="loading.loadingSuperEagle"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('SuperEagle')"
        >
          SuperEagle 2x
        </v-btn>
        <hr />

        <v-btn
          :loading="loading.loadingHQx2"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('HQx2')"
        >
          HQ 2x
        </v-btn>
        <v-btn
          :loading="loading.loadingHQx3"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('HQx3')"
        >
          HQ 3x
        </v-btn>
        <v-btn
          :loading="loading.loadingHQx4"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('HQx4')"
        >
          HQ 4x
        </v-btn>
        <hr />

        <v-btn
          :loading="loading.loadingXBR2"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('XBR2')"
        >
          xBR 2x
        </v-btn>
        <v-btn
          :loading="loading.loadingXBR3"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('XBR3')"
        >
          xBR 3x
        </v-btn>
        <v-btn
          :loading="loading.loadingXBR4"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('XBR4')"
        >
          xBR 4x
        </v-btn>
        <hr />

        <v-btn
          :loading="loading.loadingXBRz2"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('XBRz2')"
        >
          xBRz 2x
        </v-btn>
        <v-btn
          :loading="loading.loadingXBRz3"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('XBRz3')"
        >
          xBRz 3x
        </v-btn>
        <v-btn
          :loading="loading.loadingXBRz4"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('XBRz4')"
        >
          xBRz 4x
        </v-btn>
        <v-btn
          :loading="loading.loadingXBRz5"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('XBRz5')"
        >
          xBRz 5x
        </v-btn>
        <v-btn
          :loading="loading.loadingXBRz6"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('XBRz6')"
        >
          xBRz 6x
        </v-btn>

        <!-- <v-btn tile text color="indigo" x-large active-class class="convert-button" @click="$emit('convert-start', '0')">
          Test
        </v-btn> -->
      </v-btn-toggle>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    converting: {
      type: Boolean
    }
  },
  data() {
    return {
      loading: {
        // loader: null,
        loadingNoScale: false,
        loadingEpx2: false,
        loadingEpx3: false,
        loadingEpx4: false,
        loadingEpxB: false,
        loadingEpxC: false,
        loadingEpx33: false,
        loadingEagle2: false,
        loading2xSaI: false,
        loadingSuper2xSaI: false,
        loadingSuperEagle: false,
        loadingHQx2: false,
        loadingHQx3: false,
        loadingHQx4: false,
        loadingXBR2: false,
        loadingXBR3: false,
        loadingXBR4: false,
        loadingXBRz2: false,
        loadingXBRz3: false,
        loadingXBRz4: false,
        loadingXBRz5: false,
        loadingXBRz6: false
      }
    }
  },
  watch: {
    converting() {
      if (!this.converting) {
        for (const loading in this.loading) {
          this.$set(this.loading, loading, false)
        }
      }
    }
  },
  methods: {
    convertClick(name: string) {
      const l = 'loading' + name
      this.$set(this.loading, l, true)
      this.$emit('convert-start', name)
    }
  }
})
</script>

<style lang="scss">
.pixel-scaler-type {
  position: relative;
  width: 250px;
  min-height: 640px;
  height: calc(100vh - 350px);
  display: flex;
  flex-direction: column;
  // justify-content: space-around;
  // background: #3344dd;
  color: white;

  @media (orientation: portrait) {
    min-height: initial;
    height: 30vh;
    width: 100%;
  }
}

.disabled-overlay {
  @include absolute-centering;
  bottom: 0;
  z-index: 1;
  // background: #00ff00;
  opacity: 0.5;
}

.scale-style {
  // margin: 10px;
  display: flex;
  flex-direction: column;
  // align-items: center;
  flex-wrap: wrap;
  // border: #3344dd solid 1px;

  overflow-y: scroll;
  overflow-x: hidden;

  // for firefox
  scrollbar-width: thin;
  scrollbar-color: $color-blue2 $color-white;

  // for webkit browser
  &::-webkit-scrollbar {
    display: block;
    overflow: hidden;
    width: 7px;

    &:hover {
      width: 10px;
    }
  }
  &::-webkit-scrollbar-button {
    background-color: $color-blue1;
    // display: none;
    height: 1px;
  }
  &::-webkit-scrollbar-corner {
    background: #f00;
  }
  &::-webkit-scrollbar-thumb {
    background: $color-blue2;
  }
  &::-webkit-scrollbar-track {
    // background: #000;
  }
  &::-webkit-scrollbar-track-piece {
    // background: #00f;
  }

  .type-button {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    // background: #3344dd !important;

    .convert-button {
      font-weight: bold;
      text-transform: capitalize;
    }
  }

  hr {
    margin: 0;
  }
}
</style>
