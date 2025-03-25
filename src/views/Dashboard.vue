<template>
  <div>
    <div class="flex flex-col md:flex-row h-screen bg-gray-100 dark:bg-gray-900">
      <!-- Role Change Modal -->
      <div v-if="showRoleModal"
        class="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50 transition-all duration-300"
        @click="showRoleModal = false">
        <div
          class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-4 sm:p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02]"
          @click.stop>
          <div class="flex items-center mb-4 sm:mb-6">
            <i class="fas fa-user-shield text-blue-600 dark:text-blue-400 text-xl sm:text-2xl mr-3"></i>
            <h3 class="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
              Change User Role
            </h3>
          </div>
          <p class="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
            Are you sure you want to change
            <span class="font-semibold text-blue-600 dark:text-blue-400">{{
              selectedUser.name
            }}</span>'s role from
            <span class="font-semibold">{{
              selectedUser.isAdmin ? "Admin to User" : "User to Admin"
            }}</span>?
          </p>
          <div class="flex justify-end space-x-2 sm:space-x-4">
            <button @click="showRoleModal = false"
              class="px-3 sm:px-6 py-2 sm:py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 font-medium">
              Cancel
            </button>
            <button @click="confirmRoleChange()"
              class="px-3 sm:px-6 py-2 sm:py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 font-medium shadow-md hover:shadow-lg">
              Confirm Change
            </button>
          </div>
        </div>
      </div>

      <!-- Delete User Modal -->
      <div v-if="showDeleteModal"
        class="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50 transition-all duration-300"
        @click="showDeleteModal = false">
        <div
          class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-4 sm:p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02]"
          @click.stop>
          <div class="flex items-center mb-4 sm:mb-6">
            <i class="fas fa-exclamation-triangle text-red-600 text-xl sm:text-2xl mr-3"></i>
            <h3 class="text-lg sm:text-xl font-bold text-red-600">
              Delete User
            </h3>
          </div>
          <p class="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
            Are you sure you want to delete
            <span class="font-semibold text-red-600">{{
              selectedUser.name
            }}</span>?
            <br />
            <span class="text-sm text-red-500 mt-2 block">This action cannot be undone.</span>
          </p>
          <div class="flex justify-end space-x-2 sm:space-x-4">
            <button @click="showDeleteModal = false"
              class="px-3 sm:px-6 py-2 sm:py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 font-medium">
              Cancel
            </button>
            <button @click="confirmDelete()"
              class="px-3 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transform hover:scale-105 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center">
              <i class="fas fa-trash-alt mr-2"></i>
              Delete User
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Toggle Button -->
      <div class="md:hidden bg-white dark:bg-gray-800 p-4 flex justify-between items-center shadow-md">
        <h1 class="text-xl font-bold text-blue-600 dark:text-blue-400">
          Admin Dashboard
        </h1>
        <button @click="toggleSidebar" class="text-gray-700 dark:text-gray-300 focus:outline-none">
          <i class="fas fa-bars text-xl"></i>
        </button>
      </div>

      <!-- Side Navigation -->
      <nav :class="[
        sidebarOpen ? 'block' : 'hidden',
        'md:block w-full md:w-64 bg-white dark:bg-gray-800 shadow-lg',
      ]">
        <div class="p-6 hidden md:block">
          <h1 class="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Admin Dashboard
          </h1>
        </div>
        <ul class="space-y-2 p-4">
          <li>
            <RouterLink to="/dashboard"
              class="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
              :class="{
                'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300':
                  !$route.query.tab,
              }" @click="closeSidebarOnMobile">
              <i class="fas fa-users mr-3"></i>
              Users
            </RouterLink>
          </li>
          <li>
            <RouterLink to="/dashboard?tab=requests"
              class="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
              :class="{
                'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300':
                  $route.query.tab === 'requests',
              }" @click="closeSidebarOnMobile">
              <i class="fas fa-clipboard-list mr-3"></i>
              Requests Details
            </RouterLink>
          </li>
        </ul>
      </nav>

      <!-- Main Content -->
      <div class="flex-1 p-4 md:p-8 overflow-auto dark:bg-gray-900">
        <!-- Users Management Section -->
        <div v-if="$route.path === '/dashboard' && !$route.query.tab"
          class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 transition-opacity duration-300">
          <h2 class="text-xl md:text-2xl font-semibold mb-4 md:mb-6 dark:text-white">
            Users Management
          </h2>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    class="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th
                    class="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th
                    class="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="user in users" :key="user.email">
                  <td class="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div>
                        <div class="text-xs md:text-sm font-medium text-gray-900 dark:text-white">
                          {{ user.name }}
                        </div>
                        <div class="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                          {{ user.email }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="user.isAdmin
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      ">
                      {{ user.isAdmin ? "Admin" : "User" }}
                    </span>
                  </td>
                  <td class="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium">
                    <button @click="toggleUserRole(user)"
                      class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-2 md:mr-4 p-1 md:p-0"
                      :title="user.isAdmin ? 'Make User' : 'Make Admin'">
                      <i class="fas fa-user-shield text-base md:text-lg"></i>
                    </button>
                    <button @click="deleteUser(user)"
                      class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 md:p-0"
                      title="Delete User">
                      <i class="fas fa-trash text-base md:text-lg"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Requests Details Section -->
        <div v-if="$route.path === '/dashboard' && $route.query.tab === 'requests'"
          class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
          <h2 class="text-xl md:text-2xl font-semibold mb-4 md:mb-6 dark:text-white">
            Requests Details
          </h2>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    class="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Owner Email
                  </th>
                  <th
                    class="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Business Name
                  </th>
                  <th
                    class="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Business Details
                  </th>
                  <th
                    class="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="request in requests" :key="request.id">
                  <td class="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap">
                    <div class="text-xs md:text-sm font-medium text-gray-900 dark:text-white">
                      {{ request.owner }}
                    </div>
                  </td>
                  <td class="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap">
                    <div class="text-xs md:text-sm text-gray-900 dark:text-white">
                      {{ request.venueName }}
                    </div>
                  </td>
                  <td class="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap">
                    <button @click="showRequestDetails(request)"
                      class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 cursor-pointer">
                      More Details
                    </button>
                  </td>
                  <td class="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium">
                    <button @click="approveRequestConfirm(request)"
                      class="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 mr-2 md:mr-4"
                      title="Approve Request">
                      <i class="fas fa-check text-base md:text-lg"></i>
                    </button>
                    <button @click="rejectRequestConfirm(request)"
                      class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      title="Reject Request">
                      <i class="fas fa-times text-base md:text-lg"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Approve Request Confirmation Modal -->
    <div v-if="showApproveModal"
      class="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50 transition-all duration-300"
      @click="showApproveModal = false">
      <div
        class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-4 sm:p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02]"
        @click.stop>
        <div class="flex items-center mb-4 sm:mb-6">
          <i class="fas fa-check-circle text-green-600 dark:text-green-400 text-xl sm:text-2xl mr-3"></i>
          <h3 class="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
            Approve Request
          </h3>
        </div>
        <p class="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
          Are you sure you want to approve the venue request for
          <span class="font-semibold text-green-600 dark:text-green-400">
            {{ selectedRequest?.venueName }} </span>?
        </p>
        <div class="flex justify-end space-x-2 sm:space-x-4">
          <button @click="showApproveModal = false"
            class="px-3 sm:px-6 py-2 sm:py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 font-medium">
            Cancel
          </button>
          <button @click="acceptRequest(selectedRequest)"
            class="px-3 sm:px-6 py-2 sm:py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transform hover:scale-105 transition-all duration-200 font-medium shadow-md hover:shadow-lg">
            Approve
          </button>
        </div>
      </div>
    </div>

    <!-- Reject Request Confirmation Modal -->
    <div v-if="showRejectModal"
      class="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50 transition-all duration-300"
      @click="showRejectModal = false">
      <div
        class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-4 sm:p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02]"
        @click.stop>
        <div class="flex items-center mb-4 sm:mb-6">
          <i class="fas fa-times-circle text-red-600 text-xl sm:text-2xl mr-3"></i>
          <h3 class="text-lg sm:text-xl font-bold text-red-600">
            Reject Request
          </h3>
        </div>
        <p class="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
          Are you sure you want to reject the venue request for
          <span class="font-semibold text-red-600">
            {{ selectedRequest?.venueName }} </span>?
          <br />
          <span class="text-sm text-red-500 mt-2 block">This action cannot be undone.</span>
        </p>
        <div class="flex justify-end space-x-2 sm:space-x-4">
          <button @click="showRejectModal = false"
            class="px-3 sm:px-6 py-2 sm:py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 font-medium">
            Cancel
          </button>
          <button @click="
            showEmailModal = true;
          showRejectModal = false;
          "
            class="px-3 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transform hover:scale-105 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center">
            <i class="fas fa-times mr-2"></i>
            Reject
          </button>
        </div>
      </div>
    </div>

    <!-- Email Rejection Reason Modal -->
    <div v-if="showEmailModal"
      class="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50 transition-all duration-300"
      @click="showEmailModal = false">
      <div
        class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-4 sm:p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02]"
        @click.stop>
        <div class="flex items-center mb-4 sm:mb-6">
          <i class="fas fa-envelope text-blue-600 text-xl sm:text-2xl mr-3"></i>
          <h3 class="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
            Send Rejection Email
          </h3>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Venue Owner's Email</label>
            <input type="email" v-model="selectedRequest.owner" readonly
              class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rejection Reason</label>
            <textarea v-model="rejectionReason" rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Please provide a reason for rejecting this venue request..."></textarea>
          </div>
        </div>
        <div class="flex justify-end space-x-2 sm:space-x-4 mt-6">
          <button @click="showEmailModal = false"
            class="px-3 sm:px-6 py-2 sm:py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 font-medium"
            :disabled="isSubmitting">
            Cancel
          </button>
          <button @click="sendRejectionEmailAndReject"
            class="px-3 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center"
            :disabled="!rejectionReason || isSubmitting">
            <template v-if="isSubmitting">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <span>Processing...</span>
            </template>
            <template v-else>
              <i class="fas fa-paper-plane mr-2"></i>
              <span>Send & Reject</span>
            </template>
          </button>
        </div>
      </div>
    </div>

    <!-- Request Details Modal -->
    <div v-if="showRequestModal"
      class="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50 transition-all duration-300"
      @click="showRequestModal = false">
      <div
        class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-4 sm:p-8 max-w-4xl w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02] overflow-y-auto max-h-[90vh]"
        @click.stop>
        <div class="flex items-center justify-between mb-6 cursor-pointer">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white cursor-pointer">
            More Details
          </h3>
          <button @click="showRequestModal = false"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- Venue Details Section -->
        <div class="mb-8">
          <h4 class="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
            Venue Details Section:
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div>
                <h5 class="font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Basic Information
                </h5>
                <div class="space-y-2">
                  <p class="text-gray-600 dark:text-gray-300">
                    <span class="font-medium">Venue Name:</span>
                    {{ selectedRequest.venueName }}
                  </p>
                  <p class="text-gray-600 dark:text-gray-300">
                    <span class="font-medium">Owner Email:</span>
                    {{ selectedRequest.owner }}
                  </p>
                  <p class="text-gray-600 dark:text-gray-300">
                    <span class="font-medium">Category:</span>
                    {{ selectedRequest.category }}
                  </p>
                  <p class="text-gray-600 dark:text-gray-300">
                    <span class="font-medium">Price:</span>
                    {{ selectedRequest.price }} EGP
                  </p>
                  <p class="text-gray-600 dark:text-gray-300">
                    <span class="font-medium">Location:</span>
                    {{ selectedRequest.address.street }},
                    {{ selectedRequest.address.city }},
                    {{ selectedRequest.address.governorate }}
                  </p>
                </div>
              </div>
            </div>
            <div class="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div>
                <h5 class="font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Description
                </h5>
                <p class="text-gray-600 dark:text-gray-300 text-sm mb-2">
                  {{ selectedRequest.shortDescription }}
                </p>
                <p class="text-gray-600 dark:text-gray-300 text-sm">
                  {{ selectedRequest.longDescription }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Required Documents Section -->
        <div class="mb-8">
          <h4 class="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
            Required Documents
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Dynamic License Section -->
            <template v-if="selectedRequest.category === 'Medical'">
              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h5 class="font-medium text-gray-800 dark:text-gray-200 mb-3">
                  Medical License
                </h5>
                <div
                  class="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <img v-if="selectedRequest.medicalLicense" :src="selectedRequest.medicalLicense" alt="Medical License"
                    class="w-full h-full object-cover cursor-pointer"
                    @click="openImageModal(selectedRequest.medicalLicense)" @error="handleImageError" loading="lazy" />
                  <div v-else class="flex items-center justify-center h-full text-gray-500">
                    <i class="fas fa-file-medical text-3xl"></i>
                  </div>
                </div>
              </div>
              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h5 class="font-medium text-gray-800 dark:text-gray-200 mb-3">
                  Clinic License
                </h5>
                <div
                  class="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <img v-if="selectedRequest.clinicLicense" :src="selectedRequest.clinicLicense" alt="Clinic License"
                    class="w-full h-full object-cover cursor-pointer"
                    @click="openImageModal(selectedRequest.clinicLicense)" @error="handleImageError" loading="lazy" />
                  <div v-else class="flex items-center justify-center h-full text-gray-500">
                    <i class="fas fa-clinic-medical text-3xl"></i>
                  </div>
                </div>
              </div>
            </template>

            <template v-else-if="selectedRequest.category === 'Educational'">
              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h5 class="font-medium text-gray-800 dark:text-gray-200 mb-3">
                  Educational Center License
                </h5>
                <div
                  class="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <img v-if="selectedRequest.educationalLicense" :src="selectedRequest.educationalLicense"
                    :alt="EducationalCenterLicense" class="w-full h-full object-cover cursor-pointer"
                    @click="openImageModal(selectedRequest.educationalLicense)" @error="handleImageError"
                    loading="lazy" />
                  <div v-else class="flex items-center justify-center h-full text-gray-500">
                    <i class="fas fa-file-alt text-3xl"></i>
                  </div>
                </div>
              </div>
            </template>

            <template v-else-if="selectedRequest.category === 'Stadium'">
              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h5 class="font-medium text-gray-800 dark:text-gray-200 mb-3">
                  Stadium License
                </h5>
                <div
                  class="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <img v-if="selectedRequest.sportOrganizationLicense" :src="selectedRequest.sportOrganizationLicense"
                    :alt="EducationalCenterLicense" class="w-full h-full object-cover cursor-pointer" @click="
                      openImageModal(selectedRequest.sportOrganizationLicense)
                      " @error="handleImageError" loading="lazy" />
                  <div v-else class="flex items-center justify-center h-full text-gray-500">
                    <i class="fas fa-file-alt text-3xl"></i>
                  </div>
                </div>
              </div>
            </template>

            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h5 class="font-medium text-gray-800 dark:text-gray-200 mb-3">
                Government ID
              </h5>
              <div
                class="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <img v-if="selectedRequest.govID" :src="selectedRequest.govID" alt="Government ID"
                  class="w-full h-full object-cover cursor-pointer" @click="openImageModal(selectedRequest.govID)"
                  @error="handleImageError" loading="lazy" />
                <div v-else class="flex items-center justify-center h-full text-gray-500">
                  <i class="fas fa-id-card text-3xl"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Venue Images Section -->
        <div class="mb-8">
          <h4 class="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
            Venue Images
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="(image, index) in selectedRequest.pictures" :key="index"
              class="bg-white dark:bg-gray-800 p-2 rounded-lg shadow group hover:shadow-lg transition-shadow duration-300">
              <div class="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img :src="image" :alt="`Venue Image ${index + 1}`"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  @click="openImageModal(image, selectedRequest.pictures)" @error="handleImageError" loading="lazy" />
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-4">
          <button @click="handleRejectFromDetails(selectedRequest)"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
            Reject
          </button>
          <button @click="acceptRequest(selectedRequest)"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
            Accept
          </button>
        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <div v-if="showImageModal"
      class="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50 transition-all duration-300"
      @click="showImageModal = false">
      <div
        class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-4 sm:p-8 max-w-4xl w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02]"
        @click.stop>
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">
            Image Preview
          </h3>
          <button @click="showImageModal = false"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <div class="relative">
          <img :src="currentImage" alt="Preview" class="w-full h-auto max-h-[70vh] object-contain rounded-lg" />
          <button v-if="imageList.length > 1" @click="prevImage"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/50 dark:bg-gray-800/50 p-2 rounded-full shadow-md hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors duration-200">
            <i class="fas fa-chevron-left text-xl"></i>
          </button>
          <button v-if="imageList.length > 1" @click="nextImage"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/50 dark:bg-gray-800/50 p-2 rounded-full shadow-md hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors duration-200">
            <i class="fas fa-chevron-right text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import {
  getDatabase,
  ref as dbRef,
  get,
  set,
  remove,
  update,
} from "firebase/database";
import { getAuth } from "firebase/auth";

