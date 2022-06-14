<template>
  <div>
    <q-table
      :title="$t('propertyList')"
      :rows="properties"
      :columns="columns"
      row-key="id"
    >
      <template v-slot:top="props">
        <div class="q-table__title">{{$t('propertyList')}}</div>
        <q-space />
        <q-btn size="sm" color="accent" dense @click="onAddProperty" icon="add"  :label="$t('addProperty')" no-caps class="q-px-sm"/>
        <q-btn
          flat round dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
          class="q-ml-md"
        />
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn size="sm" color="accent" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
          </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            <div class="row" v-if="col.name === 'action'">
              <q-btn @click="onUpdate(props.rowIndex)" flat size="sm" color="grey" round dense icon="edit" />
              <q-btn @click="onDelete(props.rowIndex)" flat size="sm" color="red" round dense icon="delete" />
            </div>
            <div v-else>{{ col.value }}</div>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <property-gallery-vue :data="props.row.gallery"></property-gallery-vue>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog v-model="dialogNewProperty" persistent position="top">
      <new-property-vue @refresh="getAllProperties" :data="selected" @close="handleDialogNewProperty(false)"></new-property-vue>
    </q-dialog>
    <q-dialog v-model="dialogConfirmation" persistent>
      <delete-confirm-vue message="Voulez-vous supprimer cet bien?" @ok="onDeleteOk" @close="handleDialogConfirmation(false)"></delete-confirm-vue>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import NewPropertyVue from 'src/components/dialogs/NewProperty.vue'
import PropertyGalleryVue from '../components/PropertyGallery.vue'
import DeleteConfirmVue from 'src/components/dialogs/DialogConfirmation.vue'

export default {
  setup () {
    const dialogNewProperty = ref(false)
    const dialogConfirmation = ref(false)
    const properties = ref([])
    const selected = ref(null)
    const handleDialogNewProperty = data => {
      dialogNewProperty.value = data
    }
    const handleDialogConfirmation = data => {
      dialogConfirmation.value = data
    }
    const handleProperties = data => {
      properties.value = data
    }
    const handleSelected = data => {
      selected.value = data
    }
    return {
      dialogNewProperty,
      dialogConfirmation,
      properties,
      selected,
      handleDialogNewProperty,
      handleDialogConfirmation,
      handleProperties,
      handleSelected
    }
  },
  components: {
    PropertyGalleryVue,
    NewPropertyVue,
    DeleteConfirmVue
  },
  data () {
    return {
    }
  },
  computed: {
    columns () {
      return [
        { name: 'id', required: true, label: 'Id', align: 'left', field: row => row.id, format: val => `${val}`, sortable: true },
        { name: 'address', required: true, label: 'Adresse', align: 'left', field: row => row.address, format: val => `${val}`, sortable: true },
        { name: 'price', align: 'right', label: this.$t('price'), field: 'price', format: val => `${Number(val).toLocaleString()} €`, sortable: true },
        { name: 'description', align: 'left', label: 'Déscription', field: 'description', sortable: true },
        { name: 'action', align: 'center', label: '', field: 'action' }
      ]
    }
  },
  methods: {
    onDelete (idx) {
      this.handleSelected(this.properties[idx])
      this.handleDialogConfirmation(true)
    },
    onUpdate (idx) {
      this.handleSelected(this.properties[idx])
      this.handleDialogNewProperty(true)
    },
    onAddProperty () {
      this.handleSelected(null)
      this.handleDialogNewProperty(true)
    },
    getAllProperties () {
      this.$util.showLoading()
      this.$back.get('api/v1/property')
        .then(res => {
          this.handleProperties(res.property)
        })
        .catch(e => {
          console.log('ERROR ON GETALL PROPERTY', e)
        })
        .then(() => {
          this.$util.hideLoading()
        })
    },
    onDeleteOk () {
      this.handleDialogConfirmation(false)
      this.$util.showLoading()
      this.$back.delete(`api/v1/property/${this.selected.id}`)
        .then(res => {
          this.getAllProperties()
        })
        .catch(e => {
          console.log('ERROR ON DELETE PROPERTY', e)
        })
        .then(() => {
          this.$util.hideLoading()
        })
    }
  },
  mounted () {
    this.getAllProperties()
  }
}
</script>

<style lang="sass" scoped>

</style>
