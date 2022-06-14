<template>
  <div class="boxLogin">
    <q-card class="card">
      <q-card-section>
        <div class="text-h6">{{$t('login')}}</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll q-ma-md">
        <q-form
          @submit="onLogin"
          class="q-gutter-md"
          ref="myForm"
        >
          <q-input
            v-model="email"
            label="Email *"
            lazy-rules
            filled
            :rules="[ val => val && val.length > 0 || 'Please type your email']"
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <q-input
            v-model="password"
            label="Password *"
            :type="isVisible ? 'text' : 'password'"
            lazy-rules
            filled
            :rules="[ val => val && val.length > 0 || 'Please type your password']"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-icon @click="isVisible = !isVisible" :name="isVisible ? 'visibility' : 'visibility_off'" />
            </template>
          </q-input>
        </q-form>
        <div class="flex">
          <q-space></q-space>
          <div class="register" @click="dialog.new_user = true">Register?</div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat :label="$t('login')" color="primary" @click="onLogin" />
      </q-card-actions>
    </q-card>
    <q-dialog v-model="dialog.new_user" position="top" persistent>
      <new-user-vue @close="dialog.new_user = false" @success="onSuccess"></new-user-vue>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import NewUserVue from 'src/components/dialogs/NewUser.vue'
export default {
  components: {
    NewUserVue
  },
  setup () {
    const email = ref(null)
    const password = ref(null)
    const isVisible = ref(false)

    return {
      email,
      password,
      isVisible
    }
  },
  data () {
    return {
      dialog: {
        new_user: false
      }
    }
  },
  methods: {
    async onLogin () {
      const isValid = await this.$refs.myForm.validate()
      if (isValid) {
        const payload = {
          email: this.email,
          password: this.password
        }
        this.$util.showLoading()
        // await this.$back.get('sanctum/csrf-cookie')
        this.$back.post('api/v1/login', payload)
          .then(res => {
            this.onLogged(payload)
          })
          .catch(e => {
            console.log('error', e.response.data.message)
          })
          .then(() => {
            this.$util.hideLoading()
          })
      }
    },
    onLogged (user) {
      this.$q.localStorage.set('user', user)
      this.$router.push({ name: 'user', params: { lang: 'en' } })
    },
    checkToken () {
      this.$util.showLoading()
      this.$back.get('sanctum/csrf-cookie')
        .then(res => {
        })
        .catch(e => {
          console.log('error', e)
        })
        .then(() => {
          this.$util.hideLoading()
        })
    },
    getCookie (name) {
      if (!document.cookie) {
        return null
      }
      const xsrfCookies = document.cookie.split(';')
        .map(c => c.trim())
        .filter(c => c.startsWith(name + '='))

      if (xsrfCookies.length === 0) {
        return null
      }
      return decodeURIComponent(xsrfCookies[0].split('=')[1])
    },
    onSuccess () {
      this.dialog.new_user = false
      this.$util.showMessage('Utilisateur ajouté avec succèes')
    }
  },
  mounted () {
  },
  async created () {
  }
}
</script>

<style lang="sass" scoped>
.boxLogin
  height: 100vh
  display: flex
  align-items: center
  justify-content: center
  background-color: grey

  .card
    min-width: 400px

.register
  cursor: pointer
  color: $primary
  font-style: italic
</style>
