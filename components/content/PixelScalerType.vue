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
          {{ 'No Scaling' }}
        </v-btn>
        <hr />

        <v-btn
          :loading="loading.loadingEpx"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('Epx')"
        >
          {{ 'EPX / Scale 2x' }}
        </v-btn>
        <v-btn
          :loading="loading.loadingScale3x"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('Scale3x')"
        >
          {{ 'Scale 3x' }}
        </v-btn>
        <v-btn
          :loading="loading.loadingScale4x"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('Scale4x')"
        >
          {{ 'Scale 4x' }}
        </v-btn>
        <hr />

        <v-btn
          :loading="loading.loadingEpxB"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('EpxB')"
        >
          {{ 'EPXB 2x' }}
        </v-btn>
        <v-btn
          :loading="loading.loadingEpxC"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('EpxC')"
        >
          {{ 'EPXC 2x' }}
        </v-btn>
        <v-btn
          :loading="loading.loadingEpx3"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('Epx3')"
        >
          {{ 'EPX3 3x' }}
        </v-btn>
        <hr />

        <v-btn
          :loading="loading.loadingEagle"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('Eagle')"
        >
          {{ 'Eagle 2x' }}
        </v-btn>
        <!-- <v-btn @click="$emit('convert-start', 'eagle3x')">
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
          {{ 'SaI 2x' }}
        </v-btn>
        <v-btn
          :loading="loading.loadingSuper2xSaI"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('Super2xSaI')"
        >
          {{ 'SuperSaI 2x' }}
        </v-btn>
        <v-btn
          :loading="loading.loadingSuperEagle"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('SuperEagle')"
        >
          {{ 'SuperEagle 2x' }}
        </v-btn>
        <hr />

        <v-btn
          :loading="loading.loadingHQ2x"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('HQ2x')"
        >
          {{ 'HQ 2x' }}
        </v-btn>
        <v-btn
          :loading="loading.loadingHQ3x"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('HQ3x')"
        >
          {{ 'HQ 3x' }}
        </v-btn>
        <v-btn
          :loading="loading.loadingHQ4x"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('HQ4x')"
        >
          {{ 'HQ 4x' }}
        </v-btn>
        <hr />

        <v-btn
          :loading="loading.loadingXBR2x"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('XBR2x')"
        >
          {{ 'xBR 2x' }}
        </v-btn>
        <v-btn
          :loading="loading.loadingXBR3x"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('XBR3x')"
        >
          {{ 'xBR 3x' }}
        </v-btn>
        <v-btn
          :loading="loading.loadingXBR4x"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('XBR4x')"
        >
          {{ 'xBR 4x' }}
        </v-btn>
        <hr />

        <v-btn
          :loading="loading.loadingXBRz2x"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('XBRz2x')"
        >
          {{ 'xBRz 2x' }}
        </v-btn>
        <v-btn
          :loading="loading.loadingXBRz3x"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('XBRz3x')"
        >
          {{ 'xBRz 3x' }}
        </v-btn>
        <v-btn
          :loading="loading.loadingXBRz4x"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('XBRz4x')"
        >
          {{ 'xBRz 4x' }}
        </v-btn>
        <v-btn
          :loading="loading.loadingXBRz5x"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('XBRz5x')"
        >
          {{ 'xBRz 5x' }}
        </v-btn>
        <v-btn
          :loading="loading.loadingXBRz6x"
          text
          color="indigo"
          class="convert-button"
          @click="convertClick('XBRz6x')"
        >
          {{ 'xBRz 6x' }}
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
    },
    currentFilter: {
      type: String,
      default: 'NoScale'
    }
  },
  data() {
    return {
      loading: {
        // loader: null,
        loadingNoScale: false,
        loadingEpx: false,
        loadingScale3: false,
        loadingScale4: false,
        loadingEpxB: false,
        loadingEpxC: false,
        loadingEpx3: false,
        loadingEagle: false,
        loading2xSaI: false,
        loadingSuper2xSaI: false,
        loadingSuperEagle: false,
        loadingHQ2x: false,
        loadingHQ3x: false,
        loadingHQx4x: false,
        loadingXBR2x: false,
        loadingXBR3x: false,
        loadingXBR4x: false,
        loadingXBRz2x: false,
        loadingXBRz3x: false,
        loadingXBRz4x: false,
        loadingXBRz5x: false,
        loadingXBRz6x: false
      }
    }
  },
  watch: {
    converting() {
      if (!this.converting) {
        for (const loading in this.loading) {
          this.$set(this.loading, loading, false)
        }
      } else {
        const l = 'loading' + this.currentFilter
        this.$set(this.loading, l, true)
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
  // background: #3344dd;
  color: white;

  @media (orientation: portrait) {
    min-height: initial;
    height: 30vh;
    width: calc(100% - 17px);
  }
}

.disabled-overlay {
  @include absolute-centering;
  bottom: 0;
  z-index: 1;
  opacity: 0.5;
}

.scale-style {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  // border: #3344dd solid 1px;

  overflow-y: scroll;
  overflow-x: hidden;

  // for firefox
  scrollbar-width: thin;
  scrollbar-color: $color-blue2 $color-graylight;

  // for webkit browser
  &::-webkit-scrollbar {
    display: block;
    overflow: hidden;
    width: 7px;
  }
  &::-webkit-scrollbar-button {
    background-color: $color-blue1;
    // display: none;
    height: 1px;
  }
  // &::-webkit-scrollbar-corner {
  //   background: #f00;
  // }
  &::-webkit-scrollbar-thumb {
    background: $color-blue2;

    &:hover {
      background: $color-blue1;
    }
  }
  // &::-webkit-scrollbar-track {
  //   // background: #000;
  // }
  // &::-webkit-scrollbar-track-piece {
  //   // background: #00f;
  // }

  .type-button {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    // background: #3344dd !important;

    .convert-button {
      font-weight: bold;
      text-transform: capitalize;
      font-size: 1.4rem;
    }
  }

  hr {
    margin: 0;
  }
}
</style>
