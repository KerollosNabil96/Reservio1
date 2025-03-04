<template>
    <div class="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8 dark:bg-gray-900">
      <div class="flex items-center justify-center mb-6">
        <div class="w-8 h-8 bg-green-500 text-white flex items-center justify-center rounded-full">✔</div>
        <div class="w-16 h-1 bg-gray-300 mx-2"></div>
        <div class="w-8 h-8 bg-gray-300 text-white flex items-center justify-center rounded-full">2</div>
        <div class="w-16 h-1 bg-gray-300 mx-2"></div>
        <div class="w-8 h-8 bg-gray-300 text-white flex items-center justify-center rounded-full">3</div>
      </div>
      <h2 class="text-2xl font-bold text-center text-blue-900">Booking Information</h2>
      <p class="text-center text-gray-500 mb-6 dark:text-gray-200">Please fill up the blank fields below</p>
      
      <div class="flex gap-6">
        <img :src="venue.pictures[0]" alt="Stadium" class="w-1/2 rounded-lg shadow-md" />
        <div class="w-1/2">
          <h3 class="font-bold text-lg dark:text-white">{{ venue.name }}</h3>
          <p class="text-gray-500 dark:text-gray-200">{{venue.address.city}},{{ venue.address.governorate }}</p>
          <div class="mt-4">
            <label class="block text-gray-700 font-medium dark:text-gray-200">Pick a Date</label>
            <div class="flex items-center border p-2 rounded-lg shadow-sm mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input type="date" v-model="selectedDate" class="ml-2 w-full border-none outline-none" />
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-gray-700 font-medium dark:text-gray-200">Select time slot</label>
            <select v-model="selectedTime" class="w-full border p-2 rounded-lg shadow-sm mt-1">
              <option value="7:00 PM - 8:00 PM">7:00 PM - 8:00 PM</option>
              <option value="8:00 PM - 9:00 PM">8:00 PM - 9:00 PM</option>
            </select>
          </div>
          <p class="mt-4 text-gray-700 dark:text-gray-200">You will pay <span class="text-blue-600 font-bold">{{venue.price}} EGP</span> per <span class="font-bold">1 Hour</span></p>
        </div>
      </div>
      <div class="mt-6 flex justify-center gap-4">
        <button @click="bookNow"   :class="{'bg-gray-400 hover:bg-gray-400 cursor-not-allowed': !selectedDate || !selectedTime}"
        :disabled="!selectedDate || !selectedTime" class="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium shadow-lg transition-all w-full text-center">
          Book Now
        </button>
        <button  @click="cancelBooking" class="bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium shadow-lg transition-all">
          Cancel
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        selectedDate: '',
        selectedTime: '7:00 PM - 8:00 PM'
      };
    },
    computed : {
        venue() {
            return this.$store.getters.getSelectedVenue;
        },
    }
    ,
    methods: {
      bookNow() {
        this.$router.push("/bookingInfoPayment")
      },
      cancelBooking(){
        this.$router.back()
      }
    }
  };
  </script>
  
  <style>
  body {
    background-color: #f9f9f9;
  } 
  input[type="date"]{
    color-scheme: dark;
}
  </style>
  