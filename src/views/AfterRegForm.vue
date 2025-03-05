<template>
  <div
    class="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-xl my-8 dark:bg-gray-900"
  >
    <h2 class="text-2xl font-semibold text-center mb-6 dark:text-white">
      Register Your <span class="text-blue-600">{{ category }}</span>
    </h2>
    <component :is="component" :required-licenses="requiredLicenses" />
  </div>
</template>

<script>

import AfterRegFormEducational from "@/components/AfterRegForm/AfterRegFormEducational.vue";
import AfterRegFormMedical from "@/components/AfterRegForm/AfterRegFormMedical.vue";
import AfterRegFormSports from "@/components/AfterRegForm/AfterRegFormSports.vue";
import store from "@/store/store";

export default {
  component: {
    AfterRegFormEducational,
    AfterRegFormMedical,
    AfterRegFormSports,
  },
  computed: {
    category() {
      const category = this.$route.query.category || "No category selected";
    console.log("Category:", category);  // تأكد من قيمة category
    return category
    },
    requiredLicenses() {
      const licenseMap = {
        Medical: ["Medical License", "Clinic License"],
        Stadium: ["Stadium License"],
        Educational: ["Educational Center License"],
      };
      return licenseMap[store.state.formData.category] || [];
    },

    component() {
      switch (this.category) {
        case "Medical":
          return AfterRegFormMedical;
        case "Stadium":
          return AfterRegFormSports;
        case "Educational":
          return AfterRegFormEducational;
        default:
          return;
      }
    },
  },
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