export default {
  data() {
    return {
      isSubmitting: false,
      showImageModal: false,
      currentImage: "",
      imageList: [],
      currentImageIndex: 0,
      showRejectModal: false,
      showEmailModal: false,
      rejectionReason: "",
      selectedRequest: null,
    };
  },
  setup() {
    const sidebarOpen = ref(false);
    const showRoleModal = ref(false);
    const showDeleteModal = ref(false);
    const showRequestModal = ref(false);
    const showApproveModal = ref(false);
    const showRejectModal = ref(false);
    const selectedUser = ref(null);
    const selectedRequest = ref(null);
    const users = ref([]);
    const requests = ref([]);

    onMounted(() => {
      window.addEventListener("resize", closeSidebarOnMobile);
    });

    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value;
    };

    const closeSidebarOnMobile = () => {
      if (window.innerWidth < 768) {
        sidebarOpen.value = false;
      }
    };

    const toggleUserRole = (user) => {
      selectedUser.value = user;
      showRoleModal.value = true;
    };

    const deleteUser = (user) => {
      selectedUser.value = user;
      showDeleteModal.value = true;
    };

    const confirmRoleChange = async () => {
      try {
        const db = getDatabase();
        await update(dbRef(db, `users/${selectedUser.value.uid}`), {
          isAdmin: !selectedUser.value.isAdmin,
        });
        selectedUser.value.isAdmin = !selectedUser.value.isAdmin;
        showRoleModal.value = false;
      } catch (error) {
        console.error("Error updating user role:", error);
      }
    };

    const confirmDelete = async () => {
      try {
        const db = getDatabase();
        await remove(dbRef(db, `users/${selectedUser.value.uid}`));
        users.value = users.value.filter(
          (u) => u.uid !== selectedUser.value.uid
        );
        showDeleteModal.value = false;
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    };

    const showRequestDetails = (request) => {
      selectedRequest.value = request;
      showRequestModal.value = true;
    };

    const approveRequestConfirm = (request) => {
      selectedRequest.value = request;
      showApproveModal.value = true;
    };

    const rejectRequestConfirm = (request) => {
      selectedRequest.value = request;
      showRejectModal.value = true;
    };

    const acceptRequest = async (request) => {
      try {
        const db = getDatabase();
        // Move the request to approved venues
        await set(dbRef(db, `venues/${request.id}`), {
          ...request,
          status: "approved",
        });
        // Remove from pending requests
        await remove(dbRef(db, `requests/${request.id}`));

        // Create notification for the venue owner
        const notification = {
          id: Date.now().toString(),
          message: "venue_approved",
          params: { venueName: request.venueName },
          timestamp: new Date().toISOString(),
          read: false,
          type: "venue_approval",
        };
        await set(
          dbRef(
            db,
            `users/${request.ownerId}/notifications/${notification.id}`
          ),
          notification
        );

        requests.value = requests.value.filter((r) => r.id !== request.id);
        showRequestModal.value = false;
        showApproveModal.value = false;
      } catch (error) {
        console.error("Error accepting request:", error);
      }
    };

    const rejectRequest = async (request) => {
      try {
        const db = getDatabase();
        await remove(dbRef(db, `requests/${request.id}`));

        // Create notification for the venue owner
        const notification = {
          id: Date.now().toString(),
          message: "venue_rejected",
          params: { venueName: this.selectedRequest.venueName },
          timestamp: new Date().toISOString(),
          read: false,
          type: "venue_rejection",
        };
        await set(
          dbRef(
            db,
            `users/${request.ownerId}/notifications/${notification.id}`
          ),
          notification
        );

        requests.value = requests.value.filter((r) => r.id !== request.id);
        showRequestModal.value = false;
        showRejectModal.value = false;
      } catch (error) {
        console.error("Error rejecting request:", error);
      }
    };

    onMounted(async () => {
      try {
        const db = getDatabase();
        const auth = getAuth();

        // Fetch users
        const usersSnapshot = await get(dbRef(db, "users"));
        if (usersSnapshot.exists()) {
          const usersData = usersSnapshot.val();
          users.value = Object.keys(usersData).map((key) => ({
            uid: key,
            ...usersData[key],
          }));
        }

        // Fetch requests
        const requestsSnapshot = await get(dbRef(db, "requests"));
        if (requestsSnapshot.exists()) {
          const requestsData = requestsSnapshot.val();
          requests.value = await Promise.all(
            Object.keys(requestsData).map(async (key) => {
              const request = requestsData[key];
              // Get image URLs from Firebase Storage
              const images = request.pictures || [];
              const licenseDoc = request.licenseDocument || "";
              const ownerIdImg = request.ownerIdImage || "";

              // Fetch owner's email from users data
              const ownerData = users.value.find(
                (user) => user.uid === request.ownerId
              );
              const ownerEmail = ownerData ? ownerData.email : "";

              return {
                id: key,
                ...request,
                images: images,
                licenseDocument: licenseDoc,
                ownerIdImage: ownerIdImg,
                ownerEmail: ownerEmail,
              };
            })
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    });

    return {
      sidebarOpen,
      showRoleModal,
      showDeleteModal,
      showRequestModal,
      showApproveModal,
      showRejectModal,
      selectedUser,
      selectedRequest,
      users,
      requests,
      toggleSidebar,
      closeSidebarOnMobile,
      toggleUserRole,
      deleteUser,
      confirmRoleChange,
      confirmDelete,
      showRequestDetails,
      approveRequestConfirm,
      rejectRequestConfirm,
      acceptRequest,
      rejectRequest,
    };
  },
  methods: {
    async handleRejectFromDetails(request) {
      this.selectedRequest = request;
      this.showRequestModal = false; // Close the details modal
      this.showEmailModal = true; // Open the email modal directly
    },
    openImageModal(image, images = []) {
      this.currentImage = image;
      this.imageList = images.length ? images : [image];
      this.currentImageIndex = this.imageList.indexOf(image);
      this.showImageModal = true;
    },
    prevImage() {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.imageList.length) %
        this.imageList.length;
      this.currentImage = this.imageList[this.currentImageIndex];
    },
    nextImage() {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.imageList.length;
      this.currentImage = this.imageList[this.currentImageIndex];
    },
    handleImageError(event) {
      // Remove the src attribute and add a background color
      event.target.removeAttribute("src");
      event.target.style.backgroundColor = "#eeeeee";
      event.target.style.display = "flex";
      event.target.style.alignItems = "center";
      event.target.style.justifyContent = "center";
      event.target.innerHTML =
        '<span style="color: #999999;">Image Not Available</span>';
      event.target.classList.add("error-image");
    },
    async handleReject(request) {
      this.selectedRequest = request;
      this.showRejectModal = true;
    },

    async sendRejectionEmailAndReject() {
      if (!this.rejectionReason) {
        alert("Please provide a rejection reason");
        return;
      }

      this.isSubmitting = true; /// Start loading

      try {
        const db = getDatabase();

        // Create notification for the venue owner before deleting the request
        const notification = {
          id: Date.now().toString(),
          message: "venue_rejected",
          params: { venueName: this.selectedRequest.venueName },
          timestamp: new Date().toISOString(),
          read: false,
          type: "venue_rejection",
        };

        // Save notification to the user's notifications collection
        await set(
          dbRef(
            db,
            `users/${this.selectedRequest.ownerId}/notifications/${notification.id}`
          ),
          notification
        );

        console.log("Notification created for venue owner");

        // Delete the request from Firebase
        await remove(dbRef(db, `requests/${this.selectedRequest.id}`));

        try {
          // Then send the rejection email
          const response = await fetch("/api/send-rejection-email",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                to: this.selectedRequest.ownerEmail,
                subject: `Venue Request Rejected - ${this.selectedRequest.venueName}`,
                message: this.rejectionReason,
              }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Email sending failed:", errorData.message);
          } else {
            console.log("Email sent successfully");
          }
        } catch (emailError) {
          console.error("Error sending email:", emailError);

        }

        // Update local state to remove the request
        this.requests = this.requests.filter(
          (req) => req.id !== this.selectedRequest.id
        );

        // Reset form and close modals
        this.rejectionReason = "";
        this.showEmailModal = false;
        this.showRejectModal = false;
        this.showRequestModal = false;
        this.selectedRequest = null;

        console.log("Request rejected successfully");
      } catch (error) {
        console.error("Error processing rejection:", error);
        alert("Failed to process rejection");
      } finally {
        this.isSubmitting = false; // Stop loading regardless of outcome
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}

.error-image {
  min-height: 200px;
  border-radius: 8px;
  object-fit: cover;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none !important;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
