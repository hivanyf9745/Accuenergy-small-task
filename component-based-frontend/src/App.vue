<template>
  <main>
    <small-assessment></small-assessment>
    <div class="col-12 col-lg-8 mx-auto">
      <button-location
        @get-location="getCurrentLocation"
        :location="currentLocation"
      ></button-location>

      <hr class="my-5" />

      <div class="search-container text-center mt-5">
        <search-input @place-selected="updateLocation"></search-input>
        <latest-time :local-time="localTime" :time-zone-id="timeZoneId"></latest-time>
        <!-- Google Maps Section -->
        <section class="mt-3">
          <div v-if="!map" class="d-flex align-items-center mt-2">
            <div class="spinner-border text-primary mx-3" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <div>Loading Current Location...</div>
          </div>
          <div v-else-if="map === 'denied'">User denied Geolocation access</div>
          <div ref="mapContainer" class="w-100 map-container"></div>
        </section>
        <!--  -->
      </div>

      <page-list
        :all-locations="allLocations"
        :paginated-places="paginatedPlaces"
        :current-page="currentPage"
        :total-pages="totalPages"
        :next-page="nextPage"
        :previous-page="previousPage"
        @delete-selected-places="deleteSelectedPlaces"
        @update-selected-places="updateSelectedPlaces"
        @update-selected-page="toCurrentPage"
      ></page-list>
    </div>
  </main>
</template>

<script>
import ButtonLocation from './components/ButtonLocation.vue'
import SearchInput from './components/SearchInput.vue'
import PageList from './components/PageList.vue'
import LatestTime from './components/LatestTime.vue'
import SmallAssessment from './components/SmallAssessment.vue'
import { toRaw } from 'vue'

components: {
  ButtonLocation, SearchInput, PageList, LatestTime, SmallAssessment
}

export default {
  data() {
    return {
      currentLocation: null,
      map: null,
      allLocations: [],
      currentPage: 1,
      itemsPerPage: 10,
      localTime: null,
      timeZoneId: ''
    }
  },

  computed: {
    paginatedPlaces() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.allLocations.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.allLocations.length / this.itemsPerPage)
    }
  },

  mounted() {
    this.initMap()
  },

  methods: {
    initMap() {
      // Set a default location (here, I am pointing at your current location)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const defaultLocation = new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            )

            this.map = new google.maps.Map(this.$refs.mapContainer, {
              center: defaultLocation,
              zoom: 10
            })
          },
          (error) => {
            alert('Error: ' + error.message)
            this.map = 'denied'
          }
        )
      } else {
        alert('Geolocation is not supported by this browser.')
      }
    },

    updateLocation(autocomplete) {
      const place = autocomplete.getPlace()

      if (place.geometry) {
        this.map.setCenter(place.geometry.location)
        // Create a marker for the place
        const marker = new google.maps.Marker({
          map: this.map,
          position: place.geometry.location
        })
        place.marker = marker
        // Add the selected property to the place
        place.selected = false
        this.allLocations.push(place)
        this.fetchTimeZone(this.allLocations[this.allLocations.length - 1])
      } else {
        alert('The place has no location...?')
      }
    },

    getCurrentLocation() {
      if (navigator.geolocation) {
        this.currentLocation = ''
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.reverseGeocode(position.coords.latitude, position.coords.longitude)
          },
          (error) => {
            this.currentLocation = null
            alert('Error: ' + error.message)
          }
        )
      } else {
        alert('Geolocation is not supported by this browser.')
      }
    },

    reverseGeocode(lat, lng) {
      const geocoder = new google.maps.Geocoder()

      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          this.currentLocation = results[0].formatted_address
        } else {
          this.currentLocation = 'Unable to retrieve your location'
        }
      })
    },

    updateSelectedPlaces(updateSelects) {
      this.allLocations = updateSelects
    },

    deleteSelectedPlaces(dummy) {
      console.log(dummy)
      this.allLocations = this.allLocations.filter((place, index) => {
        if (place.selected) {
          // Remove the marker from the map
          this.allLocations[index].marker = toRaw(place.marker).setMap(null)
          return false
        } else {
          return true
        }
      })
    },

    // flip the pages
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },

    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },

    toCurrentPage(updatePage) {
      this.currentPage = updatePage
    },

    fetchTimeZone(place) {
      const latlng = `${place.geometry.location.lat()},${place.geometry.location.lng()}`
      const timestamp = Math.floor(Date.now() / 1000)

      fetch(
        `https://maps.googleapis.com/maps/api/timezone/json?location=${latlng}&timestamp=${timestamp}&key=AIzaSyDv9u1tew7O6EFzcDBQ2zbPvb8iHdQySYU`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'OK') {
            this.updateLocalTime(data)
          } else {
            console.error('Failed to fetch time zone:', data.status)
          }
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    },

    updateLocalTime(timezoneData) {
      const now = new Date() // Get the current date and time
      const localTime = new Date(
        now.getTime() +
          now.getTimezoneOffset() * 60000 +
          timezoneData.dstOffset * 1000 +
          timezoneData.rawOffset * 1000
      )
      this.localTime = localTime
      this.timeZoneId = timezoneData.timeZoneId
    }
  }
}
</script>

<style>
.map-container {
  height: 25rem;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
</style>
