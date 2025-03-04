<template>
  <div class="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-xl my-8 dark:bg-gray-900">
    <h2 class="text-2xl font-semibold text-center mb-6 dark:text-white">
      Register Your <span class="text-blue-600">{{ category }}</span>
    </h2>

    <!-- Dynamic Documents Upload -->
    <div v-for="(license, index) in requiredLicenses" :key="index" class="mb-4">
      <label class="block font-medium  dark:text-white">Upload your {{ license }}</label>
      <input type="file" class="mt-2 border p-2 w-full rounded-md  dark:text-white"  />
    </div>

    <!-- Date Picker -->
    <div class="mb-4">
      <label class="block font-medium  dark:text-white">Pick a Date</label>
      <input type="date" v-model="selectedDate" class="mt-2 border p-2 w-full rounded-md  dark:text-white" />
    </div>

    <!-- Time Slot Selection -->
    <div class="mb-4">
      <label class="block font-medium  dark:text-white">Select time slot</label>
      <div class="flex gap-2 mt-2">
        <input type="time" v-model="fromTime" class="border p-2 w-1/3 rounded-md  dark:text-white" />
        <input type="time" v-model="toTime" class="border p-2 w-1/3 rounded-md  dark:text-white" />
        <input type="number" v-model.number="capacity" class="border p-2 w-1/3 rounded-md  dark:text-white" placeholder="Capacity" min="1" />
      </div>
      <button @click="addTimeSlot" class="mt-4 w-full bg-blue-600 text-white py-2 rounded-md">Add Time Slot</button>
    </div>

    <!-- Time Slots Table -->
    <div class="mt-4 border rounded-md p-4">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b">
            <th class="py-2  dark:text-white">From</th>
            <th class="py-2  dark:text-white">To</th>
            <th class="py-2  dark:text-white">Capacity</th>
            <th class="py-2  dark:text-white">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(slot, index) in timeSlots" :key="index" class="border-b">
            <td class="py-2  dark:text-white">{{ slot.from }}</td>
            <td class="py-2  dark:text-white">{{ slot.to }}</td>
            <td class="py-2  dark:text-white">{{ slot.capacity }}</td>
            <td class="py-2  dark:text-white">
              <button @click="removeTimeSlot(index)" class="text-red-500">✖</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Proceed Button -->
    <button class="mt-6 w-full bg-green-600 text-white py-2 rounded-md">Proceed to Payment</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedDate: '',
      fromTime: '',
      toTime: '',
      capacity: 5,
      timeSlots: []
    };
  },

  computed: {
    category() {
      return this.$route.query.category || "No category selected";
    },
    requiredLicenses() {
      const licenseMap = {
        Medical: ["Medical License", "Clinic License"],
        Stadium: ["Stadium License"],
        "Event Hall": ["Hall License"],
        Gym: ["Gym License"]
      };
      return licenseMap[this.category] || [];
    }
  },

  methods: {
    addTimeSlot() {
      if (this.fromTime && this.toTime && this.capacity > 0) {
        this.timeSlots.push({
          from: this.fromTime,
          to: this.toTime,
          capacity: this.capacity
        });
        this.fromTime = '';
        this.toTime = '';
        this.capacity = 5;
      }
    },
    removeTimeSlot(index) {
      this.timeSlots.splice(index, 1);
    }
  }
};
</script>

<style scoped>
button:hover {
  opacity: 0.8;
}
input[type="time"],
input[type="date"] {
  color-scheme: dark;
}

</style>
