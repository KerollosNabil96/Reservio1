<template>
  <div
    class="wallet-container bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-10"
  >
    <h1
      class="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6"
    >
      {{ $t("wallet.title") }}
    </h1>

    <!-- Wallet Balance Card -->
    <div
      class="wallet-card bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between mb-8"
    >
      <div>
        <h2
          class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white"
        >
          {{ $t("wallet.currentBalance") }}
        </h2>
        <p
          class="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mt-2"
        >
          {{ formattedBalance }} {{ $t("egp") }}
        </p>
      </div>
    </div>

    <!-- Filter and Transaction History -->
    <div
      class="transaction-history bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6"
    >
      <div class="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2
          class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200"
        >
          {{ $t("wallet.transactionHistory") }}
        </h2>
        <select
          v-model="filterType"
          class="mt-2 sm:mt-0 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="all">{{ $t("wallet.filterAll") }}</option>
          <option value="booking">{{ $t("wallet.filterBooking") }}</option>
          <option value="registration">
            {{ $t("wallet.filterRegistration") }}
          </option>
          <option value="earnings">{{ $t("wallet.filterEarnings") }}</option>
          <option value="refund">{{ $t("wallet.filterRefunds") }}</option>
        </select>
      </div>
      <div
        v-if="filteredTransactions.length === 0"
        class="text-center text-gray-500 dark:text-gray-400"
      >
        {{ $t("wallet.noTransactions") }}
      </div>
      <div v-else>
        <table class="w-full text-left border-collapse">
          <thead>
            <tr
              class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
            >
              <th class="py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base">
                {{ $t("wallet.tableHeaderDate") }}
              </th>
              <th class="py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base">
                {{ $t("wallet.tableHeaderDescription") }}
              </th>
              <th class="py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base">
                {{ $t("wallet.tableHeaderAmount") }}
              </th>
              <th class="py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base">
                {{ $t("wallet.tableHeaderType") }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="transaction in paginatedTransactions"
              :key="transaction.id"
              class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td
                class="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm break-words"
              >
                {{ formatDate(transaction.date) }}
              </td>
              <td
                class="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm break-words"
              >
                {{ transaction.description }}
              </td>
              <td
                class="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold break-words"
                :class="{
                  'text-green-600 dark:text-green-400':
                    transaction.amount > 0 || transaction.type === 'refund',
                  'text-red-600 dark:text-red-400':
                    transaction.amount < 0 && transaction.type !== 'refund',
                }"
              >
                {{
                  transaction.amount > 0 || transaction.type === "refund"
                    ? "+"
                    : ""
                }}{{ transaction.amount }} {{ $t("egp") }}
              </td>
              <td
                class="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm break-words"
              >
                <span
                  :class="{
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200':
                      transaction.type === 'booking',
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200':
                      transaction.type === 'registration',
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':
                      transaction.type === 'earnings',
                    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200':
                      transaction.type === 'refund',
                  }"
                  class="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                >
                  {{
                    transaction.type === "booking"
                      ? $t("wallet.typeBooking")
                      : transaction.type === "registration"
                      ? $t("wallet.typeRegistration")
                      : transaction.type === "earnings"
                      ? $t("wallet.typeEarnings")
                      : $t("wallet.typeRefund")
                  }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div
        v-if="filteredTransactions.length > 0"
        class="flex justify-between items-center mt-4"
      >
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="cursor-pointer px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
        >
          {{ $t("dashboardView.paginationPrevious") }}
        </button>
        <span class="text-gray-700 dark:text-gray-300">{{
          $t("dashboardView.paginationPageInfo", {
            currentPage: currentPage,
            totalPages: totalPages,
          })
        }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="cursor-pointer px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="{
            'opacity-50 cursor-not-allowed': currentPage === totalPages,
          }"
        >
          {{ $t("dashboardView.paginationNext") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { getDatabase, ref as dbRef, onValue } from "firebase/database";
import { useI18n } from "vue-i18n";

export default {
  setup() {
    const { t, locale } = useI18n();
    return { t, locale };
  },
  data() {
    return {
      balance: 0,
      transactions: [],
      filterType: "all",
      currentPage: 1,
      itemsPerPage: 10,
      unsubscribeCallbacks: [],
    };
  },
  computed: {
    formattedBalance() {
      const numBalance = Number(this.balance);
      if (isNaN(numBalance)) {
        return "0.00"; // Default or error state
      }
      return numBalance.toFixed(2); // Format to 2 decimal places
    },
    filteredTransactions() {
      const sorted = [...this.transactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      return this.filterType === "all"
        ? sorted
        : sorted.filter((t) => t.type === this.filterType);
    },
    paginatedTransactions() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredTransactions.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
    },
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString(this.locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    async fetchTransactions() {
      const db = getDatabase();
      const userId = this.$store.state.user?.id;
      const userEmail = this.$store.state.user?.email;

      if (!userId || !userEmail) {
        console.error("User not authenticated");
        return;
      }

      this.cleanupListeners();

      // Fetch user balance
      const balanceRef = dbRef(db, `users/${userId}/balance`);
      this.unsubscribeCallbacks.push(
        onValue(balanceRef, (snapshot) => {
          this.balance = snapshot.val() || 0;
        })
      );

      // Fetch bookings
      const bookingsRef = dbRef(db, `users/${userId}/bookings`);
      this.unsubscribeCallbacks.push(
        onValue(bookingsRef, (snapshot) => {
          const data = snapshot.val();
          this.transactions = this.transactions.filter(
            (t) => t.type !== "booking"
          );
          if (data) {
            const walletBookings = Object.keys(data)
              .map((key) => ({ id: key, ...data[key] }))
              .filter((booking) => booking.method === "wallet")
              .map((booking) => ({
                id: booking.id,
                date: booking.date,
                description: this.t("wallet.descBooking", {
                  venueName:
                    booking.venue?.venueName ||
                    this.t("wallet.descUnknownVenue"),
                }),
                amount: -Math.abs(booking.price || 0),
                type: "booking",
              }));
            this.transactions = [...this.transactions, ...walletBookings];
          }
        })
      );

      // Fetch venue registrations
      const venuesRef = dbRef(db, `venues`);
      this.unsubscribeCallbacks.push(
        onValue(venuesRef, (snapshot) => {
          const data = snapshot.val();
          this.transactions = this.transactions.filter(
            (t) => t.type !== "registration"
          );
          if (data) {
            const userRegistrations = Object.keys(data)
              .map((key) => ({ id: key, ...data[key] }))
              .filter((venue) => venue.ownerEmail === userEmail)
              .map((venue) => ({
                id: venue.id,
                date: venue.selectedDate || new Date().toISOString(),
                description: this.t("wallet.descRegistration", {
                  venueName:
                    venue.venueName || this.t("wallet.descUnknownVenue"),
                }),
                amount: -Math.abs(venue.price || 0),
                type: "registration",
              }));
            this.transactions = [...this.transactions, ...userRegistrations];
          }
        })
      );

      // Fetch earnings
      const allBookingsRef = dbRef(db, `bookings`);
      this.unsubscribeCallbacks.push(
        onValue(allBookingsRef, (snapshot) => {
          const data = snapshot.val();
          this.transactions = this.transactions.filter(
            (t) => t.type !== "earnings"
          );
          if (data) {
            const earnings = Object.keys(data)
              .map((key) => ({ id: key, ...data[key] }))
              .filter((booking) => booking.venue?.ownerEmail === userEmail)
              .map((booking) => ({
                id: booking.id,
                date: booking.date,
                description: this.t("wallet.descEarnings", {
                  venueName:
                    booking.venue?.venueName ||
                    this.t("wallet.descUnknownVenue"),
                }),
                amount: Math.abs(booking.price || 0),
                type: "earnings",
              }));
            this.transactions = [...this.transactions, ...earnings];
          }
        })
      );

      // Fetch refund transactions from the dedicated transactions node
      const transactionsRef = dbRef(db, `users/${userId}/transactions`);
      this.unsubscribeCallbacks.push(
        onValue(transactionsRef, (snapshot) => {
          const data = snapshot.val();
          this.transactions = this.transactions.filter(
            (t) => t.type !== "refund"
          );
          if (data) {
            const refunds = Object.keys(data)
              .map((key) => ({ id: key, ...data[key] }))
              .filter((t) => t.type === "refund")
              .map((refund) => ({
                id: refund.id,
                date: refund.timestamp || new Date().toISOString(),
                description:
                  refund.description || this.t("wallet.descGenericRefund"),
                amount: Math.abs(refund.amount || 0),
                type: "refund",
              }));
            this.transactions = [...this.transactions, ...refunds];
          }
        })
      );
    },
    cleanupListeners() {
      this.unsubscribeCallbacks.forEach((unsubscribe) => unsubscribe());
      this.unsubscribeCallbacks = [];
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
  },
  watch: {
    // Reset pagination when filter changes
    filterType() {
      this.currentPage = 1;
    },
    // Reset pagination when filtered transactions change
    filteredTransactions: {
      handler() {
        if (this.currentPage > this.totalPages && this.totalPages > 0) {
          this.currentPage = this.totalPages;
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.fetchTransactions();
  },
  beforeUnmount() {
    this.cleanupListeners();
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
  word-wrap: break-word;
}

.transaction-history th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
}

.transaction-history td {
  font-size: 0.75rem;
}

.transaction-history tr:hover {
  transition: background-color 0.2s ease-in-out;
}

@media (min-width: 640px) {
  .transaction-history th,
  .transaction-history td {
    font-size: 0.875rem;
  }
}
</style>
