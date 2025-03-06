<template>
  <div
    class="max-w-2xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md my-8 dark:bg-gray-900 dark:text-gray-200"
  >
    <h2 class="text-xl font-semibold text-blue-600 mb-4">Account Settings</h2>

    <div class="bg-white p-4 rounded-md shadow mb-4 dark:bg-gray-800">
      <h3 class="text-lg font-medium dark:text-white">Profile Information</h3>
      <div class="mt-2 space-y-2">
        <input
          v-model="profile.fullName"
          type="text"
          placeholder="Full Name"
          class="input-field"
        />
        <input
          v-model="profile.phone"
          type="text"
          placeholder="Phone Number"
          class="input-field"
        />
        <button @click="updateProfile" class="btn">Update Profile</button>
        <div
          v-if="profileMessage"
          class="mt-4 p-2 text-center"
          :class="profileMessageClass"
        >
          {{ profileMessage }}
        </div>
      </div>
    </div>

    <div class="bg-white p-4 rounded-md shadow mb-4 dark:bg-gray-800">
      <h3 class="text-lg font-medium dark:text-white">Change Password</h3>
      <div class="mt-2 space-y-2">
        <input
          v-model="password.current"
          type="password"
          placeholder="Current Password"
          class="input-field"
        />
        <input
          v-model="password.new"
          type="password"
          placeholder="New Password"
          class="input-field"
        />
        <input
          v-model="password.confirm"
          type="password"
          placeholder="Confirm New Password"
          class="input-field"
        />
        <button @click="changePassword" class="btn">Change Password</button>
        <div v-if="message" class="mt-4 p-2 text-center" :class="messageClass">
          {{ message }}
        </div>
      </div>
    </div>

    <div class="bg-white p-4 rounded-md shadow dark:bg-gray-800">
      <h3 class="text-lg font-medium dark:text-white">
        Notification Preferences
      </h3>
      <div class="mt-2 space-y-2">
        <label class="flex items-center space-x-2">
          <input
            v-model="notifications.email"
            type="checkbox"
            class="checkbox"
          />
          <span class="dark:text-gray-300">Send notifications by email</span>
        </label>
        <label class="flex items-center space-x-2">
          <input
            v-model="notifications.digests"
            type="checkbox"
            class="checkbox"
          />
          <span class="dark:text-gray-300">Activity digests</span>
        </label>
        <label class="flex items-center space-x-2">
          <input
            v-model="notifications.promotions"
            type="checkbox"
            class="checkbox"
          />
          <span class="dark:text-gray-300">Product tips and news</span>
        </label>
        <button @click="savePreferences" class="btn">Save Preferences</button>
        <div
          v-if="preferencesMessage"
          class="mt-4 p-2 text-center"
          :class="preferencesMessageClass"
        >
          {{ preferencesMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db, auth, ref, set, get } from "@/firebase";
import store from "@/store/store";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { update } from "firebase/database";

export default {
  data() {
    return {
      profile: {
        fullName: "",
        email: "",
        phone: "",
      },
      password: {
        current: "",
        new: "",
        confirm: "",
      },
      notifications: {
        email: true,
        digests: false,
        promotions: false,
      },
      preferencesMessage: "",
      preferencesMessageClass: "",
      profileMessage: "",
      profileMessageClass: "",
      message: "",
      messageClass: "",
    };
  },
  methods: {
    async updateProfile() {
      const user = auth.currentUser;

      if (!user) {
        this.profileMessage = "No user is logged in!";
        this.profileMessageClass = "text-red-500";
        return;
      }

      const newName = this.profile.fullName.trim();
      const newPhone = this.profile.phone.trim();
      const username = this.$store.state.user?.username;

      if (!username) {
        this.profileMessage = "Username not found!";
        this.profileMessageClass = "text-red-500";
        return;
      }

      if (newPhone) {
        const phoneRegex = /^(011|012|015|010)\d{8}$/;
        if (!phoneRegex.test(newPhone)) {
          this.profileMessage =
            "Phone number must be 11 digits and start with 011, 012, or 015!";
          this.profileMessageClass = "text-red-500";
          return;
        }
      }

      try {
        await update(ref(db, "users/" + store.state.user.id), {
          name: newName,
          phone: newPhone,
        });

        this.$store.commit("updateUserName", newName);
        this.$store.commit("updateUserPhone", newPhone);

        this.profileMessage = "Profile updated successfully!";
        this.profileMessageClass = "text-green-500";
      } catch (error) {
        console.error("Error updating profile:", error);
        this.profileMessage = "Error updating profile.";
        this.profileMessageClass = "text-red-500";
      }
    },
    async changePassword() {
      if (this.password.new !== this.password.confirm) {
        this.message = "Passwords do not match!";
        this.messageClass = "text-red-500";
        return;
      }

      try {
        const user = auth.currentUser;

        if (!user) {
          this.message = "No user is currently logged in!";
          this.messageClass = "text-red-500";
          return;
        }
        console.log("User UID:", user.uid);
        const credential = EmailAuthProvider.credential(
          user.email,
          this.password.current
        );

        await reauthenticateWithCredential(user, credential);

        await updatePassword(user, this.password.new);

        this.message = "Password updated successfully!";
        this.messageClass = "text-green-500";
      } catch (error) {
        console.error("Error:", error);
        if (error.code === "auth/wrong-password") {
          this.message = "Current password is incorrect!";
          this.messageClass = "text-red-500";
        } else {
          this.message = `An error occurred: ${error.message}`;
          this.messageClass = "text-red-500";
        }
      }
    },

    async savePreferences() {
      const user = auth.currentUser;

      if (!user) {
        this.preferencesMessage = "No user is logged in!";
        this.preferencesMessageClass = "text-red-500";
        return;
      }

      try {
        await set(ref(db, "users/" + user.uid + "/preferences"), {
          email: this.notifications.email,
          digests: this.notifications.digests,
          promotions: this.notifications.promotions,
        });

        this.preferencesMessage = "Preferences saved successfully!";
        this.preferencesMessageClass = "text-green-500";
      } catch (error) {
        console.error("Error saving preferences:", error);
        this.preferencesMessage = "Error saving preferences.";
        this.preferencesMessageClass = "text-red-500";
      }
    },

    async loadPreferences() {
      const user = auth.currentUser;

      if (user) {
        const preferencesRef = ref(db, "users/" + user.uid + "/preferences");
        const snapshot = await get(preferencesRef);

        if (snapshot.exists()) {
          const preferences = snapshot.val();
          this.notifications.email = preferences.email || true;
          this.notifications.digests = preferences.digests || false;
          this.notifications.promotions = preferences.promotions || false;
        }
      }
    },
    async loadProfile() {
      const user = auth.currentUser;

      if (user) {
        const profileRef = ref(db, "users/" + user.uid);
        const snapshot = await get(profileRef);

        if (snapshot.exists()) {
          const profileData = snapshot.val();
          this.profile.fullName = profileData.fullName || "";
          this.profile.phone = profileData.phone || "";
        }
      }
    },
  },

  created() {
    this.loadPreferences();
    this.loadProfile();
  },
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
