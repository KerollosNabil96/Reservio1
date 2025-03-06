<template>
  <div class="flex flex-col md:flex-row h-screen bg-gray-100 dark:bg-gray-900">
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
            Change User Role
          </h3>
        </div>
        <p
          class="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed"
        >
          Are you sure you want to change
          <span class="font-semibold text-blue-600 dark:text-blue-400">{{
            selectedUser.name
          }}</span
          >'s role from
          <span class="font-semibold">{{
            selectedUser.isAdmin ? "Admin to User" : "User to Admin"
          }}</span
          >?
        </p>
        <div class="flex justify-end space-x-2 sm:space-x-4">
          <button
            @click="showRoleModal = false"
            class="px-3 sm:px-6 py-2 sm:py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            @click="confirmRoleChange()"
            class="px-3 sm:px-6 py-2 sm:py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
          >
            Confirm Change
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
          <h3 class="text-lg sm:text-xl font-bold text-red-600">Delete User</h3>
        </div>
        <p
          class="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed"
        >
          Are you sure you want to delete
          <span class="font-semibold text-red-600">{{ selectedUser.name }}</span
          >?
          <br />
          <span class="text-sm text-red-500 mt-2 block"
            >This action cannot be undone.</span
          >
        </p>
        <div class="flex justify-end space-x-2 sm:space-x-4">
          <button
            @click="showDeleteModal = false"
            class="px-3 sm:px-6 py-2 sm:py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete()"
            class="px-3 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transform hover:scale-105 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center"
          >
            <i class="fas fa-trash-alt mr-2"></i>
            Delete User
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Toggle Button -->
    <div
      class="md:hidden bg-white dark:bg-gray-800 p-4 flex justify-between items-center shadow-md"
    >
      <h1 class="text-xl font-bold text-blue-600 dark:text-blue-400">
        Admin Dashboard
      </h1>
      <button
        @click="toggleSidebar"
        class="text-gray-700 dark:text-gray-300 focus:outline-none"
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
          Admin Dashboard
        </h1>
      </div>
      <ul class="space-y-2 p-4">
        <li>
          <RouterLink
            to="/dashboard"
            class="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
            :class="{
              'bg-blue-50 dark:bg-blue-900/30': $route.path === '/dashboard',
            }"
            @click="closeSidebarOnMobile"
          >
            <i class="fas fa-users mr-3"></i>
            Users
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/requests"
            class="flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
            :class="{
              'bg-blue-50 dark:bg-blue-900/30': $route.path === '/requests',
            }"
            @click="closeSidebarOnMobile"
          >
            <i class="fas fa-clipboard-list mr-3"></i>
            Requests Details
          </RouterLink>
        </li>
      </ul>
    </nav>

    <!-- Main Content -->
    <div class="flex-1 p-4 md:p-8 overflow-auto dark:bg-gray-900">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
        <h2
          class="text-xl md:text-2xl font-semibold mb-4 md:mb-6 dark:text-white"
        >
          Users Management
        </h2>
        <div class="overflow-x-auto">
          <table
            class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
          >
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  class="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  class="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  class="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Actions
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
                    {{ user.isAdmin ? "Admin" : "User" }}
                  </span>
                </td>
                <td
                  class="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium"
                >
                  <button
                    @click="toggleUserRole(user)"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-2 md:mr-4 p-1 md:p-0"
                    :title="user.isAdmin ? 'Make User' : 'Make Admin'"
                  >
                    <i class="fas fa-user-shield text-base md:text-lg"></i>
                  </button>
                  <button
                    @click="deleteUser(user)"
                    class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 md:p-0"
                    title="Delete User"
                  >
                    <i class="fas fa-trash text-base md:text-lg"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { db, ref as dbRef, onValue, update, remove } from "@/firebase";
import store from "@/store/store";
import { useRouter } from "vue-router";

export default {
  name: "Dashboard",
  setup() {
    const router = useRouter();
    const users = ref([]);
    const showRoleModal = ref(false);
    const showDeleteModal = ref(false);
    const selectedUser = ref(null);
    const sidebarOpen = ref(false);

    const fetchUsers = () => {
      const usersRef = dbRef(db, "users/");
      onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          users.value = Object.entries(data).map(([username, userData]) => ({
            ...userData,
            username,
          }));
        }
      });
    };

    const toggleUserRole = (user) => {
      selectedUser.value = user;
      showRoleModal.value = true;
    };

    const confirmRoleChange = async () => {
      try {
        await update(dbRef(db, `users/${selectedUser.value.username}`), {
          isAdmin: !selectedUser.value.isAdmin,
        });
        console.log(
          `User role updated successfully for ${selectedUser.value.name}`
        );
        showRoleModal.value = false;
      } catch (error) {
        console.error("Error updating user role:", error);
      }
    };

    const deleteUser = (user) => {
      selectedUser.value = user;
      showDeleteModal.value = true;
    };

    const confirmDelete = async () => {
      try {
        await remove(dbRef(db, `users/${selectedUser.value.username}`));
        console.log("User deleted successfully");
        showDeleteModal.value = false;
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    };

    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value;
    };

    const closeSidebarOnMobile = () => {
      if (window.innerWidth < 768) {
        sidebarOpen.value = false;
      }
    };

    onMounted(() => {
      if (!store.state.user?.isAdmin) {
        router.push("/");
        return;
      }
      fetchUsers();
    });

    return {
      users,
      toggleUserRole,
      deleteUser,
      showRoleModal,
      showDeleteModal,
      selectedUser,
      confirmRoleChange,
      confirmDelete,
      sidebarOpen,
      toggleSidebar,
      closeSidebarOnMobile,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
