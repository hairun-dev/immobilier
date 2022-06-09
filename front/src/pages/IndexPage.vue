<template>
  <div>
    <router-view></router-view>
    <!-- <bien-immobilier-vue></bien-immobilier-vue> -->
  </div>
</template>

<script>
import { defineComponent } from 'vue'
// import BienImmobilierVue from './BienImmobilier.vue'

export default defineComponent({
  name: 'IndexPage',
  components: {
    // BienImmobilierVue
  },
  methods: {
    switchLocale () {
      const locale = this.$route.params.lang
      if (this.$i18n.locale !== locale) {
        this.$i18n.locale = locale
      }
    }
  },
  mounted () {
    this.switchLocale()
  },
  watch: {
    '$route.params.lang' (val) {
      this.switchLocale()
    }
  }
})
</script>
