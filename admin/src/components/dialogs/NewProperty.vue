<template>
  <q-card class="newProperty">
    <q-card-section>
      <div class="text-h6">{{$t('newProperty')}}</div>
    </q-card-section>

    <q-separator />

    <q-card-section style="max-height: 50vh" class="scroll">
      <q-form
        @submit="onSave"
        class="q-gutter-md"
        ref="myForm"
      >
        <q-input
          v-model="address"
          label="Address *"
          lazy-rules
          outlined
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />

        <!-- <vue-google-autocomplete hidden id="map" classname="form-control" placeholder="Start typing" v-on:placechanged="getAddressData"></vue-google-autocomplete> -->

        <q-input
          v-model="price"
          type="number"
          label="Price *"
          lazy-rules
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
          outlined
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />
      </q-form>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right">
      <q-btn flat :label="$t('cancel')" color="primary" @click="$emit('close')" />
      <q-btn :label="$t('add')" color="primary" @click="onSave" />
    </q-card-actions>
  </q-card>
</template>

<script>
import { ref } from 'vue'
// import VueGoogleAutocomplete from 'vue-google-autocomplete'
export default {
  components: {
    // VueGoogleAutocomplete
  },
  props: ['data'],
  setup (props) {
    const id = ref(null)
    const address = ref(null)
    const price = ref(null)
    const description = ref(null)
    const updateValue = data => {
      id.value = data.id
      address.value = data.adresse
      price.value = data.prix
      description.value = data.description
    }

    return {
      id,
      address,
      price,
      description,
      updateValue
    }
  },
  data () {
    return {
    }
  },
  methods: {
    async onSave () {
      const isValid = await this.$refs.myForm.validate()
      if (isValid) {
        console.log('valid')
        // update
        if (this.data) {
          this.addProperty()
        } else {
          this.updateProperty()
        }
      }
    },
    getAddressData (addressData, placeResultData, id) {
      console.log('adr', addressData, placeResultData, id)
    },
    addProperty () {
      const payload = {
        adresse: this.address,
        prix: this.price,
        description: this.description
      }
      this.$util.showLoading()
      this.$back.post('api/v1/property', payload)
        .then(res => {
          console.log('res', res)
        })
        .catch(e => {
          console.log('ERROR ON ADD PROPERTY', e)
        })
        .then(() => {
          this.$util.hideLoading()
        })
    },
    updateProperty () {
      const payload = {
        adresse: this.address,
        prix: this.price,
        description: this.description
      }
      this.$util.showLoading()
      this.$back.post(`api/v1/user/update/${this.id}`, payload)
        .then(res => {
          console.log('res', res)
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
  computed: {
  }
}
</script>

<style lang="sass" scoped>
.newProperty
  min-width: 400px
</style>
