<template>
  <div class="q-pa-md">
    <q-carousel
      v-model="slide"
      transition-prev="slide-right"
      transition-next="slide-left"
      swipeable
      animated
      control-color="primary"
      navigation
      padding
      arrows
      height="300px"
      class="bg-grey-1 shadow-2 rounded-borders"
    >
      <q-carousel-slide :name="idx + 1" class="column no-wrap" v-for="(it, idx) in carrous" :key="idx">
        <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
          <q-img v-if="galleries[2 * idx] !== undefined" class="rounded-borders col-6 full-height" :src="`https://picsum.photos/id/${(2 * idx)}/300/300`" />
          <q-img v-if="galleries[(2 * idx) + 1]" class="rounded-borders col-6 full-height" :src="`https://picsum.photos/id/${(2 * idx) + 1}/300/300`" />
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    return {
      slide: ref(1)
    }
  },
  props: ['data'],
  data () {
    return {
      galleries: [],
      carrous: []
    }
  },
  mounted () {
    this.galleries = [...Array(this.data).keys()]
    this.carrous = [...Array(Math.floor(this.data / 2) + (this.data % 2 === 0 ? 0 : 1)).keys()]
  }
}
</script>

<style lang="sass" scoped>
.boxGallery
  display: flex
  flex-wrap: wrap
  align-items: center

  .item
    margin: 10px
    width: 150px
    height: 150px

    img
      width: 100%
      height: 100%
</style>
