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
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat :label="$t('login')" color="primary" @click="onLogin" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
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
  methods: {
    async onLogin () {
      const isValid = await this.$refs.myForm.validate()
      if (isValid) {
        if (this.email === 'admin' && this.password === 'admin') {
          this.onLogged()
        } else {
          this.$util.showError('Authentification error')
        }
      }
    },
    onLogged () {
      this.$router.push({ name: 'immobilier', params: { lang: 'en' } })
    }
  },
  mounted () {
    console.log('VUE_APP_GOOGLE_API_KEY', process.env.VUE_APP_GOOGLE_API_KEY)
  }
}
</script>

<style lang="sass" scoped>
.boxLogin
  height: 100vh
  display: flex
  align-items: center
  justify-content: center

  .card
    min-width: 400px
</style>
