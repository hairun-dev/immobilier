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
    <q-btn class="q-ml-md" no-caps size="sm" @click="$util.openPick('filePhoto')">+ Ajouter photo</q-btn>
    <q-scroll-area style="height: 150px; max-width: 400px;">
      <div class="photos row no-wrap">
        <div class="photo" v-for="(it, idx) in photos" :key="idx">
          <div class="x" @click="removePhoto(idx)">x</div>
          <img :src="it.binary" alt="">
        </div>
      </div>
    </q-scroll-area>
    <q-separator />

    <q-card-actions align="right">
      <q-btn flat :label="$t('cancel')" color="primary" @click="$emit('close')" />
      <q-btn :label="$t('add')" color="primary" @click="onSave" />
    </q-card-actions>
    <q-file class="filePhoto" v-model="photo" label="Standard" style="display: none;" />
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
  setup () {
    const id = ref(null)
    const address = ref(null)
    const price = ref(null)
    const description = ref(null)
    const photo = ref(null)
    const photos = ref([])
    const updateValue = data => {
      id.value = data.id
      address.value = data.adresse
      price.value = data.prix
      description.value = data.description
    }
    const addPhoto = photo => {
      photos.value.push(photo)
    }
    const removePhoto = idx => {
      console.log('remove', idx)
      photos.value.splice(idx, 1)
    }

    return {
      id,
      address,
      price,
      description,
      updateValue,
      photos,
      addPhoto,
      photo,
      removePhoto
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
        if (!this.photos[0]) {
          this.$util.showError('Veuillez ajouter au moins un photo')
          return
        }
        // update
        if (this.data) {
          this.updateProperty()
        } else {
          this.addProperty()
        }
      }
    },
    getAddressData (addressData, placeResultData, id) {
      console.log('adr', addressData, placeResultData, id)
    },
    addProperty () {
      const payload = {
        address: this.address,
        price: parseInt(this.price),
        description: this.description,
        // images: this.photos.map(it => it.file),
        user_id: 1
      }
      for (let i = 0; i < this.photos.length; i++) {
        payload[`image[${i}]`] = this.photos[i].file
      }
      console.log('data', payload)
      this.$util.showLoading()
      this.$back.post('api/v1/property', payload)
        .then(res => {
          this.$emit('close')
          this.$emit('refresh')
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
          this.$emit('refresh')
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
  },
  watch: {
    async photo (val) {
      if (val) {
        const file = await this.$util.convertFile(val)
        this.addPhoto({
          binary: file,
          file: val
        })
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.newProperty
  min-width: 400px

  .photos
    height: 100px
    padding: 10px

    .photo
      width: 80px
      height: 100%
      border: 1px grey solid
      position: relative
      margin-right: 10px
      padding: 5px

      .x
        position: absolute
        top: 0
        right: 5px
        cursor: pointer

      img
        width: 100%
        height: 100%
</style>
