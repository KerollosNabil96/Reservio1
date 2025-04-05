<template>
  <div class="venue-details-wrapper">
    <div
      class="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-[800px]">
      <!-- Background decorative elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          class="absolute -top-24 -left-24 w-64 h-64 bg-blue-200 dark:bg-blue-800 rounded-full blur-3xl opacity-5 dark:opacity-10 animate-pulse-slow">
        </div>
        <div
          class="absolute top-1/2 -right-24 w-80 h-80 bg-indigo-200 dark:bg-indigo-800 rounded-full blur-3xl opacity-5 dark:opacity-10 animate-pulse-slower">
        </div>
        <div
          class="absolute bottom-1/4 left-1/3 w-48 h-48 bg-gray-300 dark:bg-gray-700 rounded-full blur-3xl opacity-5 dark:opacity-10 animate-float">
        </div>
      </div>

      <div class="max-w-5xl mx-auto px-4 py-8 relative z-10">
        <!-- Loading State -->
        <div v-if="isLoading">
          <VenueDetailsSkeleton />
          <ReviewsSkeleton class="mt-8" />
        </div>

        <!-- Loaded Content -->
        <div v-else>
          <!-- Venue Title Section -->
          <div class="mb-8 transform transition-all duration-500 opacity-100 translate-y-0">
            <h1
              class="text-3xl md:text-4xl p-1 font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              {{ currentVenue.venueName }}
            </h1>
            <p class="text-center text-gray-500 dark:text-gray-400 mb-6 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ currentVenue.address.city }},
              {{ currentVenue.address.governorate }}
            </p>
          </div>

          <!-- Image Gallery Section -->
          <div class="mb-12 transform transition-all duration-500 opacity-100 translate-y-0">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
              <!-- Main large image -->
              <div class="col-span-1 md:col-span-7 transform transition-all duration-500">
                <div class="relative overflow-hidden rounded-xl shadow-2xl group"
                  @click="openImageModal(currentVenue.pictures[0])">
                  <div
                    class="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  </div>
                  <img :src="currentVenue.pictures[0]" alt="Venue main view"
                    class="w-full h-[300px] md:h-[400px] object-cover transition-all duration-700 group-hover:scale-105" />
                  <div
                    class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                    <p class="text-sm font-medium">Click to view gallery</p>
                  </div>
                </div>
              </div>

              <!-- Side images -->
              <div class="col-span-1 md:col-span-5 grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-4">
                <div class="relative overflow-hidden rounded-xl shadow-2xl group transform transition-all duration-500"
                  @click="openImageModal(currentVenue.pictures[1])">
                  <div
                    class="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  </div>
                  <img :src="currentVenue.pictures[1]" alt="Venue view 2"
                    class="w-full h-[150px] md:h-[195px] object-cover transition-all duration-700 group-hover:scale-105" />
                  <div
                    class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                    <p class="text-xs font-medium">View image</p>
                  </div>
                </div>

                <div class="relative overflow-hidden rounded-xl shadow-2xl group transform transition-all duration-500"
                  @click="openImageModal(currentVenue.pictures[2])">
                  <div
                    class="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  </div>
                  <img :src="currentVenue.pictures[2]" alt="Venue view 3"
                    class="w-full h-[150px] md:h-[195px] object-cover transition-all duration-700 group-hover:scale-105" />
                  <div
                    class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                    <p class="text-xs font-medium">View image</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tabs Section -->
          <div class="mb-6">
            <div class="flex border-b border-gray-200 dark:border-gray-700">
              <button @click="switchTab('information')" :class="[
                'py-3 cursor-pointer px-6 font-medium text-md border-b-2 transition-colors duration-200',
                activeTab === 'information'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
              ]">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2"
                    :class="[$i18n.locale === 'ar' ? 'ml-2' : 'mr-2']" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ $t("information") }}
                </div>
              </button>
              <button @click="switchTab('reviews')" :class="[
                'py-3 cursor-pointer px-6 font-medium text-md border-b-2 transition-colors duration-200',
                activeTab === 'reviews'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
              ]">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2"
                    :class="[$i18n.locale === 'ar' ? 'ml-2' : 'mr-2']" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {{ $t("reviews") }}
                </div>
              </button>
            </div>
          </div>

          <!-- Tab Content -->
          <div class="min-h-[500px]">
            <transition name="tab" mode="out-in">
              <component :is="activeTab === 'information' ? 'InformationTab' : 'ReviewsTab'
                " :current-venue="currentVenue" :full-address="fullAddress" :venue-id="currentVenue.id"
                @book-now="goToBooking" @show-signin="showSigninForm = true"></component>
            </transition>
          </div>

          <!-- Image Modal -->
          <transition name="modal-fade">
            <div v-if="showImageModal"
              class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 dark:bg-black/80 backdrop-blur-sm"
              @click="closeImageModal">
              <div
                class="relative dark:bottom-1/4 w-full h-full md:w-auto md:h-auto md:max-w-5xl md:max-h-[90vh] p-2 transform transition-all duration-500">
                <!-- Close button -->
                <button @click="closeImageModal"
                  class="absolute top-4 right-4 text-white bg-gray-800/80 dark:bg-gray-700/80 rounded-full p-2 hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-300 z-20 hover:scale-110 backdrop-blur-sm flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <!-- Navigation buttons -->
                <button @click.stop="prevImage"
                  class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-gray-800/80 dark:bg-gray-700/80 rounded-full p-2 hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-300 z-20 hover:scale-110 hover:-translate-x-1 backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <!-- Image container -->
                <div class="h-full w-full flex items-center justify-center overflow-hidden">
                  <transition name="slide-fade" mode="out-in">
                    <img :key="selectedImage" :src="selectedImage"
                      class="max-w-full max-h-[85vh] md:max-h-[85vh] object-contain rounded-lg select-none" width="800"
                      height="400" @click.stop draggable="false" />
                  </transition>
                </div>

                <button @click.stop="nextImage"
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-gray-800/80 dark:bg-gray-700/80 rounded-full p-2 hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-300 z-20 hover:scale-110 hover:translate-x-1 backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <!-- Image counter -->
                <div
                  class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-gray-800/80 dark:bg-gray-700/80 px-4 py-2 rounded-full text-sm transition-all duration-300 backdrop-blur-sm font-medium">
                  {{ currentImageIndex + 1 }} /
                  {{ currentVenue.pictures.length }}
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <Signin :show="showSigninForm" @close="showSigninForm = false" @switch-to-signup="
      showSigninForm = false;
    showSignupForm = true;
    " />
    <Signup :show="showSignupForm" @close="showSignupForm = false" @switch-to-signin="
      showSignupForm = false;
    showSigninForm = true;
    " />
  </div>
