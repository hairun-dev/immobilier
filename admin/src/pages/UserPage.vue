<template>
  <div class="boxUser">
    <q-btn class="q-mb-md" @click="exportData">Exporter data</q-btn>
    <div class="listUser">
      <item-user-vue @refresh="getUsers" v-for="(it, idx) in users" :key="idx" :data="it"></item-user-vue>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import ItemUserVue from 'src/components/ItemUser.vue'
export default {
  setup () {
    const users = ref([])
    const updateUsers = data => {
      users.value = data
    }
    return {
      users,
      updateUsers
    }
  },
  data () {
  },
  components: {
    ItemUserVue
  },
  methods: {
    getUsers () {
      this.$util.showLoading()
      this.$back.get('api/v1/user')
        .then(res => {
          this.updateUsers(res.users)
        })
        .catch(e => {
          console.log('ERROR ON GETALL USERS', e)
        })
        .then(() => {
          this.$util.hideLoading()
        })
    },
    exportData () {
      this.$util.openUrl(`${process.env.API_BASE_URL}/api/v1/export-excel`)
    }
  },
  mounted () {
    this.getUsers()
  }
}
</script>

<style lang="sass" scoped>
.boxUser
  padding: 10px
  .listUser
    display: flex
    flex-wrap: wrap
</style>
