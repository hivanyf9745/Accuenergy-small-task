<template>
  <section>
    <div v-if="allLocations.length !== 0">
      <button @click="deletePlaces" class="btn btn-primary mt-5">Delete Selected</button>

      <div class="table-container text-center w-100 mt-2">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Checkbox</th>
              <th scope="col">Location Info</th>
            </tr>
          </thead>
          <tr v-for="place in paginatedPlaces" :key="place">
            <td>
              <input type="checkbox" @change="updateSelectedPlace" v-model="place.selected" />
            </td>
            <td>{{ place.formatted_address }}</td>
          </tr>
        </table>
      </div>

      <!-- Deal with the pagination -->
      <div class="pagination-container col-12 text-center">
        <nav class="d-inline-block">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="previousPage">Previous</a>
            </li>
            <li
              class="page-item"
              v-for="page in totalPages"
              :key="page"
              :class="{ active: currentPage === page }"
            >
              <a class="page-link" href="#" @click.prevent="updateSelectedPage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="nextPage">Next</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div v-if="allLocations.length === 0" class="mt-3 text-center bold">
      <p class="default-list text-secondary">You haven't searched for any places yet</p>
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
    },
    nextPage: {
      type: Function,
      required: true
    },
    previousPage: {
      type: Function,
      required: true
    }
  },

  data() {
    return {
      selectedPage: null
    }
  },

  emits: {
    'update-selected-places': function (updatedSelects) {
      if (updatedSelects) {
        return true
      } else {
        console.log('Parameter is missing!')
      }
    },

    'update-selected-page': function (updatePage) {
      if (updatePage) {
        return true
      } else {
        console.log('Parameter is missing')
      }
    },

    'delete-selected-places': function (dummy) {
      if (dummy) {
        return true
      } else {
        console.log('Parameter is missing!')
      }
    }
  },

  methods: {
    updateSelectedPlace() {
      this.paginatedPlaces.forEach((place) => {
        this.allLocations.forEach((location) => {
          if (place.place_id === location.place_id) {
            location.selected = place.selected
          }
        })
      })
      this.$emit('update-selected-places', this.allLocations)
    },

    updateSelectedPage(page) {
      this.$emit('update-selected-page', page)
    },

    deletePlaces() {
      this.$emit('delete-selected-places', 'dummy message')
    }
  }
}
</script>

<style>
.table-container {
  height: 300px;
}

.default-list {
  font-weight: 700;
}
</style>
