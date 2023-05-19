const app = Vue.createApp({
  data() {
    return {
      currentLocation: null,
      map: null,
      marker: null,
      autocomplete: null,
      place: null,
    };
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
      // Set a default location
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

          this.marker = new google.maps.Marker({
            map: this.map,
            position: defaultLocation,
          });
        });
      }
    },

    initAutocomplete() {
      this.autocomplete = new google.maps.places.Autocomplete(
        this.$refs.searchInput
      );

      // Whenever the user selects a prediction from the autocomplete dropdown, update the location.
      this.autocomplete.addListener("place_changed", this.updateLocation);
    },

    updateLocation() {
      this.place = this.autocomplete.getPlace();

      if (this.place.geometry) {
        this.map.setCenter(this.place.geometry.location);
        this.marker.setPosition(this.place.geometry.location);
      } else {
        alert("Please click on the google autocomplete to input results");
      }
    },

    searchLocation() {
      google.maps.event.trigger(this.autocomplete, "place_changed");
    },
  },
});

app.mount("#app");
