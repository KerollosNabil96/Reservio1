<template>
  <div class="container-fluid my-5 dark:bg-gray-800 dark:my-0 dark:py-5">
    <div class="form-container dark:bg-gray-900 dark:text-gray-100">
      <h2 class="title font-bold text-2xl mb-3">
        Register Your <span class="highlight">Venue</span>
      </h2>

      <form @submit.prevent="submitForm">
        <!-- Venue Name -->
        <div class="form-group">
          <label>Venue Name</label>
          <input
            type="text"
            v-model="venueName"
            placeholder="Venue name"
            required
          />
        </div>

        <div class="form-group">
          <label>Venue Address</label>
          <input
            type="text"
            v-model="venueAddress"
            placeholder="Venue address"
            required
          />
        </div>

        <div class="row">
          <div class="form-group">
            <label>City</label>
            <select v-model="selectedCity" @change="updateAreas" required>
              <option disabled value="" class="text-gray-900">Select a City</option>
              <option v-for="(areas, city) in cities" :key="city" :value="city" class="text-gray-900">
                {{ city }}
              </option>
            </select>
          </div>
          <div class="form-group">
  <label>Area</label>
  <select v-model="selectedArea" :disabled="!selectedCity" required>
    <option disabled value="" class="text-gray-900">Select an Area</option>
    <option v-for="area in cities[selectedCity] || []" :key="area" :value="area" class="text-gray-900">
      {{ area }}
    </option>
  </select>
