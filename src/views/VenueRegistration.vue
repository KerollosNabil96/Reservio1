<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-10 px-4 sm:px-6 relative"
  >
    <!-- Background pattern for dark mode -->
    <div
      class="absolute inset-0 overflow-hidden pointer-events-none dark:opacity-10 opacity-0"
    >
      <div
        class="absolute -top-24 -left-24 w-64 h-64 bg-blue-200 dark:bg-blue-800 rounded-full blur-3xl opacity-5 dark:opacity-10 animate-pulse-slow"
      ></div>
      <div
        class="absolute top-1/2 -right-24 w-80 h-80 bg-indigo-200 dark:bg-indigo-800 rounded-full blur-3xl opacity-5 dark:opacity-10 animate-pulse-slower"
      ></div>
      <div
        class="absolute bottom-1/4 left-1/3 w-48 h-48 bg-gray-300 dark:bg-gray-700 rounded-full blur-3xl opacity-5 dark:opacity-10 animate-float"
      ></div>
    </div>

    <div class="max-w-2xl mx-auto relative z-10">
      <div
        class="bg-white dark:bg-gray-800/50 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        <div class="p-8">
          <h2 class="text-2xl md:text-3xl font-bold text-center mb-8">
            Register Your
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
            >
              Venue
            </span>
          </h2>

          <form @submit.prevent="handleNext" class="space-y-6">
            <!-- Venue Name -->
            <div class="form-group">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >Venue Name</label
              >
              <input
                type="text"
                v-model="venueName"
                placeholder="Enter your venue name"
                required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
              />
            </div>
              <div>
                <div class="form-group">
  <label
    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
  >
    Venue Address
  </label>
  <div class="flex items-center gap-2">
    <input
      type="text"
      v-model="venueAddress"
      placeholder="Enter your venue street address"
      class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
    />
    <button
      type="button" 
      @click="openMapPopup"
      class="px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
    >
      <i class="fas fa-map-marker-alt"></i> <!-- Font Awesome icon -->
    </button>
  </div>
</div>
<MapPopup
  v-if="showMapPopup"
  @close="showMapPopup = false"
  @location-selected="handleLocationSelected"
