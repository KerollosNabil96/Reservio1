<template>
  <div class="mb-4">
    <label class="block font-medium dark:text-white"
      >Add your Stadium license</label
    >
    <input
      type="text"
      v-model="sportOrganizationLicense"
      class="mt-2 border p-2 w-full rounded-md dark:text-white"
    />
  </div>

  <!-- Date Picker -->
  <div class="mb-4">
    <label class="block font-medium dark:text-white">Pick a Date</label>
    <input
      type="date"
      v-model="selectedDate"
      class="mt-2 border p-2 w-full rounded-md dark:text-white"
    />
  </div>

  <!-- Time Slot Selection -->
  <div class="mb-4">
    <label class="block font-medium dark:text-white">Select time slot</label>
    <div class="flex gap-2 mt-2">
      <input
        type="time"
        v-model="fromTime"
        class="border p-2 w-1/3 rounded-md dark:text-white"
      />
      <input
        type="time"
        v-model="toTime"
        class="border p-2 w-1/3 rounded-md dark:text-white"
      />
      <input
        type="number"
        v-model.number="capacity"
        class="border p-2 w-1/3 rounded-md dark:text-white"
        placeholder="Capacity"
        min="1"
      />
    </div>
    <button
      @click="addTimeSlot"
      class="mt-4 w-full bg-blue-600 text-white py-2 rounded-md"
    >
      Add Time Slot
    </button>
  </div>

  <!-- Time Slots Table -->
  <div class="mt-4 border rounded-md p-4">
    <table class="w-full text-left">
      <thead>
        <tr class="border-b">
          <th class="py-2 dark:text-white">From</th>
          <th class="py-2 dark:text-white">To</th>
          <th class="py-2 dark:text-white">Capacity</th>
          <th class="py-2 dark:text-white">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(slot, index) in timeSlots" :key="index" class="border-b">
          <td class="py-2 dark:text-white">{{ slot.from }}</td>
          <td class="py-2 dark:text-white">{{ slot.to }}</td>
          <td class="py-2 dark:text-white">{{ slot.capacity }}</td>
          <td class="py-2 dark:text-white">
            <button @click="removeTimeSlot(index)" class="text-red-500">
              ✖
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Proceed Button -->
  <button
    @click="proceedToPayment"
    :disabled="!canProceed"
    class="mt-6 w-full bg-green-600 text-white py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
  >
    Proceed to Payment
  </button>
  <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
</template>

<script>
import store from "@/store/store";

export default {
  props: ["requiredLicenses"],
  data() {
    return {
      selectedDate: "",
      fromTime: "",
      toTime: "",
      capacity: 5,
      timeSlots: [],
      errorMessage: "",
      sportOrganizationLicense: "",
    };
  },
  computed: {
    canProceed() {
      return (
        this.selectedDate &&
        this.timeSlots.length > 0 &&
        this.sportOrganizationLicense
      );
    },
  },
  methods: {
    addTimeSlot() {
      if (this.fromTime && this.toTime && this.capacity > 0) {
        this.timeSlots.push({
          from: this.fromTime,
          to: this.toTime,
          capacity: this.capacity,
          available: this.capacity,
        });
        this.fromTime = "";
        this.toTime = "";
        this.capacity = 5;
      }
    },
    removeTimeSlot(index) {
      this.timeSlots.splice(index, 1);
    },
    async proceedToPayment() {
      if (!this.canProceed) {
        this.errorMessage =
          "Please fill in all required fields and add at least one time slot.";
        return;
      }

      try {
        this.isLoading = true;
        this.errorMessage = "";

        const formData = store.state.myFormData;

        store.state.myFormData = {
          ...formData,
          selectedDate: this.selectedDate,
          sportOrganizationLicense: this.sportOrganizationLicense,
          timeSlots: this.timeSlots,
        };
        this.$router.push("/payment");
      } catch (error) {
        this.errorMessage =
          error.message || "Failed to save venue data. Please try again.";
      } finally {
        this.isLoading = false;
      }
    },
    uploadLicense(event) {
      this.requiredLicenses = event.target.files;
    },
  },
};
</script>

<style lang="scss" scoped></style>