</div>
          <div class="form-group">
            <label>Zip Code</label>
            <input
              type="text"
              v-model="zipCode"
              placeholder="Zip Code"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label>Venue Phone Number</label>
          <input
            type="tel"
            v-model="phoneNumber"
            placeholder="Venue phone number"
            required
          />
        </div>

        <div class="form-group">
          <label>Government ID</label>
          <input type="file" @change="uploadID" required />
        </div>

        <div class="form-group">
          <label>Category</label>
          <select v-model="category" required>
            <option disabled value="" class="text-gray-900">
              Select your category
            </option>
            <option
              v-for="cat in categories"
              :key="cat"
              :value="cat"
              class="text-gray-900"
            >
              {{ cat }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Venue Images (Upload 3 images)</label>
          <input
            type="file"
            multiple
            @change="uploadImages"
            accept="image/*"
            required
          />
        </div>

        <div class="image-preview">
          <div
            v-for="(img, index) in venueImages"
            :key="index"
            class="image-box"
          >
            <img :src="img" alt="Venue Image" />
          </div>
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea
            v-model="description"
            placeholder="Tell us about your venue..."
            required
          ></textarea>
        </div>

        <button type="submit" :disabled="venueImages.length !== 3">Next</button>
      </form>
      <div :class="{ layer: true, hidden: !isVisible }">
        <div class="parent flex justify-center items-center">
          <div class="popUp flex justify-center items-center">
            <div class="data">
              <p class="font-bold text-gray-600">
                Please upload exactly 3 images.
              </p>
              <button class="myBtn mt-4 ms-21" @click="isVisible = false">
                X
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isVisible: false,
      venueName: "",
      venueAddress: "",
      selectedCity: "",
      selectedArea: "",
      zipCode: "",
      phoneNumber: "",
      category: "",
      categories: ["Stadium", "Medical", "Event Hall", "Gym"],
      venueImages: [],
      description: "",
      cities: {
  "Cairo": ["Nasr City", "Heliopolis", "Maadi", "Zamalek", "New Cairo", "Shubra", "Downtown", "El Marg", "Ain Shams", "Helwan", "Fifth Settlement"],
  "Alexandria": ["Smouha", "Stanley", "Gleem", "Bolkly", "Miami","Sedi Beshr", "Sidi Gaber", "Sporting", "Bacchus", "Al Agamy", "Mandara", "Montazah"],
  "Giza": ["Dokki", "Mohandeseen", "6th of October", "Sheikh Zayed", "Haram", "Faisal", "Imbaba", "Agouza", "Boulak El Dakrour"],
  "Port Said": ["Al-Ganayen", "Al-Zohour", "Al-Manakh", "Port Fouad", "El Arab", "El Shark"],
  "Suez": ["Arbaeen", "Ataka", "Faisal", "Ganayen", "Suez"],
  "Ismailia": ["Al-Qantara", "Fayed", "Tell El Kebir", "El Tal El Kabir", "Abu Suwayr"],
  "Sharkia": ["Zagazig", "10th of Ramadan", "Bilbeis", "Abu Hammad", "Minya El-Qamh", "Kafr Saqr", "El-Hussainia"],
  "Dakahlia": ["Mansoura", "Mit Ghamr", "Talkha", "Sherbin", "Belqas", "Nabaroh", "Aga"],
  "Beheira": ["Damanhur", "Kafr El Dawwar", "Rashid", "Abu Hummus", "Edku", "Shubrakhit", "Kom Hamada"],
  "Menoufia": ["Shibin El Kom", "Menouf", "Ashmoun", "Sadat City", "Tala", "Birket El Sab"],
  "Gharbia": ["Tanta", "El Mahalla El Kubra", "Zefta", "Kafr El Zayat", "Samannoud"],
  "Kafr El Sheikh": ["Kafr El Sheikh", "Desouk", "Biyala", "Sidi Salem", "Baltim", "Fuwah"],
  "Fayoum": ["Fayoum", "Ibshaway", "Sinnuris", "Tamiya", "Youssef El Seddik"],
  "Beni Suef": ["Beni Suef", "Al Wasta", "Biba", "Naser", "Ehnasia"],
  "Minya": ["Minya", "Mallawi", "Samalut", "Maghagha", "Bani Mazar"],
  "Asyut": ["Asyut", "Dairut", "Manfalut", "Abnoub", "Al Qusiyah"],
  "Sohag": ["Sohag", "Akhmim", "Girga", "Tahta", "Al Balina"],
  "Qena": ["Qena", "Luxor", "Abu Tesht", "Nag Hammadi", "Dishna"],
  "Luxor": ["Luxor", "Armant", "Esna", "New Tiba"],
  "Aswan": ["Aswan", "Edfu", "Kom Ombo", "Drau"],
  "Red Sea": ["Hurghada", "Safaga", "El Quseir", "Marsa Alam"],
  "New Valley": ["Kharga", "Dakhla", "Farafra", "Balat"],
  "Matrouh": ["Marsa Matruh", "Siwa", "Sidi Barrani", "El Dabaa"],
  "North Sinai": ["Arish", "Sheikh Zuweid", "Rafah", "Bir El Abd"],
  "South Sinai": ["Sharm El Sheikh", "Dahab", "Nuweiba", "Taba", "Tor"],
}
    };
  },
  methods: {
    updateAreas() {
      this.selectedArea = "";
    },
    uploadImages(event) {
      const files = event.target.files;
      if (files.length !== 3) {
        this.isVisible = true;
        return;
      }
      this.isVisible = false;
      this.venueImages = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.venueImages.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    },
    submitForm() {
      if (this.venueImages.length !== 3) {
        alert("Please upload 3 venue images.");
        return;
      }
      console.log("Form Data:", this.$data);
    }
  }
};
</script>


<style scoped>
.form-container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
}

.highlight {
  color: blue;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.row .form-group {
  flex: 1;
}

input,
select,
textarea {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
}

.image-preview {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.image-box img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ddd;
}

button {
  width: 100%;
  padding: 10px;
  background-color: blue;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background-color: gray;
  cursor: not-allowed;
}
.container-fluid {
  position: relative;
}

.layer {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.479);
  top: 0px;
  left: 0px;
}
textarea {
  resize: none !important;
  height: 100px;
}
.myBtn {
  width: 50px;
  background-color: red;
}
.popUp {
  width: 400px;
  height: 150px;
  background-color: white;
  border-radius: 15px;
}
.parent {
  height: 100%;
}
</style>
