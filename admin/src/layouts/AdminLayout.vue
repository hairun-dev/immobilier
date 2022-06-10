<template>
  <div class="q-pa-md">
    <div class="row">
      <q-space></q-space>
      <q-select dense :options="lang.options" v-model="lang.selected" outlined class="q-mb-md"></q-select>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AdminPage',
  components: {
  },
  data () {
    return {
      lang: {
        options: [{
          value: 'fr',
          label: 'FR'
        }, {
          value: 'en',
          label: 'EN'
        }],
        selected: {
          value: 'fr',
          label: 'FR'
        }
      }
    }
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
    },
    'lang.selected' (val) {
      this.$router.push(`/${val.value}`)
    }
  }
})
</script>
