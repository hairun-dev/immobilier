<template>
  <div class="boxPageAdmin">
    <div class="header">
      <div @click="onNavClicked('user')" class="btnNav" :class="selected === 'user' ? 'selected' : ''">Utilsateur</div>
      <div @click="onNavClicked('bien')" class="btnNav" :class="selected === 'bien' ? 'selected' : ''">Bien immobilier</div>
      <q-space></q-space>
      <q-select dense :options="lang.options" v-model="lang.selected" outlined class="q-mr-sm"></q-select>
      <img @click="dialogLogout = true" class="img-logout" src="power-off.png" alt="">
    </div>
    <router-view></router-view>
    <q-dialog v-model="dialogLogout">
      <confirmation-vue @close="dialogLogout = false" message="Voulez-vous vraiment deconnecter?"></confirmation-vue>
    </q-dialog>
  </div>
</template>

<script>
import ConfirmationVue from 'src/components/dialogs/DialogConfirmation.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AdminPage',
  components: {
    ConfirmationVue
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
      },
      selected: 'user',
      dialogLogout: false
    }
  },
  methods: {
    switchLocale () {
      const locale = this.$route.params.lang
      if (this.$i18n.locale !== locale) {
        this.$i18n.locale = locale
      }
    },
    addGoogleMapKey () {
      const mapKey = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}&libraries=places`
      console.log('script', mapKey)
      const mapScript = document.createElement('script')
      mapScript.setAttribute('src', mapKey)
      document.head.appendChild(mapScript)
    },
    checkUser () {
      const user = this.$q.localStorage.getItem('user')
      if (!user) {
        this.$router.push({ name: 'login' })
      }
    },
    onNavClicked (name) {
      this.selected = name
      this.$router.push({
        name,
        params: {
          lang: this.$i18n.locale
        }
      })
    }
  },
  mounted () {
    // this.addGoogleMapKey()
    this.checkUser()
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
<style lang="sass" scoped>
.header
  height: $headerHeight
  background-color: $primary
  display: flex
  align-items: center
  justify-content: center
  color: #fff

  .btnNav
    display: flex
    align-items: center
    justify-content: center
    background-color: rgba(0, 0, 0, 0.1)
    color: #fff
    cursor: pointer
    padding: 7px 20px
    height: 100%
    font-size: 15px

    &:hover
      background-color: rgba(0, 0, 0, 0.2)

  .selected
    background-color: rgba(0, 0, 0, 0.5)

  .img-logout
    width: 30px
    height: 30px
    margin-right: 20px
    cursor: pointer

</style>
