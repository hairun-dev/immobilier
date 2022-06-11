<template>
  <q-card class="newProperty">
    <q-card-section>
      <div class="text-h6">{{$t('newProperty')}}</div>
    </q-card-section>

    <q-separator />

    <q-card-section style="max-height: 50vh" class="scroll">
      <q-form
        @submit="onAdd"
        class="q-gutter-md"
        ref="myForm"
      >
        <q-input
          v-model="address"
          label="Address *"
          lazy-rules
          dense
          outlined
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />

        <vue-google-autocomplete hidden id="map" classname="form-control" placeholder="Start typing" v-on:placechanged="getAddressData"></vue-google-autocomplete>

        <q-input
          v-model="price"
          type="number"
          label="Price *"
          lazy-rules
          dense
          outlined
          :rules="[
            val => val !== null && val !== '' || 'Please type the price',
            val => val > 0 || 'Please type a real price'
          ]"
        />

        <q-input
          v-model="description"
          label="Description *"
          lazy-rules
          dense
          outlined
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />
      </q-form>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right">
      <q-btn flat :label="$t('cancel')" color="primary" @click="$emit('close')" />
      <q-btn flat :label="$t('add')" color="primary" @click="onAdd" />
    </q-card-actions>
  </q-card>
</template>

<script>
import { ref } from 'vue'
import VueGoogleAutocomplete from 'vue-google-autocomplete'
export default {
  components: {
    VueGoogleAutocomplete
  },
  setup () {
    const address = ref(null)
    const price = ref(null)
    const description = ref(null)

    return {
      address,
      price,
      description
    }
  },
  data () {
    return {
    }
  },
  methods: {
    async onAdd () {
      const isValid = await this.$refs.myForm.validate()
      if (isValid) {
        console.log('valid')
      }
    },
    getAddressData (addressData, placeResultData, id) {
      console.log('adr', addressData, placeResultData, id)
    }
  },
  computed: {
    // thousandMilier () {

    // }
  }
}
</script>

<style lang="sass" scoped>
.newProperty
  min-width: 400px
</style>
