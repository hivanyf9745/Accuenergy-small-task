<template>
  <main>
    <button-location
      @get-location="getCurrentLocation"
      :location="currentLocation"
    ></button-location>
    <search-input @place-selected="updateLocation"></search-input>
    <!-- Google Maps Section -->
    <section class="mt-3">
      <div v-if="!map" class="d-flex align-items-center mt-2">
        <div class="spinner-border text-primary mx-3" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div>Loading Current Location...</div>
      </div>
      <div ref="mapContainer" style="height: 400px; width: 100%"></div>
    </section>
    <!--  -->
    <page-list
      :all-locations="allLocations"
      :paginated-places="paginatedPlaces"
      :current-page="currentPage"
      :total-pages="totalPages"
    ></page-list>
    <latest-time :local-time="localTime" :time-zone-id="timeZoneId"></latest-time>
  </main>
</template>

<script>
import ButtonLocation from './components/ButtonLocation.vue'
import SearchInput from './components/SearchInput.vue'
import PageList from './components/PageList.vue'
import LatestTime from './components/LatestTime.vue'

components: {
  ButtonLocation, SearchInput, PageList, LatestTime
}

export default {
  data() {
    return {
      currentLocation: null,
      map: null,
      markers: [],
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
        navigator.geolocation.getCurrentPosition((position) => {
          const defaultLocation = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          )

          this.map = new google.maps.Map(this.$refs.mapContainer, {
            center: defaultLocation,
            zoom: 12
          })
        })
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
        this.markers.push(marker)
        // Add the selected property to the place
        place.selected = false
        this.allLocations.push(place)
        this.fetchTimeZone(this.allLocations[this.allLocations.length - 1])
      } else {
        alert('The place has no location...?')
      }
    },

    getCurrentLocation() {
      this.currentLocation = ''
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const geocoder = new google.maps.Geocoder()
            const latLng = new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            )

            geocoder.geocode({ location: latLng }, (results, status) => {
              if (status === 'OK' && results[0]) {
                this.currentLocation = results[0].formatted_address
              } else {
                console.error('Geocoder failed due to: ' + status)
              }
            })
          },
          (error) => {
            console.error('Error getting current location: ' + error.message)
          }
        )
      }
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
