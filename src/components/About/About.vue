<template>
  <div class="About dark:bg-gray-900 bg-gray-0 overflow-x-hidden">
    <!-- Hero Section -->
    <div class="hero-section bg-gradient-to-r from-blue-600 to-blue-400 py-24 md:py-32 text-white">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl md:text-5xl font-bold text-center mb-6 animate-fadeIn">
          {{ $t('welcome') }}
        </h1>
        <p class="text-xl text-center max-w-3xl mx-auto animate-slideUp">
          {{ $t('transforming_reservation') }}
        </p>
      </div>
      <div class="absolute bottom-0 left-0 w-full overflow-hidden"></div>
    </div>

    <!-- Who We Are Section -->
    <div class="who bg-white py-16 dark:bg-gray-800 transition-all duration-300">
      <div class="container mx-auto px-4">
        <h2 class="font-bold text-3xl md:text-4xl text-center text-blue-600 mb-12 animate-fadeIn">
          {{ $t('who_we_are') }}
        </h2>
        <div class="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div class="space-y-6 animate-slideLeft">
            <p class="text-lg text-gray-600 dark:text-white leading-relaxed">
              {{ $t('about_reservio') }}
            </p>
            <p class="text-lg text-gray-600 dark:text-white leading-relaxed">
              {{ $t('founding_year') }}
            </p>
          </div>
          <div class="relative animate-slideRight">
            <div class="rounded-lg overflow-hidden">
              <img src="/src/assets/pictures/about-image.jpg" alt="About Reservio"
                class="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Meet Our Team Section -->
    <div class="Meet py-16 bg-gray-50 dark:bg-gray-800 transition-all duration-300">
      <div class="container mx-auto px-4">
        <h2 class="font-bold text-3xl md:text-4xl text-center text-blue-600 mb-12 animate-fadeIn">
          {{ $t('meet_our_team') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-8">
          <div class="team-member group">
            <div
              class="relative overflow-hidden rounded-xl shadow-xl bg-white/10 backdrop-blur-sm transform hover:-translate-y-2 transition-all duration-300 h-[400px]">
              <img src="../../assets/pictures/man.jpg"
                class="w-full transition-transform duration-500 ease-in-out group-hover:scale-110" alt="Hazem" />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              </div>
              <div
                class="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 backdrop-blur-sm bg-black/30">
                <h3 class="font-bold text-2xl mb-2">{{ $t('hazem-name') }}</h3>
                <p class="text-gray-200 text-lg">
                  {{ $t('hazem_title') }}
                </p>
                <p
                  class="mt-2 text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {{ $t('hazem_description') }}
                </p>
              </div>
            </div>
          </div>

          <div class="team-member group">
            <div
              class="relative overflow-hidden rounded-xl shadow-xl bg-white/10 backdrop-blur-sm transform hover:-translate-y-2 transition-all duration-300 h-[400px]">
              <img src="../../assets/pictures/man.jpg"
                class="w-full transition-transform duration-500 ease-in-out group-hover:scale-110" alt="Kareem" />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              </div>
              <div
                class="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 backdrop-blur-sm bg-black/30">
                <h3 class="font-bold text-2xl mb-2">{{ $t('kareem-name') }}</h3>
                <p class="text-gray-200 text-lg"> {{ $t('kareem_title') }}</p>
                <p
                  class="mt-2 text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {{ $t('kareem_description') }}
                </p>
              </div>
            </div>
          </div>
          <div class="team-member group">
            <div
              class="relative overflow-hidden rounded-xl shadow-xl bg-white/10 backdrop-blur-sm transform hover:-translate-y-2 transition-all duration-300 h-[400px]">
              <img src="../../assets/pictures/man.jpg"
                class="w-full transition-transform duration-500 ease-in-out group-hover:scale-110" alt="Kerollos" />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              </div>
              <div
                class="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 backdrop-blur-sm bg-black/30">
                <h3 class="font-bold text-2xl mb-2">{{ $t('kerollos-name') }}</h3>
                <p class="text-gray-200 text-lg">{{ $t('kerollos_title') }}</p>
                <p
                  class="mt-2 text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {{ $t('kerollos_description') }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div class="team-member group">
            <div
              class="relative overflow-hidden rounded-xl shadow-xl bg-white/10 backdrop-blur-sm transform hover:-translate-y-2 transition-all duration-300 h-[400px] flex justify-center">
              <img src="../../assets/pictures/2.png"
                class="transition-transform duration-500 ease-in-out group-hover:scale-110" alt="Nourhan Sami" />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              </div>
              <div
                class="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 backdrop-blur-sm bg-black/30">
                <h3 class="font-bold text-2xl mb-2">{{ $t('nourhan_name') }}</h3>
                <p class="text-gray-200 text-lg">{{ $t('nourhan_title') }}</p>
                <p
                  class="mt-2 text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {{ $t('nourhan_description') }}
                </p>
              </div>
            </div>
          </div>
          <div class="team-member group">
            <div
              class="relative overflow-hidden rounded-xl shadow-xl bg-white/10 backdrop-blur-sm transform hover:-translate-y-2 transition-all duration-300 h-[400px] flex justify-center">
              <img src="../../assets/pictures/2.png"
                class="transition-transform duration-500 ease-in-out group-hover:scale-110" alt="Nareman Abdallah" />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              </div>
              <div
                class="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 backdrop-blur-sm bg-black/30">
                <h3 class="font-bold text-2xl mb-2">{{ $t('nareman_name') }}</h3>
                <p class="text-gray-200 text-lg">{{ $t('nareman_title') }}</p>
                <p
                  class="mt-2 text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {{ $t('nareman_description') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Our Vision Section -->
    <div class="vision bg-gray-50 py-16 dark:bg-gray-800 transition-all duration-300">
      <div class="container mx-auto px-4">
        <h2 class="font-bold text-3xl md:text-4xl text-center text-blue-600 mb-12 animate-fadeIn">
          {{ $t('our_vision') }}
        </h2>
        <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div
            class="vision-card bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg transform hover:-translate-y-2 transition-all duration-300 animate-slideUp">
            <div class="text-blue-500 mb-4 flex justify-center">
              <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fill-rule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-center mb-3 dark:text-white">
              {{ $t('innovation') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300 text-center">
              {{ $t('innovation_description') }}
            </p>
          </div>
          <div
            class="vision-card bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg transform hover:-translate-y-2 transition-all duration-300 animate-slideUp delay-100">
            <div class="text-blue-500 mb-4 flex justify-center">
              <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-center mb-3 dark:text-white">
              {{ $t('excellence') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300 text-center">
              {{ $t('excellence_description') }}
            </p>
          </div>
          <div
            class="vision-card bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg transform hover:-translate-y-2 transition-all duration-300 animate-slideUp delay-200">
            <div class="text-blue-500 mb-4 flex justify-center">
              <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-center mb-3 dark:text-white">
              {{ $t('trust') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300 text-center">
              {{ $t('trust_description') }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Our Mission Section -->
    <div class="mission bg-white py-16 dark:bg-gray-800 transition-all duration-300">
      <div class="container mx-auto px-4">
        <h2 class="font-bold text-3xl md:text-4xl text-center text-blue-600 mb-12 animate-fadeIn">
          {{ $t('our_mission') }}
        </h2>
        <div
          class="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-8 shadow-lg animate-slideUp">
          <p class="text-lg text-gray-600 dark:text-white leading-relaxed text-center">
            {{ $t('mission_description') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "About",
};
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 1s ease-in;
}

.animate-slideUp {
  animation: slideUp 1s ease-out;
}

.animate-slideLeft {
  animation: slideLeft 1s ease-out;
}

.animate-slideRight {
  animation: slideRight 1s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideLeft {
  from {
    transform: translateX(-50px);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideRight {
  from {
    transform: translateX(50px);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.team-member:hover img {
  transform: scale(1.05);
}

.vision-card {
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.vision-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.delay-100 {
  animation-delay: 0.1s;
}

.delay-200 {
  animation-delay: 0.2s;
}

.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%;
}

.aspect-h-9 {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
}
</style>
