<template>
  <div class="mt-8 p-4 bg-white rounded-lg shadow dark:bg-gray-800">
    <!-- Average Rating Display -->
    <div
      class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 border-b pb-4 dark:border-gray-700">
      <div class="mb-4 sm:mb-0">
        <h3 class="text-xl font-semibold mb-2 dark:text-white">{{ $t('venueReview.reviews') }}</h3>
        <div class="flex items-center">
          <div class="text-yellow-400 text-2xl mr-2">
            {{ "★".repeat(Math.round(averageRating))
            }}{{ "☆".repeat(5 - Math.round(averageRating)) }}
          </div>
          <span class="text-lg font-semibold text-gray-700 dark:text-gray-300">
            {{ averageRating ? averageRating.toFixed(1) : "0" }}
          </span>
          <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">
            ({{ totalReviews }} {{ totalReviews === 1 ? $t('venueReview.review') : $t('venueReview.reviews') }})
          </span>
        </div>
      </div>
      <div class="w-full sm:w-auto sm:text-right">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {{ $t('venueReview.ratingBreakdown') }}
        </div>
        <div class="space-y-1 mt-1">
          <div v-for="rating in 5" :key="rating" class="flex items-center text-sm">
            <span class="w-4 text-gray-600 dark:text-gray-300">{{
              rating
            }}</span>
            <span class="text-yellow-400 ml-1">★</span>
            <div class="w-full sm:w-24 h-2 bg-gray-200 rounded-full mx-2 flex-grow">
              <div class="h-full bg-yellow-400 rounded-full"
                :style="{ width: calculateRatingPercentage(rating) + '%' }"></div>
            </div>
            <span class="text-gray-500 dark:text-gray-400 w-8 text-right">{{
              getRatingCount(rating)
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Review Form for logged in users -->
    <div v-if="isAuthenticated" class="mb-6">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">{{ $t('venueReview.yourRating') }}</label>
        <div class="flex gap-2">
          <button v-for="star in 5" :key="star" @click="rating = star"
            class="cursor-pointer text-3xl focus:outline-none touch-manipulation"
            :class="star <= rating ? 'text-yellow-400' : 'text-gray-300'">
            ★
          </button>
        </div>
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">{{ $t('venueReview.yourReview') }}</label>
        <textarea v-model="reviewText" rows="4"
          class="w-full resize-none px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          :placeholder="$t('venueReview.writeReviewPlaceholder')"></textarea>
      </div>
      <button @click="submitReview"
        class="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
        :disabled="!rating || !reviewText" :class="{ 'opacity-50 cursor-not-allowed': !rating || !reviewText }">
        {{ $t('venueReview.submitReview') }}
      </button>

      <!-- Error Message -->
      <div v-if="reviewError"
        class="mt-3 text-sm text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/20 p-2 rounded">
        {{ reviewError }}
      </div>
    </div>

    <!-- Sign in prompt for non-authenticated users -->
    <div v-else class="mb-6 p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
      <p class="text-gray-600 dark:text-gray-300">
        {{ $t('venueReview.signInPrompt') }}
      </p>
      <button @click="$emit('show-signin')" class="mt-2 text-blue-600 hover:text-blue-800 font-medium">
        {{ $t('venueReview.signInHere') }}
      </button>
    </div>

    <!-- Reviews List -->
    <div class="space-y-4">
      <div v-if="venueReviews.length === 0" class="text-gray-500 dark:text-gray-400 text-center py-6">
        {{ $t('venueReview.noReviews') }}
      </div>
      <div v-for="review in venueReviews" :key="review.id" class="border-b last:border-b-0 pb-4 dark:border-gray-700">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center mb-1 sm:mb-0">
            <span class="font-medium dark:text-white">{{
              review.userName
            }}</span>
            <span class="text-yellow-400 ml-2">
              {{ "★".repeat(review.rating) }}
            </span>
          </div>
          <span class="text-sm text-gray-500 dark:text-gray-400">{{
            formatDate(review.date)
          }}</span>
        </div>
        <p class="mt-2 text-gray-600 dark:text-gray-300">{{ review.text }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref as vueRef, onMounted, watch, computed } from "vue";
import { db, ref, set, onValue } from "@/firebase";
import store from "@/store/store";
import { Profanity, CensorType } from "@2toad/profanity";

// Initialize profanity filter with English
const profanityFilter = new Profanity({
  languages: ["en", "ar"],
  wholeWord: true,
  grawlix: "****",
});

// Add some common Arabic profanity words (you should expand this list)

export default {
  name: "VenueReview",
  props: {
    venueId: {
      type: String,
      required: true,
    },
  },
  emits: ["show-signin"],
  setup(props) {
    const rating = vueRef(0);
    const reviewText = vueRef("");
    const venueReviews = vueRef([]);
    const isAuthenticated = vueRef(store.state.isAuthenticated);
    const reviewError = vueRef("");

    // Computed properties for rating statistics
    const averageRating = computed(() => {
      if (venueReviews.value.length === 0) return 0;
      const sum = venueReviews.value.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      return sum / venueReviews.value.length;
    });

    const totalReviews = computed(() => venueReviews.value.length);

    const getRatingCount = (stars) => {
      return venueReviews.value.filter((review) => review.rating === stars)
        .length;
    };

    const calculateRatingPercentage = (stars) => {
      if (totalReviews.value === 0) return 0;
      return (getRatingCount(stars) / totalReviews.value) * 100;
    };

    // Watch for auth state changes
    watch(
      () => store.state.isAuthenticated,
      (newValue) => {
        isAuthenticated.value = newValue;
      }
    );

    const checkAndCensorProfanity = (text) => {
      // Check if text contains profanity
      if (profanityFilter.exists(text)) {
        // Censor the text
        return {
          hasProfanity: true,
          censoredText: profanityFilter.censor(text, CensorType.Word),
        };
      }
      return {
        hasProfanity: false,
        censoredText: text,
      };
    };

    const submitReview = async () => {
      if (!rating.value || !reviewText.value) return;

      // Reset error
      reviewError.value = "";

      // Check and censor profanity
      const { hasProfanity, censoredText } = checkAndCensorProfanity(
        reviewText.value
      );

      const user = store.state.user;
      const reviewId = "review_" + Date.now();

      const reviewData = {
        id: reviewId,
        userId: user.username,
        userName: user.name,
        rating: rating.value,
        text: censoredText, // Use censored text
        date: new Date().toISOString(),
        containedProfanity: hasProfanity, // Optional: track if review contained profanity
      };

      try {
        // Save to venue's reviews
        await set(
          ref(db, `venues/${props.venueId}/reviews/${reviewId}`),
          reviewData
        );

        // Update store with new rating
        store.dispatch("updateVenueRating", {
          venueId: props.venueId,
          rating: rating.value,
        });

        // Reset form
        rating.value = 0;
        reviewText.value = "";

        if (hasProfanity) {
          reviewError.value =
            "Your review contained inappropriate language and has been censored.";
        }
      } catch (error) {
        console.error("Error submitting review:", error);
        reviewError.value = "Error submitting review. Please try again.";
      }
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    // Load reviews
    onMounted(() => {
      const reviewsRef = ref(db, `venues/${props.venueId}/reviews`);
      onValue(reviewsRef, (snapshot) => {
        const reviews = snapshot.val();
        if (reviews) {
          venueReviews.value = Object.values(reviews).sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
        } else {
          venueReviews.value = [];
        }
      });
    });

    return {
      rating,
      reviewText,
      venueReviews,
      isAuthenticated,
      submitReview,
      formatDate,
      averageRating,
      totalReviews,
      getRatingCount,
      calculateRatingPercentage,
      reviewError,
    };
  },
};
</script>
