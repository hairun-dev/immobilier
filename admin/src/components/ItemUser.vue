<template>
  <div class="boxItemUser">
    <div  class="div-profil">
      <img class="" :src="urlProfil" alt="">
    </div>
    <div class="col detail">
      <div class="text-bold">{{`${data.name}`}}</div>
      <div>{{`${data.email}`}}</div>
    </div>
    <div class="action">
      <q-btn class="q-mr-sm" size="sm" color="grey" dense icon="edit" @click="handleNewUser(true)" />
      <q-btn size="sm" color="red" dense icon="delete" @click="handleConfirmation(true)" />
    </div>
    <q-dialog v-model="dialogNewUser" position="top">
      <new-user-vue :data="data"></new-user-vue>
    </q-dialog>
    <q-dialog v-model="dialogConfirmation" persistent>
      <delete-confirm-vue message="Voulez-vous supprimer cet utilisateur?" @ok="onDelete" @close="handleConfirmation(false)"></delete-confirm-vue>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import NewUserVue from './dialogs/NewUser.vue'
import DeleteConfirmVue from './dialogs/DialogConfirmation.vue'
export default {
  components: {
    NewUserVue,
    DeleteConfirmVue
  },
  setup () {
    const BASE_URL = ref(null)
    const dialogNewUser = ref(false)
    const dialogConfirmation = ref(false)
    const handleBaseUrl = bUrl => {
      BASE_URL.value = bUrl
    }
    const handleNewUser = val => {
      dialogNewUser.value = val
    }
    const handleConfirmation = val => {
      dialogConfirmation.value = val
    }
    return {
      BASE_URL,
      dialogNewUser,
      dialogConfirmation,
      handleNewUser,
      handleConfirmation,
      handleBaseUrl
    }
  },
  props: {
    data: {
      required: true,
      value: Object
    }
  },
  data () {
    return {
    }
  },
  methods: {
    onDelete () {
      this.handleConfirmation(false)
      console.log('delete user')
      this.$util.showLoading()
      this.$back.delete(`api/v1/user/${this.data.id}`)
        .then(res => {
          this.$emit('refresh')
        })
        .catch(e => {
          console.log('ERROR ON DELETE USER', e)
        })
        .then(() => {
          this.$util.hideLoading()
        })
    }
  },
  computed: {
    urlProfil () {
      if (!this.data.avatar) return 'avatar2.png'
      return `${this.BASE_URL}/avatar/${this.data.avatar.id}/${this.data.avatar.file_name}`
    }
  },
  mounted () {
    this.handleBaseUrl(process.env.API_BASE_URL)
  }
}
</script>

<style lang="sass" scoped>
.boxItemUser
  max-width: 20rem
  margin-right: 1rem
  border-radius: 2px
  box-shadow: 2px 2px 5px grey
  margin-bottom: 1rem
  padding: 12px
  display: flex
  background-color: $grey-5
  position: relative

  .div-profil
    width: 5rem
    height: 5rem
    background-color: $primary
    padding: 0.3rem
    border-radius: 50%
    margin-right: 10px

    img
      border-radius: 50%
      width: 100%
      height: 100%
      background-color: #fff

  .detail
    display: flex
    justify-content: center
    flex-direction: column

  .action
    position: absolute
    bottom: 5px
    right: 5px
</style>
