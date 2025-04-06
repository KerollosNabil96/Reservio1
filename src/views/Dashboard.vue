<template>
  <div>
    <div
      class="flex flex-col md:flex-row h-screen bg-gray-100 dark:bg-gray-900"
    >
      <!-- Role Change Modal -->
      <div
        v-if="showRoleModal"
        class="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50 transition-all duration-300"
        @click="showRoleModal = false"
      >
        <div
          class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-4 sm:p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02]"
          @click.stop
        >
          <div class="flex items-center mb-4 sm:mb-6">
            <i
              class="fas fa-user-shield text-blue-600 dark:text-blue-400 text-xl sm:text-2xl mr-3"
            ></i>
            <h3
              class="text-lg sm:text-xl font-bold text-gray-800 dark:text-white"
            >
              {{ $t("dashboardAdmin.roleModalTitle") }}
            </h3>
          </div>
          <p
            class="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed"
          >
            {{
              $t("dashboardAdmin.roleModalConfirm", {
                userName: selectedUser.name,
                currentRole: selectedUser.isAdmin
                  ? $t("dashboardAdmin.userRoleAdmin")
                  : $t("dashboardAdmin.userRoleUser"),
                newRole: selectedUser.isAdmin
                  ? $t("dashboardAdmin.userRoleUser")
                  : $t("dashboardAdmin.userRoleAdmin"),
              })
            }}
          </p>
          <div class="flex justify-end space-x-2 sm:space-x-4">
            <button
              @click="showRoleModal = false"
              class="cursor-pointer px-3 sm:px-6 py-2 sm:py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 font-medium"
            >
              {{ $t("userVenues.cancelBtn") }}
            </button>
            <button
              @click="confirmRoleChange()"
              class="cursor-pointer px-3 sm:px-6 py-2 sm:py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              {{ $t("dashboardAdmin.roleModalBtnConfirm") }}
            </button>
          </div>
        </div>
      </div>

      <!-- Delete User Modal -->
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50 transition-all duration-300"
        @click="showDeleteModal = false"
      >
        <div
          class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-4 sm:p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02]"
          @click.stop
        >
          <div class="flex items-center mb-4 sm:mb-6">
            <i
              class="fas fa-exclamation-triangle text-red-600 text-xl sm:text-2xl mr-3"
            ></i>
            <h3 class="text-lg sm:text-xl font-bold text-red-600">
              {{ $t("dashboardAdmin.deleteUserModalTitle") }}
            </h3>
          </div>
          <p
            class="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed"
          >
            {{
              $t("dashboardAdmin.deleteUserModalConfirm", {
                userName: selectedUser.name,
              })
            }}
            <br />
            <span class="text-sm text-red-500 mt-2 block">{{
              $t("dashboardAdmin.deleteUserModalWarning")
            }}</span>
          </p>
          <div class="flex justify-end space-x-2 sm:space-x-4">
            <button
              @click="showDeleteModal = false"
              class="cursor-pointer px-3 sm:px-6 py-2 sm:py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 font-medium"
            >
              {{ $t("userVenues.cancelBtn") }}
            </button>
            <button
              @click="confirmDelete()"
              class="cursor-pointer px-3 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transform hover:scale-105 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center"
            >
              <i class="fas fa-trash-alt mr-2"></i>
              {{ $t("dashboardAdmin.deleteUserModalBtnDelete") }}
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Toggle Button -->
      <div
        class="md:hidden bg-white dark:bg-gray-800 p-4 flex justify-between items-center shadow-md"
      >
        <h1 class="text-xl font-bold text-blue-600 dark:text-blue-400">
          {{ $t("dashboardAdmin.mobileTitle") }}
        </h1>
        <button
          @click="toggleSidebar"
          class="cursor-pointer text-gray-700 dark:text-gray-300 focus:outline-none"
        >
          <i class="fas fa-bars text-xl"></i>
        </button>
      </div>

      <!-- Side Navigation -->
      <nav
        :class="[
          sidebarOpen ? 'block' : 'hidden',
          'md:block w-full md:w-64 bg-white dark:bg-gray-800 shadow-lg',
        ]"
      >
        <div class="p-6 hidden md:block">
          <h1 class="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {{ $t("dashboardAdmin.desktopTitle") }}
          </h1>
        </div>
        <ul class="space-y-2 p-4">
          <li>
            <RouterLink
              to="/dashboard"
              class="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
              :class="{
                'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300':
                  !$route.query.tab,
              }"
              @click="closeSidebarOnMobile"
            >
              <i
                class="fas fa-users mr-3"
                :class="[$i18n.locale === 'ar' ? 'ml-3' : 'mr-3']"
              ></i>
              {{ $t("dashboardAdmin.usersLink") }}
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/dashboard?tab=requests"
              class="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
              :class="{
                'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300':
                  $route.query.tab === 'requests',
              }"
              @click="closeSidebarOnMobile"
            >
              <i
                class="fas fa-clipboard-list mr-3"
                :class="[$i18n.locale === 'ar' ? 'ml-3' : 'mr-3']"
              ></i>
              {{ $t("dashboardAdmin.requestsLink") }}
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/dashboard?tab=analytics"
              class="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
              :class="{
                'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300':
                  $route.query.tab === 'analytics',
              }"
              @click="closeSidebarOnMobile"
            >
              <i
                class="fas fa-chart-pie mr-3"
                :class="[$i18n.locale === 'ar' ? 'ml-3' : 'mr-3']"
              ></i>
              {{ $t("dashboardAdmin.analyticsLink") }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <!-- Main Content -->
      <div class="flex-1 p-4 md:p-8 overflow-auto dark:bg-gray-900">
        <!-- Users Management Section -->
        <div
          v-if="$route.path === '/dashboard' && !$route.query.tab"
          class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 transition-opacity duration-300"
        >
          <h2
            class="text-xl md:text-2xl font-semibold mb-4 md:mb-6 dark:text-white"
          >
            {{ $t("dashboardAdmin.usersManagementTitle") }}
          </h2>
          <div class="overflow-x-auto">
            <table
              class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
            >
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    class="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    :class="[
                      $i18n.locale === 'ar' ? 'text-right' : 'text-left',
                    ]"
                  >
                    {{ $t("dashboardAdmin.tableHeaderName") }}
                  </th>
                  <th
                    class="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    :class="[
                      $i18n.locale === 'ar' ? 'text-right' : 'text-left',
                    ]"
                  >
                    {{ $t("dashboardAdmin.tableHeaderRole") }}
                  </th>
                  <th
                    class="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    :class="[
                      $i18n.locale === 'ar' ? 'text-right' : 'text-left',
                    ]"
                  >
                    {{ $t("dashboardAdmin.tableHeaderActions") }}
                  </th>
                </tr>
              </thead>
              <tbody
                class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
              >
                <tr v-for="user in users" :key="user.email">
                  <td class="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div>
                        <div
                          class="text-xs md:text-sm font-medium text-gray-900 dark:text-white"
                        >
                          {{ user.name }}
                        </div>
                        <div
                          class="text-xs md:text-sm text-gray-500 dark:text-gray-400"
                        >
                          {{ user.email }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="
                        user.isAdmin
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                          : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      "
                    >
                      {{
                        user.isAdmin
                          ? $t("dashboardAdmin.userRoleAdmin")
                          : $t("dashboardAdmin.userRoleUser")
                      }}
                    </span>
                  </td>
                  <td
                    class="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium"
                  >
                    <button
                      @click="toggleUserRole(user)"
                      class="cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-2 md:mr-4 p-1 md:p-0"
                      :title="
                        user.isAdmin
                          ? $t('dashboardAdmin.actionMakeUser')
                          : $t('dashboardAdmin.actionMakeAdmin')
                      "
                    >
                      <i class="fas fa-user-shield text-base md:text-lg"></i>
                    </button>
                    <button
                      @click="deleteUser(user)"
                      class="cursor-pointer text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 md:p-0"
                      :title="$t('dashboardAdmin.actionDeleteUser')"
                    >
                      <i class="fas fa-trash text-base md:text-lg"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Requests Details Section -->
        <div
          v-if="$route.path === '/dashboard' && $route.query.tab === 'requests'"
          class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6"
        >
          <h2
            class="text-xl md:text-2xl font-semibold mb-4 md:mb-6 dark:text-white"
          >
            {{ $t("dashboardAdmin.requestsTitle") }}
          </h2>
          <div class="overflow-x-auto">
            <table
              class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
            >
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    class="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    :class="[
                      $i18n.locale === 'ar' ? 'text-right' : 'text-left',
                    ]"
                  >
                    {{ $t("dashboardAdmin.tableHeaderOwner") }}
                  </th>
                  <th
                    class="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    :class="[
                      $i18n.locale === 'ar' ? 'text-right' : 'text-left',
                    ]"
                  >
                    {{ $t("dashboardAdmin.tableHeaderBusinessName") }}
                  </th>
                  <th
                    class="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    :class="[
                      $i18n.locale === 'ar' ? 'text-right' : 'text-left',
                    ]"
                  >
                    {{ $t("dashboardAdmin.tableHeaderBusinessDetails") }}
                  </th>
                  <th
                    class="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    :class="[
                      $i18n.locale === 'ar' ? 'text-right' : 'text-left',
                    ]"
                  >
                    {{ $t("dashboardAdmin.tableHeaderReqAction") }}
                  </th>
                </tr>
              </thead>
              <tbody
                class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
              >
                <tr v-for="request in requests" :key="request.id">
                  <td class="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap">
                    <div
                      class="text-xs md:text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {{ request.owner }}
                    </div>
                  </td>
                  <td class="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap">
                    <div
                      class="text-xs md:text-sm text-gray-900 dark:text-white"
                    >
                      {{ request.venueName }}
                    </div>
                  </td>
                  <td class="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap">
                    <button
                      @click="showRequestDetails(request)"
                      class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 cursor-pointer"
                    >
                      {{ $t("dashboardAdmin.moreDetailsBtn") }}
                    </button>
                  </td>
                  <td
                    class="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium"
                  >
                    <button
                      @click="approveRequestConfirm(request)"
                      class="cursor-pointer text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 mr-2 md:mr-4"
                      :class="[
                        $i18n.locale === 'ar' ? 'ml-2 md:ml-4' : 'mr-2 md:mr-4',
                      ]"
                      :title="$t('dashboardAdmin.actionApproveRequest')"
                    >
                      <i class="fas fa-check text-base md:text-lg"></i>
                    </button>
                    <button
                      @click="rejectRequestConfirm(request)"
                      class="cursor-pointer text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      :title="$t('dashboardAdmin.actionRejectRequest')"
                    >
                      <i class="fas fa-times text-base md:text-lg"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Analytics Section -->
        <div
          v-if="
            $route.path === '/dashboard' && $route.query.tab === 'analytics'
          "
          class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6"
        >
          <h2
            class="text-xl md:text-2xl font-semibold mb-4 md:mb-6 dark:text-white"
          >
            {{ $t("dashboardAdmin.analyticsTitle") }}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UserStats
              :total-users="users.length"
              :admin-count="adminCount"
              :regular-user-count="regularUserCount"
            />
            <PieChart />
            <LineChart />
            <BarChart />
          </div>
        </div>
      </div>
    </div>

    <!-- Approve Request Confirmation Modal -->
    <div
      v-if="showApproveModal"
      class="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50 transition-all duration-300"
      @click="showApproveModal = false"
    >
      <div
        class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-4 sm:p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02]"
        @click.stop
      >
        <div class="flex items-center mb-4 sm:mb-6">
          <i
            class="fas fa-check-circle text-green-600 dark:text-green-400 text-xl sm:text-2xl mr-3"
          ></i>
          <h3
            class="text-lg sm:text-xl font-bold text-gray-800 dark:text-white"
          >
            {{ $t("dashboardAdmin.approveModalTitle") }}
          </h3>
        </div>
        <p
          class="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed"
        >
          {{
            $t("dashboardAdmin.approveModalConfirm", {
              venueName: selectedRequest?.venueName,
            })
          }}
        </p>
        <div class="flex justify-end space-x-2 sm:space-x-4">
          <button
            @click="showApproveModal = false"
            class="cursor-pointer px-3 sm:px-6 py-2 sm:py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 font-medium"
          >
            {{ $t("userVenues.cancelBtn") }}
          </button>
          <button
            @click="acceptRequest(selectedRequest)"
            class="cursor-pointer px-3 sm:px-6 py-2 sm:py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transform hover:scale-105 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
          >
            {{ $t("dashboardAdmin.approveModalBtnApprove") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Reject Request Confirmation Modal -->
    <div
      v-if="showRejectModal"
      class="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50 transition-all duration-300"
      @click="showRejectModal = false"
    >
      <div
        class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-4 sm:p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02]"
        @click.stop
      >
        <div class="flex items-center mb-4 sm:mb-6">
          <i
            class="fas fa-times-circle text-red-600 text-xl sm:text-2xl mr-3"
          ></i>
          <h3 class="text-lg sm:text-xl font-bold text-red-600">
            {{ $t("dashboardAdmin.rejectModalTitle") }}
          </h3>
        </div>
        <p
          class="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed"
        >
          {{
            $t("dashboardAdmin.rejectModalConfirm", {
              venueName: selectedRequest?.venueName,
            })
          }}
          <br />
          <span class="text-sm text-red-500 mt-2 block">{{
            $t("dashboardAdmin.deleteUserModalWarning")
          }}</span>
        </p>
        <div class="flex justify-end space-x-2 sm:space-x-4">
          <button
            @click="showRejectModal = false"
            class="cursor-pointer px-3 sm:px-6 py-2 sm:py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 font-medium"
          >
            {{ $t("userVenues.cancelBtn") }}
          </button>
          <button
            @click="
              showEmailModal = true;
              showRejectModal = false;
            "
            class="cursor-pointer px-3 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transform hover:scale-105 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center"
          >
            <i class="fas fa-times mr-2"></i>
            {{ $t("dashboardAdmin.rejectModalBtnReject") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Email Rejection Reason Modal -->
    <div
      v-if="showEmailModal"
      class="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50 transition-all duration-300"
      @click="showEmailModal = false"
    >
      <div
        class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-4 sm:p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02]"
        @click.stop
      >
        <div class="flex items-center mb-4 sm:mb-6">
          <i class="fas fa-envelope text-blue-600 text-xl sm:text-2xl mr-3"></i>
          <h3
            class="text-lg sm:text-xl font-bold text-gray-800 dark:text-white"
          >
            {{ $t("dashboardAdmin.emailModalTitle") }}
          </h3>
        </div>
        <div class="space-y-4">
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >{{ $t("dashboardAdmin.emailModalOwnerLabel") }}</label
            >
            <input
              type="email"
              v-model="selectedRequest.owner"
              readonly
              class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            />
          </div>
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >{{ $t("dashboardAdmin.emailModalReasonLabel") }}</label
            >
            <textarea
              v-model="rejectionReason"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              :placeholder="$t('dashboardAdmin.emailModalReasonPlaceholder')"
            ></textarea>
          </div>
        </div>
        <div class="flex justify-end space-x-2 sm:space-x-4 mt-6">
          <button
            @click="showEmailModal = false"
            class="cursor-pointer px-3 sm:px-6 py-2 sm:py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 font-medium"
            :disabled="isSubmitting"
          >
            {{ $t("userVenues.cancelBtn") }}
          </button>
          <button
            @click="sendRejectionEmailAndReject"
            class="px-3 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center"
            :disabled="!rejectionReason || isSubmitting"
          >
            <template v-if="isSubmitting">
              <svg
                class="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>{{ $t("dashboardAdmin.processing") }}</span>
            </template>
            <template v-else>
              <i class="fas fa-paper-plane mr-2"></i>
              <span>{{ $t("dashboardAdmin.emailModalBtnSendReject") }}</span>
            </template>
          </button>
        </div>
      </div>
    </div>

    <!-- Request Details Modal -->
    <div
      v-if="showRequestModal"
      class="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50 transition-all duration-300"
      @click="showRequestModal = false"
    >
      <div
        class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-4 sm:p-8 max-w-4xl w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02] overflow-y-auto max-h-[90vh]"
        @click.stop
      >
        <div class="flex items-center justify-between mb-6 cursor-pointer">
          <h3
            class="text-xl font-bold text-gray-800 dark:text-white cursor-pointer"
          >
            {{ $t("dashboardAdmin.requestDetailsModalTitle") }}
          </h3>
          <button
            @click="showRequestModal = false"
            class="ursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- Venue Details Section -->
        <div class="mb-8">
          <h4
            class="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4"
          >
            {{ $t("dashboardAdmin.requestDetailsVenueSection") }}
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              class="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
            >
              <div>
                <h5 class="font-medium text-gray-800 dark:text-gray-200 mb-2">
                  {{ $t("dashboardAdmin.requestDetailsBasicInfo") }}
                </h5>
                <div class="space-y-2">
                  <p class="text-gray-600 dark:text-gray-300">
                    <span class="font-medium"
                      >{{ $t("dashboardAdmin.requestDetailsVenueName") }}:</span
                    >
                    {{ selectedRequest.venueName }}
                  </p>
                  <p class="text-gray-600 dark:text-gray-300">
                    <span class="font-medium"
                      >{{
                        $t("dashboardAdmin.requestDetailsOwnerEmail")
                      }}:</span
                    >
                    {{ selectedRequest.owner }}
                  </p>
                  <p class="text-gray-600 dark:text-gray-300">
                    <span class="font-medium"
                      >{{ $t("dashboardAdmin.requestDetailsCategory") }}:</span
                    >
                    {{ selectedRequest.category }}
                  </p>
                  <p class="text-gray-600 dark:text-gray-300">
                    <span class="font-medium"
                      >{{ $t("dashboardAdmin.requestDetailsPrice") }}:</span
                    >
                    {{ selectedRequest.price }} {{ $t("egp") }}
                  </p>
                  <p class="text-gray-600 dark:text-gray-300">
                    <span class="font-medium"
                      >{{ $t("dashboardAdmin.requestDetailsLocation") }}:</span
                    >
                    {{ selectedRequest.address.street }},
                    {{ selectedRequest.address.city }},
                    {{ selectedRequest.address.governorate }}
                  </p>
                </div>
              </div>
            </div>
            <div
              class="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
            >
              <div>
                <h5 class="font-medium text-gray-800 dark:text-gray-200 mb-2">
                  {{ $t("dashboardAdmin.requestDetailsDescription") }}
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
          <h4
            class="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4"
          >
            {{ $t("dashboardAdmin.requestDetailsDocsSection") }}
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Dynamic License Section -->
            <template v-if="selectedRequest.category === 'Medical'">
              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h5 class="font-medium text-gray-800 dark:text-gray-200 mb-3">
                  {{ $t("dashboardAdmin.requestDetailsMedicalLicense") }}
                </h5>
                <div
                  class="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    v-if="selectedRequest.medicalLicense"
                    :src="selectedRequest.medicalLicense"
                    alt="Medical License"
                    class="w-full h-full object-cover cursor-pointer"
                    @click="openImageModal(selectedRequest.medicalLicense)"
                    @error="handleImageError"
                    loading="lazy"
                  />
                  <div
                    v-else
                    class="flex items-center justify-center h-full text-gray-500"
                  >
                    <i class="fas fa-file-medical text-3xl"></i>
                  </div>
                </div>
              </div>
              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h5 class="font-medium text-gray-800 dark:text-gray-200 mb-3">
                  {{ $t("dashboardAdmin.requestDetailsClinicLicense") }}
                </h5>
                <div
                  class="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    v-if="selectedRequest.clinicLicense"
                    :src="selectedRequest.clinicLicense"
                    alt="Clinic License"
                    class="w-full h-full object-cover cursor-pointer"
                    @click="openImageModal(selectedRequest.clinicLicense)"
                    @error="handleImageError"
                    loading="lazy"
                  />
                  <div
                    v-else
                    class="flex items-center justify-center h-full text-gray-500"
                  >
                    <i class="fas fa-clinic-medical text-3xl"></i>
                  </div>
                </div>
              </div>
            </template>

            <template v-else-if="selectedRequest.category === 'Educational'">
              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h5 class="font-medium text-gray-800 dark:text-gray-200 mb-3">
                  {{ $t("dashboardAdmin.requestDetailsEduLicense") }}
                </h5>
                <div
                  class="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    v-if="selectedRequest.educationalLicense"
                    :src="selectedRequest.educationalLicense"
                    :alt="EducationalCenterLicense"
                    class="w-full h-full object-cover cursor-pointer"
                    @click="openImageModal(selectedRequest.educationalLicense)"
                    @error="handleImageError"
                    loading="lazy"
                  />
                  <div
                    v-else
                    class="flex items-center justify-center h-full text-gray-500"
                  >
                    <i class="fas fa-file-alt text-3xl"></i>
                  </div>
                </div>
              </div>
            </template>

            <template v-else-if="selectedRequest.category === 'Stadium'">
              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h5 class="font-medium text-gray-800 dark:text-gray-200 mb-3">
                  {{ $t("dashboardAdmin.requestDetailsStadiumLicense") }}
                </h5>
                <div
                  class="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    v-if="selectedRequest.sportOrganizationLicense"
                    :src="selectedRequest.sportOrganizationLicense"
                    :alt="EducationalCenterLicense"
                    class="w-full h-full object-cover cursor-pointer"
                    @click="
                      openImageModal(selectedRequest.sportOrganizationLicense)
                    "
                    @error="handleImageError"
                    loading="lazy"
                  />
                  <div
                    v-else
                    class="flex items-center justify-center h-full text-gray-500"
                  >
                    <i class="fas fa-file-alt text-3xl"></i>
                  </div>
                </div>
              </div>
            </template>

            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h5 class="font-medium text-gray-800 dark:text-gray-200 mb-3">
                {{ $t("dashboardAdmin.requestDetailsGovId") }}
              </h5>
              <div
                class="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  v-if="selectedRequest.govID"
                  :src="selectedRequest.govID"
                  alt="Government ID"
                  class="w-full h-full object-cover cursor-pointer"
                  @click="openImageModal(selectedRequest.govID)"
                  @error="handleImageError"
                  loading="lazy"
                />
                <div
                  v-else
                  class="flex items-center justify-center h-full text-gray-500"
                >
                  <i class="fas fa-id-card text-3xl"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Venue Images Section -->
        <div class="mb-8">
          <h4
            class="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4"
          >
            {{ $t("dashboardAdmin.requestDetailsImagesSection") }}
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="(image, index) in selectedRequest.pictures"
              :key="index"
              class="bg-white dark:bg-gray-800 p-2 rounded-lg shadow group hover:shadow-lg transition-shadow duration-300"
            >
              <div
                class="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"
              >
                <img
                  :src="image"
                  :alt="
                    $t('dashboardAdmin.requestDetailsImageAlt', {
                      index: index + 1,
                    })
                  "
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  @click="openImageModal(image, selectedRequest.pictures)"
                  @error="handleImageError"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-4">
          <button
            @click="handleRejectFromDetails(selectedRequest)"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            {{ $t("dashboardAdmin.requestDetailsBtnReject") }}
          </button>
          <button
            @click="acceptRequest(selectedRequest)"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            {{ $t("dashboardAdmin.requestDetailsBtnAccept") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <div
      v-if="showImageModal"
      class="fixed inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center z-50 transition-all duration-300"
      @click="showImageModal = false"
    >
      <div
        class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-4 sm:p-8 max-w-4xl w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02]"
        @click.stop
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white">
            {{ $t("dashboardAdmin.imagePreviewModalTitle") }}
          </h3>
          <button
            @click="showImageModal = false"
            class="ursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <div class="relative">
          <img
            :src="currentImage"
            alt="Preview"
            class="w-full h-auto max-h-[70vh] object-contain rounded-lg"
          />
          <button
            v-if="imageList.length > 1"
            @click="prevImage"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/50 dark:bg-gray-800/50 p-2 rounded-full shadow-md hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors duration-200"
          >
            <i class="fas fa-chevron-left text-xl"></i>
          </button>
          <button
            v-if="imageList.length > 1"
            @click="nextImage"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/50 dark:bg-gray-800/50 p-2 rounded-full shadow-md hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors duration-200"
          >
            <i class="fas fa-chevron-right text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  getDatabase,
  ref as dbRef,
  get,
  set,
  remove,
  update,
  runTransaction,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import PieChart from "@/components/PieChart.vue";
import LineChart from "@/components/LineChart.vue";
import BarChart from "@/components/BarChart.vue";
import UserStats from "@/components/UserStats.vue";

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
    const { t } = useI18n();
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
        console.error(t("dashboardAdmin.errorRoleUpdate"), error);
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
        console.error(t("dashboardAdmin.errorUserDelete"), error);
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
        await set(dbRef(db, `venues/${request.id}`), {
          ...request,
          status: "approved",
        });
        await remove(dbRef(db, `requests/${request.id}`));

        const statsRef = dbRef(db, "requestStats");
        const statsSnapshot = await get(statsRef);
        const stats = statsSnapshot.exists()
          ? statsSnapshot.val()
          : { Accepted: 0, Rejected: 0 };
        await set(statsRef, { ...stats, Accepted: stats.Accepted + 1 });

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
        console.error(t("dashboardAdmin.errorRequestAccept"), error);
      }
    };

    const rejectRequest = async (request) => {
      console.log("1. Starting rejectRequest function");

      try {
        const db = getDatabase();
        console.log("2. Database initialized");

        console.log(`3. Attempting to remove request ${request.id}`);
        await remove(dbRef(db, `requests/${request.id}`));
        console.log("4. Request successfully removed");

        console.log("5. Preparing to update requestStats");
        const statsRef = dbRef(db, "requestStats");

        try {
          const transactionResult = await runTransaction(
            statsRef,
            (currentStats) => {
              console.log("6. Inside transaction callback", { currentStats });

              if (!currentStats) {
                console.log("7. Creating new stats record");
                return { Accepted: 0, Rejected: 1 };
              }

              const newRejectedCount = (currentStats.Rejected || 0) + 1;
              console.log(
                `8. Updating Rejected count from ${
                  currentStats.Rejected || 0
                } to ${newRejectedCount}`
              );
              return { ...currentStats, Rejected: newRejectedCount };
            }
          );

          console.log(
            "9. Transaction completed successfully",
            transactionResult
          );
        } catch (transactionError) {
          console.error(t("dashboardAdmin.errorTransaction"), transactionError);
          throw transactionError;
        }

        console.log("11. Creating notification");
        const notification = {
          id: Date.now().toString(),
          message: "venue_rejected",
          params: { venueName: request.venueName },
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
        console.log("12. Notification created");

        requests.value = requests.value.filter((r) => r.id !== request.id);
        showRequestModal.value = false;
        showRejectModal.value = false;
        console.log("13. Local state updated");
      } catch (error) {
        console.error(t("dashboardAdmin.errorRequestReject"), {
          error: error.message,
          stack: error.stack,
          fullError: error,
        });
      }
    };

    onMounted(async () => {
      try {
        const db = getDatabase();
        const auth = getAuth();

        const usersSnapshot = await get(dbRef(db, "users"));
        if (usersSnapshot.exists()) {
          const usersData = usersSnapshot.val();
          users.value = Object.keys(usersData).map((key) => ({
            uid: key,
            ...usersData[key],
          }));
        }

        const requestsSnapshot = await get(dbRef(db, "requests"));
        if (requestsSnapshot.exists()) {
          const requestsData = requestsSnapshot.val();
          requests.value = await Promise.all(
            Object.keys(requestsData).map(async (key) => {
              const request = requestsData[key];
              const images = request.pictures || [];
              const licenseDoc = request.licenseDocument || "";
              const ownerIdImg = request.ownerIdImage || "";

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
        console.error(t("dashboardAdmin.errorDataFetch"), error);
      }
    });

    return {
      t,
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
  components: {
    PieChart,
    LineChart,
    BarChart,
    UserStats,
  },
  computed: {
    adminCount() {
      return this.users.filter((user) => user.isAdmin).length;
    },
    regularUserCount() {
      return this.users.filter((user) => !user.isAdmin).length;
    },
  },
  methods: {
    async handleRejectFromDetails(request) {
      this.selectedRequest = request;
      this.showRequestModal = false;
      this.showEmailModal = true;
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
      event.target.removeAttribute("src");
      event.target.style.backgroundColor = "#eeeeee";
      event.target.style.display = "flex";
      event.target.style.alignItems = "center";
      event.target.style.justifyContent = "center";
      event.target.innerHTML = `<span style="color: #999999;">${this.t(
        "dashboardAdmin.imageNotAvailable"
      )}</span>`;
      event.target.classList.add("error-image");
    },
    async sendRejectionEmailAndReject() {
      if (!this.rejectionReason) {
        alert(this.t("dashboardAdmin.errorEmailReason"));
        return;
      }
      this.isSubmitting = true;
      try {
        const db = getDatabase();

        const statsRef = dbRef(db, "requestStats");
        await runTransaction(statsRef, (currentStats) => {
          if (!currentStats) {
            return { Accepted: 0, Rejected: 1 };
          }
          return {
            ...currentStats,
            Rejected: (currentStats.Rejected || 0) + 1,
          };
        });

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
            `users/${this.selectedRequest.ownerId}/notifications/${notification.id}`
          ),
          notification
        );

        await remove(dbRef(db, `requests/${this.selectedRequest.id}`));

        try {
          await fetch("http://localhost:3000/api/send-rejection-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: this.selectedRequest.ownerEmail,
              subject: `Venue Request Rejected - ${this.selectedRequest.venueName}`,
              message: this.rejectionReason,
            }),
          });
        } catch (emailError) {
          console.error(this.t("dashboardAdmin.errorEmailSend"), emailError);
        }

        this.requests = this.requests.filter(
          (req) => req.id !== this.selectedRequest.id
        );

        this.rejectionReason = "";
        this.showEmailModal = false;
        this.showRejectModal = false;
        this.showRequestModal = false;
        this.selectedRequest = null;
      } catch (error) {
        console.error(this.t("dashboardAdmin.errorRejectionProcess"), error);
        alert(this.t("dashboardAdmin.errorRejectionProcess"));
      } finally {
        this.isSubmitting = false;
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
