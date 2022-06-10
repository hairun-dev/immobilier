<template>
  <div>
    <q-table
      :title="$t('propertyList')"
      :rows="rows"
      :columns="columns"
      row-key="id"
    >
      <template v-slot:top="props">
        <div class="q-table__title">{{$t('propertyList')}}</div>
        <q-space />
        <q-btn size="sm" color="accent" dense @click="dialog.new_property = true" icon="add"  :label="$t('addProperty')" no-caps class="q-px-sm"/>
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
            {{ col.value }}
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <property-gallery-vue :data="props.row.galleries"></property-gallery-vue>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog v-model="dialog.new_property" persistent>
      <new-property-vue @close="dialog.new_property = false"></new-property-vue>
    </q-dialog>
  </div>
</template>

<script>
import NewPropertyVue from 'src/components/dialogs/NewProperty.vue'
import PropertyGalleryVue from '../components/PropertyGallery.vue'
export default {
  setup () {
    return {
      rows: [{
        id: 1,
        adresse: 'Ambalavao',
        prix: 500,
        description: 'Description bien immobilier Ambalavao',
        galleries: 5
      }, {
        id: 2,
        adresse: 'Fianarantsoa',
        prix: 15000,
        description: 'Description bien immobilier Fianarantsoa',
        galleries: 9
      }]
    }
  },
  components: {
    PropertyGalleryVue,
    NewPropertyVue
  },
  data () {
    return {
      dialog: {
        new_property: false
      }
    }
  },
  computed: {
    columns () {
      return [
        {
          name: 'id',
          required: true,
          label: 'Id',
          align: 'left',
          field: row => row.id,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: 'adresse',
          required: true,
          label: 'Adresse',
          align: 'left',
          field: row => row.adresse,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'prix', align: 'right', label: this.$t('price'), field: 'prix', format: val => `${val} €`, sortable: true },
        { name: 'description', align: 'left', label: 'Déscription', field: 'description', sortable: true }
      ]
    }
  },
  methods: {
  }
}
</script>

<style lang="sass" scoped>

</style>
