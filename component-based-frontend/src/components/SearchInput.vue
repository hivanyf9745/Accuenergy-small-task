<template>
  <!-- For Question 2 -->
  <section>
    <h2>Search input location</h2>
    <div class="d-flex justify-content-between align-items-center col-11 col-lg-6 mx-auto">
      <input
        ref="autocompleteInput"
        v-model="searchInput"
        type="text"
        placeholder="Search Location"
        @keydown.enter="searchLocation"
        class="form-control"
      />
      <button @click="searchLocation" class="btn btn-primary">Search</button>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      searchInput: '',
      autocomplete: null
    }
  },

  mounted() {
    this.initAutocomplete()
  },

  emits: {
    'place-selected': function (searchQuery) {
      if (searchQuery) {
        return true
      } else {
        console.log('Search query is missing!')
      }
    }
  },

  methods: {
    initAutocomplete() {
      this.autocomplete = new google.maps.places.Autocomplete(this.$refs.autocompleteInput)

      // Whenever the user selects a prediction from the autocomplete dropdown, update the location.
      // this.autocomplete.addListener('place_changed', this.updateLocation
      this.autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete.getPlace()

        if (place) {
          this.searchInput = place['formatted_address']
        }
      })
    },

    // Now we deal with the emits
    searchLocation() {
      google.maps.event.trigger(this.autocomplete, 'place_changed')
      if (this.searchInput && this.autocomplete) {
        this.$emit('place-selected', this.autocomplete)
        this.searchInput = ''
        this.autocomplete = new google.maps.places.Autocomplete(this.$refs.autocompleteInput)
      } else {
        alert('Please input valid search query')
      }
    }
  }
}
</script>
