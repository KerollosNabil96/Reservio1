<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900"
  >
    <div
      class="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center"
    >
      <div
        class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <svg
          class="w-8 h-8 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Payment Successful!
      </h2>

      <div
        v-if="bookingInfo"
        class="mb-6 text-left bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
      >
        <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">
          Booking Details
        </h3>
        <p class="text-gray-600 dark:text-gray-300">
          <span class="font-semibold">Venue:</span>
          {{ bookingInfo.venue?.venueName }}
        </p>
        <p class="text-gray-600 dark:text-gray-300">
          <span class="font-semibold">Date:</span>
          {{ formatDate(bookingInfo.date) }}
        </p>
        <p class="text-gray-600 dark:text-gray-300">
          <span class="font-semibold">Time Slot:</span>
          {{ getTimeSlotDetails() }}
        </p>
        <p class="text-gray-600 dark:text-gray-300">
          <span class="font-semibold">Status: </span>
          <span class="text-green-500 font-semibold">Confirmed</span>
        </p>
        <p class="text-gray-600 dark:text-gray-300 text-sm mt-2">
          Your booking ID: {{ bookingInfo.id }}
        </p>
      </div>

      <p class="text-gray-600 dark:text-gray-300 mb-6">
        You have received
        <span class="text-green-500 font-bold"
          >{{ bookingInfo.price * 0.05 }} EGP
        </span>
        cash back in your wallet. Thank you for booking with Reservio!
      </p>
      <button
        @click="goHome"
        class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Return to Home
      </button>
    </div>
  </div>
</template>

<script>
import { db, ref, set, onValue } from "@/firebase";
import store from "@/store/store";

