<template>
  <div>
    <h1>Item List</h1>
    <input v-model="newItem" placeholder="Add new item" class="border-1" />
    <button @click="addItem">Add Item</button>
    <button @click="fetchItems">Show items</button>

    <h1 v-if="isLoading">Loading...</h1>
    <ul v-else-if="items.length > 0">
      <li v-for="item in items" :key="item.id" class="p-1 text-red-500">
        {{ item.name }}
        <button
          class="bg-red-500 p-1 px-2 text-white hover:cursor-pointer rounded-md ms-5"
          @click="deleteItem(item.id)"
        >
          Delete
        </button>
      </li>
    </ul>
    <h1 v-else>No items were found</h1>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "ItemList",
  data() {
    return { newItem: "", items: [], isLoading: false };
  },
  methods: {
    async addItem() {
      await axios.post(
        "https://grad-project-e2365-default-rtdb.europe-west1.firebasedatabase.app/items.json",
        {
          itemName: this.newItem,
        }
      );
      this.newItem = ""; // Clear input
      this.fetchItems();
    },
    async fetchItems() {
      this.isLoading = true;
      const response = await axios.get(
        "https://grad-project-e2365-default-rtdb.europe-west1.firebasedatabase.app/items.json"
      );
      const dataArray = [];
      for (const key in response.data) {
        dataArray.push({
          id: key, // Store Firebase ID
          name: response.data[key].itemName,
        });
      }
      this.items = dataArray;
      this.isLoading = false;
    },
    async deleteItem(id) {
      await axios.delete(
        `https://grad-project-e2365-default-rtdb.europe-west1.firebasedatabase.app/items/${id}.json`
      ); // Correct endpoint
      this.fetchItems(); // Refresh the list
    },
  },
  created() {
    this.fetchItems();
  },
};
</script>
