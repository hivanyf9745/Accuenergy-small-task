<template>
  <section>
    <div class="button-search-container text-center p-5">
      <div>
        <h2>Find Your Current Location</h2>
        <button class="btn btn-primary" @click="$emit('get-location')">
          Get your current location
        </button>
        <p v-if="location === null" class="mt-2">
          ⬆️Please click on the button above to get your current location info📍
        </p>
        <div v-else-if="location === ''">
          <div class="spinner-border text-primary ms-3 mt-2" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <p v-else class="mt-2">
          <strong>Your current location is:</strong>
          {{ this.location }}
        </p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    location: {
      type: String,
      required: true
    }
  }
}
</script>
