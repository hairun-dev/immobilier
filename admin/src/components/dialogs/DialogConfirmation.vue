<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Confirmation</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      {{message}}
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="Annuler" color="primary" @click="$emit('close')" />
      <q-btn label="OK" color="primary" @click="$emit('ok')" />
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  props: ['message']
}
</script>

<style lang="sass" scoped>

</style>
