<template>
  <div class="wallet-container bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-10">
    <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6">Your Wallet</h1>

    <!-- Wallet Balance Card -->
    <div
      class="wallet-card bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between mb-8">
      <div>
        <h2 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">Current Balance</h2>
        <p class="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mt-2">{{ balance }} EGP
        </p>
      </div>
    </div>

    <!-- Filter and Transaction History -->
    <div class="transaction-history bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
      <div class="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200">Transaction History</h2>
        <select v-model="filterType"
          class="mt-2 sm:mt-0 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
          <option value="all">All</option>
          <option value="booking">Booking</option>
          <option value="registration">Registration</option>
          <option value="earnings">Earnings</option>
        </select>
      </div>
      <div v-if="filteredTransactions.length === 0" class="text-center text-gray-500 dark:text-gray-400">
        No transactions to display.
      </div>
      <div v-else>
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
              <th class="py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base">Date</th>
              <th class="py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base">Description</th>
              <th class="py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base">Amount</th>
              <th class="py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base">Type</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in paginatedTransactions" :key="transaction.id"
              class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <td class="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm break-words">{{ formatDate(transaction.date) }}
              </td>
              <td class="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm break-words">{{ transaction.description }}</td>
              <td class="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold break-words"
                :class="transaction.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                {{ transaction.amount > 0 ? '+' : '' }}{{ transaction.amount }} EGP
              </td>
              <td class="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm break-words">
                <span
                  :class="transaction.type === 'booking' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : transaction.type === 'registration' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'"
                  class="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                  {{ transaction.type === 'booking' ? 'Booking' : transaction.type === 'registration' ? 'Registration' :
                    'Earnings' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div class="flex justify-between items-center mt-4">
        <button @click="prevPage" :disabled="currentPage === 1"
          class="cursor-pointer px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-600"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
          Previous
        </button>
        <span class="text-gray-700 dark:text-gray-300">Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="cursor-pointer px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-600"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { getDatabase, ref as dbRef, onValue } from "firebase/database";

export default {
  data() {
    return {
      balance: 0, // Initialize balance
      transactions: [], // Initialize transactions array
      filterType: "all", // Filter type
      currentPage: 1,
      itemsPerPage: 10, // Number of items per page
    };
  },
  computed: {
    filteredTransactions() {
      if (this.filterType === "all") {
        return this.transactions;
      }
      return this.transactions.filter((transaction) => transaction.type === this.filterType);
    },
    paginatedTransactions() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredTransactions.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
    },
  },
  methods: {
    formatDate(date) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    fetchTransactions() {
      const db = getDatabase();
      const userId = this.$store.state.user?.id;
      const userEmail = this.$store.state.user?.email;

      if (!userId || !userEmail) {
        console.error("User not authenticated");
        return;
      }

      // Fetch user bookings
      const bookingsRef = dbRef(db, `users/${userId}/bookings`);
      onValue(bookingsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const walletBookings = Object.keys(data)
            .map((key) => ({
              id: key,
              ...data[key],
            }))
            .filter((booking) => booking.method === "wallet") // Filter bookings made by wallet
            .map((booking) => ({
              id: booking.id,
              date: booking.date,
              description: `Booking for ${booking.venue.venueName}`,
              amount: -booking.price, // Deducted from wallet
              type: "booking",
            }));

          this.transactions = [...this.transactions, ...walletBookings];
        }
      });

      // Fetch venue registrations
      const venuesRef = dbRef(db, `venues`);
      onValue(venuesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const userRegistrations = Object.keys(data)
            .map((key) => ({
              id: key,
              ...data[key],
            }))
            .filter((venue) => venue.ownerEmail === userEmail) // Filter venues registered by the user
            .map((venue) => ({
              id: venue.id,
              date: venue.selectedDate,
              description: `Registration for ${venue.venueName}`,
              amount: -venue.price, // Deducted from wallet
              type: "registration",
            }));

          this.transactions = [...this.transactions, ...userRegistrations];
        }
      });

      // Fetch earnings from bookings made on user's venues
      const allBookingsRef = dbRef(db, `bookings`);
      onValue(allBookingsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const earnings = Object.keys(data)
            .map((key) => ({
              id: key,
              ...data[key],
            }))
            .filter((booking) => booking.venue.ownerEmail === userEmail) // Filter bookings for venues owned by the user
            .map((booking) => ({
              id: booking.id,
              date: booking.date,
              description: `Earnings from booking for ${booking.venue.venueName}`,
              amount: booking.price, // Add to wallet
              type: "earnings",
            }));

          this.transactions = [...this.transactions, ...earnings];
        }
      });

      // Fetch user balance
      const balanceRef = dbRef(db, `users/${userId}/balance`);
      onValue(balanceRef, (snapshot) => {
        this.balance = snapshot.val() || 0;
      });
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
  },
  mounted() {
    this.fetchTransactions();
  },
};
</script>

<style scoped>
.wallet-container {
  max-width: 1200px;
  margin: 0 auto;
}

.wallet-balance-card {
  background: linear-gradient(135deg, #ffffff, #f9fafb);
}

.transaction-history table {
  border-spacing: 0;
}

.transaction-history th,
.transaction-history td {
  padding: 0.5rem 0.75rem;
  /* Adjusted padding for smaller screens */
  word-wrap: break-word;
  /* Ensure text wraps inside the box */
}

.transaction-history th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  /* Smaller font size for mobile */
}

.transaction-history td {
  font-size: 0.75rem;
  /* Smaller font size for mobile */
}

.transaction-history tr:hover {
  transition: background-color 0.2s ease-in-out;
}

@media (min-width: 640px) {

  .transaction-history th,
  .transaction-history td {
    font-size: 0.875rem;
    /* Larger font size for tablets and above */
  }
}
</style>
