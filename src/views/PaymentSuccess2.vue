<template>
  <div class="flex flex-col items-center justify-center min-h-screen mt-8 bg-gray-100 p-6 dark:bg-gray-800">
    <div class="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center dark:bg-gray-900">
      <div class="flex items-center justify-center mb-6">
        <div class="w-8 h-8 bg-yellow-500 text-white flex items-center justify-center rounded-full">⏳</div>
      </div>
      <h2 class="text-xl font-bold text-gray-800 dark:text-gray-200">Your request has been received successfully!</h2>
      <img src="../assets/pictures/still-0115b33dc67f039141dc54b5633bd103.webp" alt="Request Pending" class="w-full h-50 rounded-xl object-cover my-4" />
      <p class="text-gray-500 dark:text-gray-300">Please wait, your request will be approved or rejected within 24 hours.<br> We will send you the details via email and phone message.</p>
      <router-link to="/" class="text-blue-600 font-semibold mt-4 inline-block">Go back to Home →</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: "PaymentSuccess",
  };
  </script>