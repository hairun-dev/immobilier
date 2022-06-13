<template>
  <div class="q-pa-md">
    <div class="row">
      <q-space></q-space>
      <q-btn class="q-mb-md" no-caps size="sm" @click="$util.openPick('image')">+ Ajouter photo</q-btn>
    </div>
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
      v-if="galleries[0]"
    >
      <q-carousel-slide :name="idx + 1" class="column no-wrap" v-for="(it, idx) in carrous" :key="idx">
        <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
          <q-img v-if="galleries[2 * idx] !== undefined" class="rounded-borders col-6 full-height" :src="galleries[2 * idx]" />
          <q-img v-if="galleries[(2 * idx) + 1]" class="rounded-borders col-6 full-height" :src="galleries[(2 * idx) + 1]" />
        </div>
      </q-carousel-slide>
    </q-carousel>
    <div class="q-py-md text-center">
      Pas de photo
    </div>
    <q-file class="image" v-model="image" label="Standard" style="display: none;" />
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const galleries = ref([])
    const carrous = ref([])
    const image = ref(null)

    const handleGalleries = data => {
      galleries.value = data
    }
    const handleCarrous = data => {
      carrous.value = data
    }
    return {
      slide: ref(1),
      image,
      galleries,
      carrous,
      handleGalleries,
      handleCarrous
    }
  },
  props: ['data'],
  data () {
    return {
    }
  },
  watch: {
    image (val) {
      console.log('val', val)
    }
  },
  mounted () {
    this.handleGalleries(this.data)
    this.handleCarrous([...Array(Math.floor(this.galleries.length / 2) + (this.galleries.length % 2 === 0 ? 0 : 1)).keys()])
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
