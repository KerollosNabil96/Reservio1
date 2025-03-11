<template>
  <div
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50"
  >
    <div
      class="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 border border-gray-100 dark:border-gray-700"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
          Select Your Location
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Map Container -->
      <div id="map" style="width: 100%; height: 300px;"></div>

      <!-- Location Buttons -->
      <div class="mt-4 space-y-2">
        <button
          type="button"
          @click="getUserLocation"
          class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
        >
          <i class="fas fa-location-arrow"></i> Use My Location
        </button>
        <button
          type="button" 
          @click="confirmSelectedLocation"
          class="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
          :disabled="!selectedLocation"
        >
          <i class="fas fa-check"></i> Confirm Selected Location
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  name: "MapPopup",
  data() {
    return {
      map: null,
      marker: null,
      userLocation: null,
      selectedLocation: null, // Store the selected location
    };
  },
  mounted() {
    this.initializeMap();
  },
  methods: {
    // Initialize the Leaflet map
    initializeMap() {
      this.map = L.map("map").setView([30.0444, 31.2357], 13); // Default center (e.g., Cairo)

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);

      // Add a marker (initially hidden)
      this.marker = L.marker([0, 0], { opacity: 0 }).addTo(this.map);

      // Add click event listener to the map
      this.map.on("click", this.handleMapClick);
    },
    // Handle map click event
    handleMapClick(e) {
      const { lat, lng } = e.latlng;

      // Update the marker position
      this.marker.setLatLng([lat, lng]).setOpacity(1);

      // Store the selected location
      this.selectedLocation = { lat, lng };
    },
    // Get the user's current location
    getUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            // Update the map and marker
            this.map.setView([lat, lng], 13);
            this.marker.setLatLng([lat, lng]).setOpacity(1);

            // Store the user's location
            this.userLocation = { lat, lng };

            // Get the address using Nominatim
            this.reverseGeocode(lat, lng);
          },
          (error) => {
            console.error("Error getting user location:", error); // Debugging
            alert("Unable to retrieve your location.");
          }
        );
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    },
    // Reverse geocode to get the address
    async reverseGeocode(lat, lng) {
  try {
    // Call the Nominatim API with English language preference
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          "User-Agent": "YourAppName/1.0 (your-email@example.com)", // Required by Nominatim
          "Accept-Language": "en", // Request the response in English
        },
      }
    );
    const data = await response.json();

    console.log("Nominatim API Response:", data); // Debugging

    if (data.display_name) {
      // Emit the location data to the parent component
      this.$emit("location-selected", {
        address: data.display_name,
        city: data.address.city || data.address.town,
        area: data.address.suburb || data.address.neighbourhood,
      });

      // Close the popup
      this.$emit("close");
    } else {
      alert("Address not found.");
    }
  } catch (error) {
    console.error("Error reverse geocoding:", error); // Debugging
    alert("Error fetching address.");
  }
},
    // Confirm the selected location
    confirmSelectedLocation() {
      if (this.selectedLocation) {
        const { lat, lng } = this.selectedLocation;
        this.reverseGeocode(lat, lng);
      } else {
        alert("Please select a location on the map.");
      }
    },
  },
};
</script>

<style scoped>
/* Ensure the map container has a defined size */
#map {
  width: 100%;
  height: 300px;
}
</style>