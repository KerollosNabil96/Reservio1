<template>
  <div class="cloudinary-uploader">
    <div
      class="upload-area"
      :class="{
        'border-blue-500 bg-blue-50 dark:bg-blue-900/20': isDragging,
        'border-red-500 bg-red-50 dark:bg-red-900/20': error,
      }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleFileDrop"
      @click="triggerFileInput"
    >
      <input
        type="file"
        ref="fileInput"
        class="hidden"
        :accept="acceptedFileTypes"
        @change="handleFileSelect"
      />
      <div class="flex flex-col items-center justify-center p-6">
        <div
          v-if="imageUrl"
          class="relative w-full h-32 mb-3 rounded-lg overflow-hidden"
        >
          <img
            :src="imageUrl"
            alt="Uploaded image"
            class="w-full h-full object-cover"
          />
          <button
            @click.stop="removeImage"
            class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div v-else class="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ uploadText }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Click or drag and drop
          </p>
        </div>
        <div
          v-if="isUploading"
          class="w-full mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"
        >
          <div
            class="bg-blue-600 h-2.5 rounded-full"
            :style="{ width: uploadProgress + '%' }"
          ></div>
        </div>
        <p v-if="error" class="text-sm text-red-500 mt-2">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";

export default {
  name: "CloudinaryUploader",
  props: {
    cloudName: {
      type: String,
      required: true,
    },
    uploadPreset: {
      type: String,
      required: true,
    },
    folder: {
      type: String,
      default: "reservio_uploads",
    },
    value: {
      type: String,
      default: "",
    },
    uploadText: {
      type: String,
      default: "Upload an image",
    },
    acceptedFileTypes: {
      type: String,
      default: "image/*",
    },
  },
  emits: ["update:modelValue", "upload-success", "upload-error", "remove"],
  setup(props, { emit }) {
    const fileInput = ref(null);
    const isDragging = ref(false);
    const isUploading = ref(false);
    const uploadProgress = ref(0);
    const error = ref("");
    const imageUrl = ref(props.value || "");

    const triggerFileInput = () => {
      fileInput.value.click();
    };

    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      if (file) {
        uploadFile(file);
      }
      // Reset the input so the same file can be selected again
      event.target.value = "";
    };

    const handleFileDrop = (event) => {
      isDragging.value = false;
      const file = event.dataTransfer.files[0];
      if (file) {
        uploadFile(file);
      }
    };

    const uploadFile = async (file) => {
      // Check file type
      if (!file.type.startsWith("image/")) {
        error.value = "Please upload an image file";
        return;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        error.value = "File size should not exceed 10MB";
        return;
      }

      error.value = "";
      isUploading.value = true;
      uploadProgress.value = 0;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", props.uploadPreset);
      formData.append("folder", props.folder);

      try {
        // Check if cloudName and uploadPreset are actual values or placeholders
        if (
          !props.cloudName ||
          !props.uploadPreset ||
          props.cloudName === "your_cloud_name" ||
          props.cloudName === "your_cloud_name_here" ||
          props.uploadPreset === "your_upload_preset" ||
          props.uploadPreset === "your_upload_preset_here"
        ) {
          throw new Error(
            "Cloudinary credentials not configured. Please check your .env file."
          );
        }

        // Simulate progress (actual progress tracking requires XMLHttpRequest)
        const progressInterval = setInterval(() => {
          if (uploadProgress.value < 90) {
            uploadProgress.value += 10;
          }
        }, 300);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${props.cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        clearInterval(progressInterval);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
            errorData.error?.message ||
            `Upload failed with status: ${response.status}`;
          throw new Error(errorMessage);
        }

        const data = await response.json();
        uploadProgress.value = 100;

        // Short delay to show 100% progress
        setTimeout(() => {
          isUploading.value = false;
          imageUrl.value = data.secure_url;
          emit("update:modelValue", data.secure_url);
          emit("upload-success", data);
        }, 500);
      } catch (err) {
        console.error("Upload error:", err);
        error.value = "Failed to upload image. Please try again.";
        isUploading.value = false;
        emit("upload-error", err);
      }
    };

    const removeImage = () => {
      imageUrl.value = "";
      emit("update:modelValue", "");
      emit("remove");
    };

    return {
      fileInput,
      isDragging,
      isUploading,
      uploadProgress,
      error,
      imageUrl,
      triggerFileInput,
      handleFileSelect,
      handleFileDrop,
      removeImage,
    };
  },
};
</script>

<style scoped>
.upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-area:hover {
  border-color: #94a3b8;
  background-color: rgba(241, 245, 249, 0.5);
}

.dark .upload-area {
  border-color: #475569;
}

.dark .upload-area:hover {
  border-color: #64748b;
  background-color: rgba(30, 41, 59, 0.5);
}
</style>