export default {
  name: "BookingSuccess",
  data() {
    return {
      bookingInfo: null,
      savedBookingId: null,
    };
  },
  created() {
    // First try to get booking info from localStorage
    try {
      const storedBooking = localStorage.getItem("pendingBooking");
      if (storedBooking) {
        this.bookingInfo = JSON.parse(storedBooking);

        // Generate a booking ID if one doesn't exist
        if (!this.bookingInfo.id) {
          this.bookingInfo.id = "id" + Math.random().toString(16).slice(2);
        }

        // Also update the Vuex state for consistency
        store.state.currentBookingInfo = this.bookingInfo;

        // Save booking to database
        this.saveBookingToDatabase();

        // Clear the localStorage after successful processing
        localStorage.removeItem("pendingBooking");
      } else if (store.state.currentBookingInfo) {
        // Fallback to Vuex state if available
        this.bookingInfo = store.state.currentBookingInfo;
        if (!this.bookingInfo.id) {
          this.bookingInfo.id = "id" + Math.random().toString(16).slice(2);
        }
        this.saveBookingToDatabase();
      } else {
        console.log("No booking information available");
      }
    } catch (error) {
      console.error("Error processing booking:", error);
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    getTimeSlotDetails() {
      if (
        !this.bookingInfo ||
        !this.bookingInfo.venue ||
        !this.bookingInfo.timeSlotId
      ) {
        console.warn(
          "Missing booking info for time slot display",
          this.bookingInfo
        );
        return "N/A";
      }

      // Find the time slot in the venue's time slots
      const venue = this.bookingInfo.venue;
      if (!venue.timeSlots) {
        console.warn("Venue has no time slots:", venue);
        return "N/A";
      }

      console.log("Looking for time slot ID:", this.bookingInfo.timeSlotId);
      console.log("Available time slots:", venue.timeSlots);

      const timeSlot = venue.timeSlots.find(
        (slot) => slot.id == this.bookingInfo.timeSlotId // Use loose equality to handle string/number variations
      );

      if (!timeSlot) {
        console.warn(
          `Time slot with ID ${this.bookingInfo.timeSlotId} not found`
        );
        return "N/A";
      }

      return `${timeSlot.from} - ${timeSlot.to}`;
    },
    saveBookingToDatabase() {
      try {
        if (!this.bookingInfo) return;

        // Add payment status
        this.bookingInfo.status = "paid";
        this.bookingInfo.paymentDate = new Date().toISOString();

        // Log the booking info for debugging
        console.log(
          "Saving booking to database:",
          JSON.stringify(this.bookingInfo)
        );

        // 1. Save to general bookings collection
        const bookingsRef = ref(db, `bookings/${this.bookingInfo.id}`);
        set(bookingsRef, this.bookingInfo);

        // 2. Save to the user's bookings list
        if (this.bookingInfo.userId) {
          const userBookingsRef = ref(
            db,
            `users/${this.bookingInfo.userId}/bookings`
          );
          // Check if user already has bookings
          onValue(
            userBookingsRef,
            (snapshot) => {
              let userBookings = snapshot.val() || {};

              // Add this booking to the user's bookings
              userBookings[this.bookingInfo.id] = this.bookingInfo;

              // Update the user's bookings
              set(userBookingsRef, userBookings);

              // Store the saved booking ID for reference
              this.savedBookingId = this.bookingInfo.id;
            },
            { onlyOnce: true }
          );
          const userBalanceRef = ref(
            db,
            `users/${this.bookingInfo.userId}/balance`
          );
          onValue(
            userBalanceRef,
            (snapshot) => {
              const userBalance = snapshot.val();
              set(userBalanceRef, userBalance + this.bookingInfo.price * 0.05);
            },
            { onlyOnce: true }
          );
        } else if (store.state.user && store.state.user.id) {
          // If userId wasn't in the booking but we have a logged-in user
          const userBookingsRef = ref(
            db,
            `users/${store.state.user.id}/bookings`
          );
          // Check if user already has bookings
          onValue(
            userBookingsRef,
            (snapshot) => {
              let userBookings = snapshot.val() || {};

              // Add this booking to the user's bookings
              userBookings[this.bookingInfo.id] = this.bookingInfo;

              // Update the user's bookings
              set(userBookingsRef, userBookings);

              // Store the saved booking ID for reference
              this.savedBookingId = this.bookingInfo.id;
            },
            { onlyOnce: true }
          );
        }

        // Update venue availability
        this.updateVenueAvailability();
      } catch (error) {
        console.error("Error saving booking:", error);
      }
    },
    updateVenueAvailability() {
      try {
        if (
          !this.bookingInfo ||
          !this.bookingInfo.venue ||
          !this.bookingInfo.timeSlotId
        ) {
          console.warn(
            "Cannot update venue availability: Missing booking information"
          );
          return;
        }

        console.log(
          "Venue ID for availability update:",
          this.bookingInfo.venue.id
        );
        console.log("Time slot ID for update:", this.bookingInfo.timeSlotId);

        // Get venue reference - try to directly get the venueId
        const venueRef = ref(db, `venues/${this.bookingInfo.venue.id}`);

        // Log the complete path
        console.log(
          `Updating venue at path: venues/${this.bookingInfo.venue.id}`
        );

        // Get current venue data
        onValue(
          venueRef,
          (snapshot) => {
            const venueData = snapshot.val();

            // Log what we got from Firebase
            console.log(
              "Venue data retrieved:",
              venueData ? "Found" : "Not found"
            );

            if (!venueData) {
              console.warn("Cannot update venue: Venue not found in database");
              return;
            }

            if (!venueData.timeSlots) {
              console.warn(
                "Cannot update venue availability: No time slots in venue data"
              );
              return;
            }

            console.log("All time slots:", JSON.stringify(venueData.timeSlots));

            // Find the time slot index - use loose equality (==) to handle string/number differences
            const timeSlotIndex = venueData.timeSlots.findIndex(
              (slot) => slot.id == this.bookingInfo.timeSlotId
            );

            if (timeSlotIndex === -1) {
              console.warn(
                `Cannot update venue availability: Time slot with ID ${this.bookingInfo.timeSlotId} not found`
              );
              return;
            }

            // Get the current time slot
            const currentTimeSlot = venueData.timeSlots[timeSlotIndex];

            // Log the current availability
            console.log(
              `Updating time slot ${currentTimeSlot.from}-${currentTimeSlot.to}: Current availability = ${currentTimeSlot.available}`
            );

            // Create new time slots array with updated availability
            const updatedTimeSlots = [...venueData.timeSlots];
            updatedTimeSlots[timeSlotIndex] = {
              ...currentTimeSlot,
              available: Math.max(0, parseInt(currentTimeSlot.available) - 1), // Ensure it's a number and decrease by 1, minimum 0
            };

            // Log the new availability
            console.log(
              `New availability = ${updatedTimeSlots[timeSlotIndex].available}`
            );

            // Update the time slots in Firebase - full path to ensure accuracy
            const timeSlotPath = `venues/${this.bookingInfo.venue.id}/timeSlots`;
            console.log(`Updating at path: ${timeSlotPath}`);

            set(ref(db, timeSlotPath), updatedTimeSlots)
              .then(() => {
                console.log("Venue availability updated successfully");
              })
              .catch((error) => {
                console.error("Error updating venue availability:", error);
              });
          },
          { onlyOnce: true }
        );
      } catch (error) {
        console.error("Error in updateVenueAvailability:", error);
      }
    },
    goHome() {
      // Clear any remaining booking data from localStorage
      localStorage.removeItem("pendingBooking");

      // Navigate to home
      this.$router.push("/");
    },
  },
};
</script>
