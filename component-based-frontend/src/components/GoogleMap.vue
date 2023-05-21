<template>
  <section class="mt-3">
    <div v-if="!map" class="d-flex align-items-center mt-2">
      <div class="spinner-border text-primary mx-3" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div>Loading Current Location...</div>
    </div>
    <div ref="mapContainer" style="height: 400px; width: 100%"></div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      map: null
    }
  },

  props: {
    searchedLocation: {
      type: String,
      required: true
    }
  },

  methods: {
    // initMap() {
    //   if (this.searchedLocation) {
    //     this.map = new google.maps.Map(this.$refs.mapContainer, {
    //       center: this.searchedLocation,
    //       zoom: 12
    //     })
    //   }
    // }
  }
}
</script>
