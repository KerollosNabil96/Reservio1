<template>
  <div class="booking-info-wrapper">
    <div class="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8 dark:bg-gray-900">
      <div class="flex items-center justify-center mb-6 text-gray-900">
        <div class="w-8 h-8 bg-green-500 flex items-center justify-center rounded-full">
          ✔
        </div>
        <div class="w-16 h-1 bg-gray-300 mx-2"></div>
        <div class="w-8 h-8 bg-gray-300 flex items-center justify-center rounded-full">
          2
        </div>
        <div class="w-16 h-1 bg-gray-300 mx-2"></div>
        <div class="w-8 h-8 bg-gray-300 flex items-center justify-center rounded-full">
          3
        </div>
      </div>
      <h2 class="text-2xl font-bold text-center text-blue-900 dark:text-blue-400">
        {{ $t('bookingInfo.title') }}
      </h2>
      <p class="text-center text-gray-500 mb-6 dark:text-gray-200">
        {{ $t('bookingInfo.subtitle') }}
      </p>

      <div class="flex gap-6">
        <img :src="venue.pictures[0]" alt="Stadium" class="w-1/2 rounded-lg shadow-md" />
        <div class="w-1/2">
          <h3 class="font-bold text-lg dark:text-white">{{ venue.name }}</h3>
          <p class="text-gray-500 dark:text-gray-200">
            {{ venue.address.city }}, {{ venue.address.governorate }}
          </p>
          <div class="mt-4">
            <label class="block text-gray-700 font-medium dark:text-gray-200">
              {{ $t('bookingInfo.dateLabel') }}
            </label>
            <div class="flex items-center border p-2 rounded-lg shadow-sm mt-1 dark:bg-gray-800 dark:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="ml-2 w-full dark:text-gray-200">{{
                formatDate(venue.selectedDate)
              }}</span>
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-gray-700 font-medium dark:text-gray-200">
              {{ $t('bookingInfo.timeSlotLabel') }}
            </label>
            <select v-model="selectedTime"
              class="w-full border p-2 rounded-lg shadow-sm mt-1 dark:bg-gray-800 dark:text-gray-200">
              <option value="" disabled>{{ $t('bookingInfo.selectTimeSlot') }}</option>
              <option v-for="(slot, index) in availableTimeSlots" :key="index" :value="`${slot.id}`">
                {{ slot.from }} - {{ slot.to }} ({{ slot.available }} {{ $t('bookingInfo.spotsAvailable') }})
              </option>
            </select>
          </div>

          <!-- تمت إضافة سعر الحجز هنا ✅ -->
          <p class="mt-4 text-gray-700 dark:text-gray-200">
            You will pay {{ venue.price }} EGP per 1 {{ venue.category === "Stadium" ? "hour" : "session" }}
          </p>
        </div>
      </div>

      <div class="mt-6 flex justify-center gap-4">
        <BaseButton @click="openPaymentPopup" :loading="isSubmitting" :disabled="!selectedTime" variant="primary"
          size="lg" class="w-full cursor-pointer">
          {{ $t('bookingInfo.bookNow') }}
        </BaseButton>
        <BaseButton @click="cancelBooking" variant="light" size="lg" class="cursor-pointer">
          {{ $t('bookingInfo.cancel') }}
        </BaseButton>
      </div>
    </div>

    <!-- Payment Popup with dark overlay -->
    <div v-if="showPaymentPopup" class="fixed inset-0 flex items-center justify-center">
      <div @click.self="closePopUp" class="absolute inset-0 bg-black opacity-70 z-20"></div>
      <div class="bg-white p-6 rounded-lg w-96 relative z-30">
        <button @click="closePaymentPopup"
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-900 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="cursor-pointer h-6 w-6" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 class="text-lg font-bold text-center mb-4">
          {{ $t('bookingInfo.paymentMethod') }}
        </h3>
        <div class="flex flex-col gap-4">
          <BaseButton class="cursor-pointer" @click="payWithCreditCard" variant="primary" size="lg">
            <div v-if="isSubmitting" class="flex items-center justify-center space-x-2">
              <div class="w-6 h-6 border-4 border-t-4 border-gray-200 border-t-blue-600 rounded-full animate-spin">
              </div>
              <span>{{ $t('bookingInfo.processing') }}</span>
            </div>
            <div v-else>{{ $t('bookingInfo.creditCard') }}</div>
          </BaseButton>
          <BaseButton class="cursor-pointer" @click="payWithWallet" variant="secondary" size="lg">
            {{ $t('bookingInfo.wallet') }}
          </BaseButton>
          <BaseButton class="cursor-pointer" @click="closePaymentPopup" variant="light" size="lg">
            {{ $t('bookingInfo.cancel') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store/store";
import BaseButton from "@/components/common/BaseButton.vue";

export default {
  components: {
    BaseButton,
  },
  data() {
    return {
      selectedTime: "",
      isSubmitting: false,
      showPaymentPopup: false,
    };
  },
  computed: {
    venue() {
      return this.$store.getters.getSelectedVenue;
    },
    availableTimeSlots() {
      // Filter time slots where `exist` is true and `available` is greater than 0
      return Object.values(this.venue.timeSlots).filter(
        (slot) => slot.exist === true && slot.available > 0
      );
    },
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    openPaymentPopup() {
      this.showPaymentPopup = true;
    },
    closePaymentPopup() {
      this.showPaymentPopup = false;
    },
    async payWithCreditCard() {
      try {
        this.isSubmitting = true;
        store.dispatch("setLoadingState", true);

        const bookingInfo = {
          username: store.state.user.username,
          userId: store.state.user.id,
          venue: this.venue,
          date: this.venue.selectedDate,
          price: this.venue.price,
          method: "credit card",
          timeSlotId: this.selectedTime,
          bookingDate: new Date().toISOString(),
        };

        store.state.currentBookingInfo = bookingInfo;
        localStorage.setItem("pendingBooking", JSON.stringify(bookingInfo));

        const response = await fetch(
          "http://localhost:3000/create-checkout-session-book",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              venue: this.venue,
              timeSlotId: this.selectedTime,
            }),
          }
        );

        const { url } = await response.json();
        window.location.href = url;
      } catch (error) {
        console.error("Error creating checkout session:", error);
      } finally {
        this.isSubmitting = false;
        store.dispatch("setLoadingState", false);
      }
    },
    payWithWallet() {
      const bookingInfo = {
        username: store.state.user.username,
        userId: store.state.user.id,
        venue: this.venue,
        date: this.venue.selectedDate,
        price: this.venue.price,
        method: "wallet",
        timeSlotId: this.selectedTime,
        bookingDate: new Date().toISOString(),
      };
      store.state.currentBookingInfo = bookingInfo;
      this.proceedToPayment(this.selectedTime);
    },
    cancelBooking() {
      this.$router.back();
    },
    closePopUp() {
      this.showPaymentPopup = false;
    },
    proceedToPayment(selectedTimeSlotId) {
      this.$store.commit("setSelectedTimeSlotId", selectedTimeSlotId); // Update the store
      this.$router.push({
        path: "/booking-info-payment",
        query: { timeSlotId: selectedTimeSlotId }, // Pass the selected time slot ID as a query parameter
      });
    },
  },
};
</script>
