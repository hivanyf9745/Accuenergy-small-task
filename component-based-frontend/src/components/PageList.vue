<template>
  <section>
    <div v-if="allLocations.length !== 0">
      <button @click="deleteSelectedPlaces">Delete Selected</button>

      <table>
        <tr v-for="place in paginatedPlaces" :key="place">
          <td>
            <input type="checkbox" v-model="place.selected" />
          </td>
          <td>{{ place.formatted_address }}</td>
        </tr>
      </table>

      <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      <p>Page {{ currentPage }} of {{ totalPages }}</p>
    </div>

    <div v-if="allLocations.length === 0" class="mt-3">
      <h3>You haven't searched for any places yet</h3>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    allLocations: {
      type: Array,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    },
    paginatedPlaces: {
      type: Array,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  }
}
</script>
