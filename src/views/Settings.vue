<template>
    <div class="max-w-2xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md my-8 dark:bg-gray-900">
      <h2 class="text-xl font-semibold text-blue-600 mb-4">Account Settings</h2>
      
      <!-- Profile Information -->
      <div class="bg-white p-4 rounded-md shadow mb-4 dark:bg-gray-800">
        <h3 class="text-lg font-medium dark:text-white">Profile Information</h3>
        <div class="mt-2 space-y-2">
          <input v-model="profile.fullName" type="text" placeholder="Full Name" class="input-field" />
          <input v-model="profile.email" type="email" placeholder="Email Address" class="input-field" />
          <input v-model="profile.phone" type="text" placeholder="Phone Number" class="input-field" />
          <button @click="updateProfile" class="btn">Update Profile</button>
        </div>
      </div>
      
      <!-- Change Password -->
      <div class="bg-white p-4 rounded-md shadow mb-4 dark:bg-gray-800">
        <h3 class="text-lg font-medium dark:text-white">Change Password</h3>
        <div class="mt-2 space-y-2">
          <input v-model="password.current" type="password" placeholder="Current Password" class="input-field" />
          <input v-model="password.new" type="password" placeholder="New Password" class="input-field" />
          <input v-model="password.confirm" type="password" placeholder="Confirm New Password" class="input-field" />
          <button @click="changePassword" class="btn ">Change Password</button>
        </div>
      </div>
      
      <!-- Notification Preferences -->
      <div class="bg-white p-4 rounded-md shadow  dark:bg-gray-800">
        <h3 class="text-lg font-medium dark:text-white">Notification Preferences</h3>
        <div class="mt-2 space-y-2">
          <label class="flex items-center space-x-2">
            <input v-model="notifications.email" type="checkbox" class="checkbox" />
            <span class="dark:text-gray-300">Send notifications by email</span>
          </label>
          <label class="flex items-center space-x-2">
            <input v-model="notifications.digests" type="checkbox" class="checkbox" />
            <span class="dark:text-gray-300">Activity digests</span>
          </label>
          <label class="flex items-center space-x-2">
            <input v-model="notifications.promotions" type="checkbox" class="checkbox" />
            <span class="dark:text-gray-300">Product tips and news</span>
          </label>
          <button @click="savePreferences" class="btn">Save Preferences</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        profile: {
          fullName: '',
          email: '',
          phone: ''
        },
        password: {
          current: '',
          new: '',
          confirm: ''
        },
        notifications: {
          email: true,
          digests: false,
          promotions: false
        }
      };
    },
    methods: {
      updateProfile() {
        console.log("Profile updated", this.profile);
      },
      changePassword() {
        if (this.password.new !== this.password.confirm) {
          alert("Passwords do not match!");
          return;
        }
        console.log("Password changed", this.password);
      },
      savePreferences() {
        console.log("Preferences saved", this.notifications);
      }
    }
  };
  </script>
  
  <style scoped>
  .input-field {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  .btn {
    background-color: #3b82f6;
    color: white;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
  }
  .btn:hover {
    background-color: #2563eb;
  }
  .checkbox {
    width: 16px;
    height: 16px;
  }
  </style>
  