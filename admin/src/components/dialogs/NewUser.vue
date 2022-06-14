<template>
  <q-card class="card">
    <q-card-section>
      <div class="text-h6">{{$t('registerPage')}}</div>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-ma-md">
      <div class="avatar" v-if="!data">
        <img @click="$util.openPick('fileAvatar')" :src="avatar.binary ? avatar.binary : 'avatar2.png'" alt="" srcset="">
      </div>
      <q-form
        @submit="onRegister"
        class="q-gutter-md"
        ref="myForm"
      >
        <q-input
          v-model="name"
          label="Name *"
          lazy-rules
          filled
          :rules="[ val => val && val.length > 0 || 'Please type your name']"
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>

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
          v-if="!data"
          :rules="[ val => val && val.length > 0 || 'Please type your password']"
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
          <template v-slot:append>
            <q-icon @click="isVisible = !isVisible" :name="isVisible ? 'visibility' : 'visibility_off'" />
          </template>
        </q-input>
        <q-input
          v-model="password2"
          label="Confirm password *"
          :type="isVisible2 ? 'text' : 'password'"
          lazy-rules
          filled
          v-if="!data"
          :rules="[ val => val && val.length > 0 && val === password || 'Please type your password']"
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
          <template v-slot:append>
            <q-icon @click="isVisible2 = !isVisible2" :name="isVisible2 ? 'visibility' : 'visibility_off'" />
          </template>
        </q-input>
      </q-form>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right">
      <q-btn label="Cancel" no-caps @click="$emit('close')" />
      <q-btn :label="$t('save')" no-caps color="primary" @click="onRegister" />
    </q-card-actions>
    <q-file class="fileAvatar" v-model="avatar.file" label="Standard" style="display: none;" />
  </q-card>
</template>

<script>
import { ref } from 'vue'
export default {
  setup () {
    const id = ref(null)
    const name = ref(null)
    const email = ref(null)
    const password = ref(null)
    const password2 = ref(null)
    const isVisible = ref(false)
    const isVisible2 = ref(false)
    const avatar = ref({})

    const updateValue = data => {
      name.value = data.name
      email.value = data.email
      id.value = data.id
      password.value = 'x'
      password2.value = 'x'
    }

    const setAvatar = data => {
      avatar.value = data
    }

    return {
      id,
      name,
      email,
      password,
      password2,
      isVisible,
      isVisible2,
      updateValue,
      avatar,
      setAvatar
    }
  },
  data () {
    return {
    }
  },
  props: ['data'],
  methods: {
    async onRegister () {
      const isValid = await this.$refs.myForm.validate()
      if (isValid) {
        // update
        if (this.data) {
          this.updateUser()
        } else {
          if (!this.avatar.file) {
            this.$util.showError('Veuillez selectionner votre photo de profil')
            return
          }
          this.addUser()
        }
      }
    },
    addUser () {
      const payload = {
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.password2,
        avatar: this.avatar.file
      }
      this.$util.showLoading()
      this.$back.post('api/v1/register', payload)
        .then(res => {
          this.$emit('success')
        })
        .catch(e => {
          console.log('ERROR ON ADD USER', e)
        })
        .then(() => {
          this.$util.hideLoading()
        })
    },
    updateUser () {
      const payload = {
        name: this.name,
        email: this.email
      }
      this.$util.showLoading()
      this.$back.put(`api/v1/user/update/${this.id}`, payload)
        .then(res => {
          this.$emit('success')
        })
        .catch(e => {
          console.log('ERROR ON UPDATE USER', e)
        })
        .then(() => {
          this.$util.hideLoading()
        })
    }
  },
  mounted () {
    if (this.data) {
      this.updateValue(this.data)
    }
  },
  watch: {
    async 'avatar.file' (val) {
      if (val) {
        const binary = await this.$util.convertFile(val)
        this.setAvatar({
          file: val,
          binary
        })
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.card
  min-width: 500px

  .avatar
    display: flex
    align-items: center
    justify-content: center

    img
      width: 100px
      height: 100px
      margin-bottom: 20px
      border-radius: 50%
      border: 5px solid #000
      cursor: pointer
</style>