/>
        </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="form-group">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >City</label
                >
                <select
                  v-model="selectedCity"
                  @change="updateAreas"
                  required
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                >
                  <option disabled value="">Select a City</option>
                  <option
                    v-for="(areas, city) in cities"
                    :key="city"
                    :value="city"
                  >
                    {{ city }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Area</label
                >
                <select
                  v-model="selectedArea"
                  :disabled="!selectedCity"
                  required
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                >
                  <option disabled value="">Select an Area</option>
                  <option
                    v-for="area in cities[selectedCity] || []"
                    :key="area"
                    :value="area"
                  >
                    {{ area }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >Zip Code</label
                >
                <input
                  type="text"
                  v-model="zipCode"
                  placeholder="Zip Code"
                  required
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                />
              </div>
            </div>

            <div class="form-group">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Venue Phone Number
              </label>
              <input
                type="tel"
                v-model="phoneNumber"
                @input="validatePhoneNumber"
                placeholder="Phone number for bookings"
                required
                :class="[
                  'w-full px-4 py-3 rounded-lg border bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm',
                  phoneNumberError
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600',
                ]"
              />
              <p v-if="phoneNumberError" class="text-sm text-red-500 mt-1">
                {{ phoneNumberError }}
              </p>
            </div>

            <div class="form-group">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >Government ID</label
              >
              <CloudinaryUploader
                v-model="govID"
                :cloud-name="cloudName"
                :upload-preset="uploadPreset"
                folder="government_ids"
                upload-text="Upload your government ID"
                @upload-success="handleGovIdUpload"
              />
            </div>

            <div class="form-group">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >Category</label
              >
              <select
                v-model="category"
                @change="selectCategory"
                required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
              >
                <option disabled value="">Select venue category</option>
                <option v-for="cat in categories" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >Venue Images (3 required)</label
              >
              <div class="space-y-3">
                <CloudinaryUploader
                  v-model="firstImage"
                  :cloud-name="cloudName"
                  :upload-preset="uploadPreset"
                  folder="venue_images"
                  upload-text="Upload first venue image"
                  @upload-success="handleFirstImageUpload"
                />
                <CloudinaryUploader
                  v-model="secondImage"
                  :cloud-name="cloudName"
                  :upload-preset="uploadPreset"
                  folder="venue_images"
                  upload-text="Upload second venue image"
                  @upload-success="handleSecondImageUpload"
                />
                <CloudinaryUploader
                  v-model="thirdImage"
                  :cloud-name="cloudName"
                  :upload-preset="uploadPreset"
                  folder="venue_images"
                  upload-text="Upload third venue image"
                  @upload-success="handleThirdImageUpload"
                />
              </div>
            </div>

            <div
              v-if="firstImage || secondImage || thirdImage"
              class="image-preview grid grid-cols-3 gap-3 mt-4"
            >
              <div
                v-if="firstImage"
                class="aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <img
                  :src="firstImage"
                  alt="Venue Image 1"
                  class="w-full h-full object-cover"
                  @error="imageError(1)"
                />
              </div>
              <div
                v-if="secondImage"
                class="aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <img
                  :src="secondImage"
                  alt="Venue Image 2"
                  class="w-full h-full object-cover"
                  @error="imageError(2)"
                />
              </div>
              <div
                v-if="thirdImage"
                class="aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <img
                  :src="thirdImage"
                  alt="Venue Image 3"
                  class="w-full h-full object-cover"
                  @error="imageError(3)"
                />
              </div>
            </div>

            <div class="form-group">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Price (in EGP) {{ priceLabel }}
              </label>
              <div class="relative">
                <input
                  type="number"
                  v-model="price"
                  :placeholder="pricePlaceholder"
                  min="0"
                  step="10"
                  required
                  class="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                />
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <span class="text-gray-500 dark:text-gray-400">EGP</span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >Short Description</label
              >
              <input
                type="text"
                v-model="shortDescription"
                placeholder="Brief description (shown in cards)"
                required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
              />
            </div>

            <div class="form-group">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >Full Description</label
              >
              <textarea
                v-model="description"
                placeholder="Detailed description of your venue..."
                required
                rows="4"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              :disabled="!validLinks"
              class="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white font-medium transform transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </form>
        </div>
      </div>
    </div>
    <!-- Error Dialog -->
    <transition name="fade">
      <div
        v-if="isVisible"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div
          class="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 border border-gray-100 dark:border-gray-700"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">
              Attention Required
            </h3>
            <button
              @click="isVisible = false"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p class="text-gray-700 dark:text-gray-300 mb-4">
            Please upload exactly 3 images for your venue. This helps customers
            see your venue from different angles.
          </p>
          <button
            @click="isVisible = false"
            class="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </transition>
  </div>
  <Signup
    :show="showSignupForm"
    @close="showSignupForm = false"
    @switch-to-signin="
      showSignupForm = false;
      showSigninForm = true;
    "
  />
  <Signin
    :show="showSigninForm"
    @close="showSigninForm = false"
    @switch-to-signup="
      showSigninForm = false;
      showSignupForm = true;
    "
  />
</template>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import Signin from "@/components/registration/Signin.vue";
import Signup from "@/components/registration/Signup.vue";
import CloudinaryUploader from "@/components/common/CloudinaryUploader.vue";
import store from "@/store/store";
import MapPopup from "@/components/GeoLocation/MapPopup.vue"
export default {
  data() {
    return {
      showMapPopup: false, // Control the visibility of the map popup
      venueAddress: "", // Venue address input
      selectedCity: "", // Selected city
      selectedArea: "", // Selected area
      showSigninForm: false,
      showSignupForm: false,
      isVisible: false,
      venueName: "",
      venueAddress: "",
      selectedCity: "",
      selectedArea: "",
      firstImage: "",
      secondImage: "",
      thirdImage: "",
      govID: "",
      price: 0,
      zipCode: "",
      phoneNumber: "",
      category: "",
      categories: ["Medical", "Stadium", "Educational"],
      venueImages: [],
      shortDescription: "",
      description: "",
      phoneNumber: "",
      phoneNumberError: "",
      firstImageError: false,
      secondImageError: false,
      thirdImageError: false,
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your_cloud_name',
      uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'your_upload_preset',
      cities: {
        Cairo: [
          "Nasr City",
          "Heliopolis",
          "Maadi",
          "Zamalek",
          "New Cairo",
          "Shubra",
          "Downtown",
          "El Marg",
          "Ain Shams",
          "Helwan",
          "Fifth Settlement",
        ],
        Alexandria: [
          "Smouha",
          "Stanley",
          "Gleem",
          "Bolkly",
          "Miami",
          "Sedi Beshr",
          "Sidi Gaber",
          "Sporting",
          "Bacchus",
          "Al Agamy",
          "Mandara",
          "Montazah",
        ],
        Giza: [
          "Dokki",
          "Mohandeseen",
          "6th of October",
          "Sheikh Zayed",
          "Haram",
          "Faisal",
          "Imbaba",
          "Agouza",
          "Boulak El Dakrour",
        ],
        "Port Said": [
          "Al-Ganayen",
          "Al-Zohour",
          "Al-Manakh",
          "Port Fouad",
          "El Arab",
          "El Shark",
        ],
        Suez: ["Arbaeen", "Ataka", "Faisal", "Ganayen", "Suez"],
        Ismailia: [
          "Al-Qantara",
          "Fayed",
          "Tell El Kebir",
          "El Tal El Kabir",
          "Abu Suwayr",
        ],
        Sharkia: [
          "Zagazig",
          "10th of Ramadan",
          "Bilbeis",
          "Abu Hammad",
          "Minya El-Qamh",
          "Kafr Saqr",
          "El-Hussainia",
        ],
        Dakahlia: [
          "Mansoura",
          "Mit Ghamr",
          "Talkha",
          "Sherbin",
          "Belqas",
          "Nabaroh",
          "Aga",
        ],
        Beheira: [
          "Damanhur",
          "Kafr El Dawwar",
          "Rashid",
          "Abu Hummus",
          "Edku",
          "Shubrakhit",
          "Kom Hamada",
        ],
        Menoufia: [
          "Shibin El Kom",
          "Menouf",
          "Ashmoun",
          "Sadat City",
          "Tala",
          "Birket El Sab",
        ],
        Gharbia: [
          "Tanta",
          "El Mahalla El Kubra",
          "Zefta",
          "Kafr El Zayat",
          "Samannoud",
        ],
        "Kafr El Sheikh": [
          "Kafr El Sheikh",
          "Desouk",
          "Biyala",
          "Sidi Salem",
          "Baltim",
          "Fuwah",
        ],
        Fayoum: [
          "Fayoum",
          "Ibshaway",
          "Sinnuris",
          "Tamiya",
          "Youssef El Seddik",
        ],
        "Beni Suef": ["Beni Suef", "Al Wasta", "Biba", "Naser", "Ehnasia"],
        Minya: ["Minya", "Mallawi", "Samalut", "Maghagha", "Bani Mazar"],
        Asyut: ["Asyut", "Dairut", "Manfalut", "Abnoub", "Al Qusiyah"],
        Sohag: ["Sohag", "Akhmim", "Girga", "Tahta", "Al Balina"],
        Qena: ["Qena", "Luxor", "Abu Tesht", "Nag Hammadi", "Dishna"],
        Luxor: ["Luxor", "Armant", "Esna", "New Tiba"],
        Aswan: ["Aswan", "Edfu", "Kom Ombo", "Drau"],
        "Red Sea": ["Hurghada", "Safaga", "El Quseir", "Marsa Alam"],
        "New Valley": ["Kharga", "Dakhla", "Farafra", "Balat"],
        Matrouh: ["Marsa Matruh", "Siwa", "Sidi Barrani", "El Dabaa"],
        "North Sinai": ["Arish", "Sheikh Zuweid", "Rafah", "Bir El Abd"],
        "South Sinai": ["Sharm El Sheikh", "Dahab", "Nuweiba", "Taba", "Tor"],
      },
      formInputClass:
        "w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm",
    };
  },
  components: {
    Signin,
    Signup,
    CloudinaryUploader,
    MapPopup
  },
  computed: {
    ...mapGetters(["isAuthenticated"]),
    validImages() {
      return (
        this.firstImage && this.secondImage && this.thirdImage && this.govID
      );
    },
    priceLabel() {
      if (this.category === "Stadium") {
        return "/ hour";
      } else if (this.category === "Educational") {
        return "/ day";
      } else if (this.category === "Medical") {
        return "/ session";
      }
      return "";
    },
    pricePlaceholder() {
      if (this.category === "Stadium") {
        return "Price per session";
      } else if (this.category === "Educational") {
        return "Price per day";
      } else if (this.category === "Medical") {
        return "Price per hour";
      }
      return "Price";
    },
    validLinks() {
      return (
        this.validImages &&
        !this.phoneNumberError
      );
    },
  },
  watch: {
    firstImage(newValue) {
      this.validateFirstImage();
    },
    secondImage(newValue) {
      this.validateSecondImage();
    },
    thirdImage(newValue) {
      this.validateThirdImage();
    },
  },
  mounted() {
    const savedData = localStorage.getItem("venueRegistrationForm");
    if (savedData) {
      const formData = JSON.parse(savedData);
      this.venueName = formData.venueName || "";
      this.venueAddress = formData.venueAddress || "";
      this.selectedCity = formData.selectedCity || "";
      this.selectedArea = formData.selectedArea || "";
      this.zipCode = formData.zipCode || "";
      this.category = formData.category || "";
      this.govID = formData.govID || "";
      this.price = formData.price || "";
      this.shortDescription = formData.shortDescription || "";
      this.description = formData.description || "";
      this.firstImage = formData.firstImage || "";
      this.secondImage = formData.secondImage || "";
      this.thirdImage = formData.thirdImage || "";
      this.phoneNumber = formData.phoneNumber || "";

      if (formData.selectedCity) {
        // Update areas first, then set the selected area
        this.$nextTick(() => {
          this.updateAreas();
          this.selectedArea = formData.selectedArea || "";
        });
      }
    }
  },
  methods: {
    openMapPopup() {
    this.showMapPopup = true; // Open the map popup
  },
    // Handle location selection from the map popup
  handleLocationSelected(location) {
    if (location && location.address) {
      this.venueAddress = location.address;
      this.selectedCity = location.city;
      this.selectedArea = location.area;
    } else {
      alert("Please select a valid location from the map.");
    }
  },
    handleGovIdUpload(data) {
      this.govID = data.secure_url;
      // Clear any previous errors
      this.validateImageLink(this.govID);
    },
    
    handleFirstImageUpload(data) {
      this.firstImage = data.secure_url;
      this.firstImageError = false;
    },
    
    handleSecondImageUpload(data) {
      this.secondImage = data.secure_url;
      this.secondImageError = false;
    },
    
    handleThirdImageUpload(data) {
      this.thirdImage = data.secure_url;
      this.thirdImageError = false;
    },
    
    validateImageLink(imageLink) {
      if (!imageLink) return false;
      const regex = /^(http|https|ftp):\/\/[^\s$.?#].[^\s]*$/i;
      return regex.test(imageLink);
    },

    validateFirstImage() {
      this.firstImageError = !this.validateImageLink(this.firstImage);
    },
    validateSecondImage() {
      this.secondImageError = !this.validateImageLink(this.secondImage);
    },
    validateThirdImage() {
      this.thirdImageError = !this.validateImageLink(this.thirdImage);
    },
    updateAreas() {
      // Only clear selectedArea if it's not part of form data restoration
      if (
        !this.$el
          .querySelector('select[v-model="selectedArea"]')
          ?.hasAttribute("data-restoring")
      ) {
        this.selectedArea = "";
      }
    },
    clearFormData() {
      localStorage.removeItem("venueRegistrationForm");
      localStorage.removeItem("pendingVenueRegistration");
      this.venueName = "";
      this.venueAddress = "";
      this.selectedCity = "";
      this.selectedArea = "";
      this.zipCode = "";
      this.category = "";
      this.govID = "";
      this.price = "";
      this.shortDescription = "";
      this.description = "";
      this.firstImage = "";
      this.secondImage = "";
      this.thirdImage = "";
      this.phoneNumber = "";
    },
    saveFormData() {
      if (
        this.firstImageError ||
        this.secondImageError ||
        this.thirdImageError
      ) {
        return;
      }
      const formData = {
        venueName: this.venueName,
        venueAddress: this.venueAddress,
        selectedCity: this.selectedCity,
        selectedArea: this.selectedArea,
        zipCode: this.zipCode,
        category: this.category,
        govID: this.govID,
        price: this.price,
        shortDescription: this.shortDescription,
        description: this.description,
        firstImage: this.firstImage,
        secondImage: this.secondImage,
        thirdImage: this.thirdImage,
        phoneNumber: this.phoneNumber,
      };
      localStorage.setItem("venueRegistrationForm", JSON.stringify(formData));
    },
    handleNext() {
      this.saveFormData();
      if (store.state.isAuthenticated) {
        let id = "id" + Math.random().toString(16).slice(2);
        const formData = {
          id,
          venueName: this.venueName,
          owner: store.state.user.email,
          category: this.category,
          govID: this.govID,
          price: this.price,
          address: {
            street: this.venueAddress,
            governorate: this.selectedCity,
            city: this.selectedArea,
            zipCode: this.zipCode,
          },
          shortDescription: this.shortDescription,
          longDescription: this.description,
          pictures: [this.firstImage, this.secondImage, this.thirdImage],
          reviews: {},
        };
        this.$store.commit("setMyFormData", formData);
        localStorage.setItem(
          "pendingVenueRegistration",
          JSON.stringify(formData)
        );
        this.$router.push({
          path: "/afterRegForm",
          query: { category: this.category },
        });
      } else {
        this.showSigninForm = true;
      }
    },
    selectCategory(event) {
      this.category = event.target.value;
      this.$emit("categorySelected", event.target.value);
    },
    validatePhoneNumber() {
      const regex = /^(011|012|015|010)\d{8}$|^(02|03)\d{8}$/;
      if (!regex.test(this.phoneNumber)) {
        this.phoneNumberError =
          "Phone number must be either an Egyptian mobile number (starts with 010, 011, 012, or 015) or a landline number (starts with 02 or 03).";
      } else {
        this.phoneNumberError = "";
      }
    },
    handleNext2() {
      this.validatePhoneNumber();
      if (this.phoneNumberError) {
        return;
      }
    },
    ...mapActions(["logout"]),
    handleLogout() {
      this.logout();
      this.$router.push("/");
    },
    saveFormData() {
      const formData = {
        venueName: this.venueName,
        venueAddress: this.venueAddress,
        selectedCity: this.selectedCity,
        selectedArea: this.selectedArea,
        zipCode: this.zipCode,
        phoneNumber: this.phoneNumber,
        govID: this.govID,
        category: this.category,
        price: this.price,
        shortDescription: this.shortDescription,
        description: this.description,
        firstImage: this.firstImage,
        secondImage: this.secondImage,
        thirdImage: this.thirdImage,
      };
      localStorage.setItem("venueRegistrationForm", JSON.stringify(formData));
    },

    loadFormData() {
      const savedData = localStorage.getItem("venueRegistrationForm");
      if (savedData) {
        const formData = JSON.parse(savedData);
        // Store the selected area temporarily
        const tempSelectedArea = formData.selectedArea;
        // Load all other form data
        Object.assign(this, formData);
        // If there's a selected city, update areas first
        if (formData.selectedCity) {
          this.updateAreas();
          // Restore the selected area after areas are updated
          this.$nextTick(() => {
            this.selectedArea = tempSelectedArea;
          });
        }
      }
    },

    handleNext() {
      this.saveFormData();
      if (store.state.isAuthenticated) {
        let id = "id" + Math.random().toString(16).slice(2);
        const formData = {
          id,
          venueName: this.venueName,
          owner: store.state.user.email,
          category: this.category,
          govID: this.govID,
          price: this.price,
          address: {
            street: this.venueAddress,
            governorate: this.selectedCity,
            city: this.selectedArea,
          },
          shortDescription: this.shortDescription,
          longDescription: this.description,
          pictures: [this.firstImage, this.secondImage, this.thirdImage],
          reviews: {},
        };
        this.$store.commit("setMyFormData", formData);
        localStorage.setItem(
          "pendingVenueRegistration",
          JSON.stringify(formData)
        );
        console.log(store.state.formData);
        this.$router.push({
          path: "/afterRegForm",
          query: { category: this.category },
        });
      } else {
        this.showSigninForm = true;
      }
    },
    selectCategory(event) {
      this.$emit("categorySelected", event.target.value);
    },
    validatePhoneNumber() {
      const regex = /^(011|012|015|010)\d{8}$|^(02|03)\d{8}$/;
      if (!regex.test(this.phoneNumber)) {
        this.phoneNumberError =
          "Phone number must be either an Egyptian mobile number (starts with 010, 011, 012, or 015) or a landline number (starts with 02 or 03).";
      } else {
        this.phoneNumberError = "";
      }
    },
    handleNext2() {
      this.validatePhoneNumber();
      if (this.phoneNumberError) {
        return;
      }
    },
    ...mapActions(["logout"]),
    handleLogout() {
      this.logout();
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Animation keyframes */
@keyframes pulse-slow {
  0%,
  100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.2;
  }
}

@keyframes pulse-slower {
  0%,
  100% {
    opacity: 0.05;
  }
  50% {
    opacity: 0.15;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-pulse-slower {
  animation: pulse-slower 12s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-float {
  animation: float 10s ease-in-out infinite;
}

textarea {
  resize: none !important;
}
.border-red-500 {
  border-color: #ef4444;
}
</style>
