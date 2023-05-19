const app = Vue.createApp({
  data() {
    return {
      currentLocation: null,
      searchInput: "",
      map: null,
      markers: [],
      autocomplete: null,
      allLocations: [],
      currentPage: 1,
      itemsPerPage: 10,
      localTime: null,
      timeZone: "",
    };
  },

  computed: {
    paginatedPlaces() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.allLocations.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.allLocations.length / this.itemsPerPage);
    },
  },

  mounted() {
    this.initMap();
    this.initAutocomplete();
  },

  methods: {
    getCurrentLocation() {
      this.currentLocation = "";
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const geocoder = new google.maps.Geocoder();
            const latLng = new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            );

            geocoder.geocode({ location: latLng }, (results, status) => {
              if (status === "OK" && results[0]) {
                this.currentLocation = results[0].formatted_address;
              } else {
                console.error("Geocoder failed due to: " + status);
              }
            });
          },
          error => {
            console.error("Error getting current location: " + error.message);
          }
        );
      }
    },

    initMap() {
      // Set a default location (here, I'm using San Francisco)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const defaultLocation = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );

          this.map = new google.maps.Map(this.$refs.mapContainer, {
            center: defaultLocation,
            zoom: 12,
          });
        });
      }
    },

    initAutocomplete() {
      this.autocomplete = new google.maps.places.Autocomplete(
        this.$refs.autocompleteInput
      );

      // Whenever the user selects a prediction from the autocomplete dropdown, update the location.
      this.autocomplete.addListener("place_changed", this.updateLocation);
    },

    updateLocation() {
      const place = this.autocomplete.getPlace();

      if (place.geometry) {
        this.map.setCenter(place.geometry.location);
        // Create a marker for the place
        const marker = new google.maps.Marker({
          map: this.map,
          position: place.geometry.location,
        });
        this.markers.push(marker);
        // Add the selected property to the place
        place.selected = false;
        this.allLocations.push(place);
        this.searchInput = place.name; // Update search input with selected place
        this.fetchTimeZone(this.allLocations[this.allLocations.length - 1]);
      } else {
        alert("The place has no location...?");
      }
    },

    searchLocation() {
      google.maps.event.trigger(this.autocomplete, "place_changed");
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },

    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },

    deleteSelectedPlaces() {
      // Remove the selected places from the places array
      this.allLocations = this.allLocations.filter((place, index) => {
        if (place.selected) {
          // Remove the marker from the map
          this.markers[index].setMap(null);
          return false;
        } else {
          return true;
        }
      });
      // Remove the markers from the markers array
      this.markers = this.markers.filter(
        (marker, index) => !this.allLocations[index].selected
      );
    },

    fetchTimeZone(place) {
      const latlng = `${place.geometry.location.lat()},${place.geometry.location.lng()}`;
      const timestamp = Math.floor(Date.now() / 1000);

      console.log(latlng);
      console.log(timestamp);

      fetch(
        `https://maps.googleapis.com/maps/api/timezone/json?location=${latlng}&timestamp=${timestamp}&key=AIzaSyDv9u1tew7O6EFzcDBQ2zbPvb8iHdQySYU`
      )
        .then(response => response.json())
        .then(data => {
          if (data.status === "OK") {
            this.updateLocalTime(data);
          } else {
            console.error("Failed to fetch time zone:", data.status);
          }
        })
        .catch(error => {
          console.error("Error:", error);
        });
    },

    updateLocalTime(timezoneData) {
      const now = new Date(); // Get the current date and time
      const localTime = new Date(
        now.getTime() +
          now.getTimezoneOffset() * 60000 +
          timezoneData.dstOffset * 1000 +
          timezoneData.rawOffset * 1000
      );
      this.localTime = localTime;
      this.timeZoneId = timezoneData.timeZoneId;
    },
  },
});

app.mount("#app");
