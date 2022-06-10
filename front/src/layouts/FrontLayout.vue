<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FrontPage',
  components: {
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