</template>

<script>
import AboutVenue from "@/components/VenueDetails/AboutVenue.vue";
import VenueReview from "@/components/venue/VenueReview.vue";
import Signin from "@/components/registration/Signin.vue";
import Signup from "@/components/registration/Signup.vue";
import VenueDetailsSkeleton from "@/components/venue/VenueDetailsSkeleton.vue";
import ReviewsSkeleton from "@/components/venue/ReviewsSkeleton.vue";
import InformationTab from "@/components/VenueDetails/InformationTab.vue";
import ReviewsTab from "@/components/VenueDetails/ReviewsTab.vue";
import store from "@/store/store";

export default {
  data() {
    return {
      showImageModal: false,
      selectedImage: null,
      currentImageIndex: 0,
      showSigninForm: false,
      showSignupForm: false,
      isLoading: true,
      activeTab: "information", // Default active tab
      isImageChanging: false, // New state for image transitions
    };
  },
  props: {
    id: {
      type: String,
      required: false,
    },
  },
  components: {
    AboutVenue,
    VenueReview,
    Signin,
    Signup,
    VenueDetailsSkeleton,
    ReviewsSkeleton,
    InformationTab,
    ReviewsTab,
  },
  computed: {
    currentVenue() {
      const id = this.$route.params.id;
      return this.$store.getters.getVenueById(id);
    },
    fullAddress() {
      if (!this.currentVenue || !this.currentVenue.address) return "";
      return `${this.currentVenue.address.street}, ${this.currentVenue.address.city}, ${this.currentVenue.address.governorate}`;
    },
  },
  methods: {
    openImageModal(imageUrl) {
      this.selectedImage = imageUrl;
      this.currentImageIndex = this.currentVenue.pictures.findIndex(
        (pic) => pic === imageUrl
      );
      this.showImageModal = true;
      document.body.style.overflow = "hidden";
    },
    closeImageModal() {
      this.showImageModal = false;
      document.body.style.overflow = "";
    },
    nextImage() {
      this.isImageChanging = true;
      setTimeout(() => {
        const totalImages = this.currentVenue.pictures.length;
        this.currentImageIndex = (this.currentImageIndex + 1) % totalImages;
        this.selectedImage = this.currentVenue.pictures[this.currentImageIndex];
        this.isImageChanging = false;
      }, 200);
    },
    prevImage() {
      this.isImageChanging = true;
      setTimeout(() => {
        const totalImages = this.currentVenue.pictures.length;
        this.currentImageIndex =
          (this.currentImageIndex - 1 + totalImages) % totalImages;
        this.selectedImage = this.currentVenue.pictures[this.currentImageIndex];
        this.isImageChanging = false;
      }, 200);
    },
    goToBooking() {
      if (this.$store.state.isAuthenticated) {
        this.$store.commit("setVenuePictures", this.currentVenue);
        this.$router.push("/booking-info");
      } else {
        this.showSigninForm = true;
      }
    },
    switchTab(tab) {
      // Just update the active tab, no URL changes
      this.activeTab = tab;
    },
  },
  mounted() {
    // Simulate loading for a short time on initial mount
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  },
  beforeRouteUpdate(to, from, next) {
    // Set loading to true when navigating between different venue details
    this.isLoading = true;
    next();
    // After navigation completes, wait for data to load
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  },
  watch: {},
};
</script>

<style scoped>
/* Modal Transition Effects */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.45s cubic-bezier(0.4, 0.01, 0.165, 0.99),
    transform 0.45s cubic-bezier(0.4, 0.01, 0.165, 0.99);
  backface-visibility: hidden;
  will-change: opacity, transform;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

/* Image Slide Transition Effects */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backface-visibility: hidden;
  will-change: opacity, transform;
  position: relative;
  z-index: 1;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Tab transitions for smooth tab switching */
.tab-enter-active,
.tab-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0.01, 0.165, 0.99),
    transform 0.4s cubic-bezier(0.4, 0.01, 0.165, 0.99);
  transform-origin: top center;
  will-change: opacity, transform;
  backface-visibility: hidden;
}

.tab-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

.tab-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

.img-gallery:focus {
  outline: none;
}
</style>
