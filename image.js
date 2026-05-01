// =========================
// CATEGORY / BUILT-IN IMAGE UI
// =========================
function populateImageOptions() {
  const selectedCategory = categorySelect.value;
  imageSelect.innerHTML = "";

  const filteredImages =
    selectedCategory === "all"
      ? builtInImages
      : builtInImages.filter((img) => img.category === selectedCategory);

  if (filteredImages.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No images in this category";
    imageSelect.appendChild(option);
    currentImage = "";
    return;
  }

  filteredImages.forEach((img) => {
    const option = document.createElement("option");
    option.value = img.value;
    option.textContent = img.name;
    imageSelect.appendChild(option);
  });

  currentImage = imageSelect.value;
}

function handleCategoryChange() {
  populateImageOptions();

  if (!imageSelect.value) {
    messageText.textContent = "No images found in that category.";
    return;
  }

  currentImage = imageSelect.value;
  messageText.textContent = "Category changed.";
  setupBoard();
}

// =========================
// IMAGE RESIZE / COMPRESS
// =========================
function resizeImage(file, maxSize = 700, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      const img = new Image();

      img.onload = function () {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");

        tempCanvas.width = width;
        tempCanvas.height = height;

        tempCtx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = tempCanvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };

      img.onerror = function () {
        reject(new Error("Could not load image."));
      };

      img.src = e.target.result;
    };

    reader.onerror = function () {
      reject(new Error("Could not read file."));
    };

    reader.readAsDataURL(file);
  });
}

// =========================
// IMAGE HANDLING
// =========================
function handleBuiltInImageChange() {
  currentImage = imageSelect.value;
  messageText.textContent = "Built-in background selected.";
  setupBoard();
}

async function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!currentUser) {
    messageText.textContent = "Please log in first.";
    uploadImage.value = "";
    return;
  }

  if (!isPremiumUser) {
    messageText.textContent = "Premium required to upload your own images.";
    uploadImage.value = "";
    return;
  }

  try {
    messageText.textContent = "Compressing image...";

    const compressedImage = await resizeImage(file, 700, 0.75);

    const newImage = {
      id: "bg_" + Date.now(),
      name: file.name,
      data: compressedImage
    };

    savedImages.push(newImage);

    const savedOk = saveImagesToStorage();

    if (!savedOk) {
      savedImages.pop();
      uploadImage.value = "";
      return;
    }

    loadSavedImagesUI();
    savedImagesSelect.value = newImage.id;
    currentImage = newImage.data;

    messageText.textContent = "Image uploaded and added to saved images.";
    setupBoard();
    uploadImage.value = "";
  } catch (error) {
    console.error(error);
    messageText.textContent = "Could not upload image. Try a smaller image.";
  }
}

function useSavedBackground() {
  const selectedId = savedImagesSelect.value;
  if (!selectedId) {
    messageText.textContent = "No saved image selected.";
    return;
  }

  const selectedImage = savedImages.find((img) => img.id === selectedId);
  if (!selectedImage) {
    messageText.textContent = "Saved image not found.";
    return;
  }

  currentImage = selectedImage.data;
  messageText.textContent = "Saved image loaded.";
  setupBoard();
}

function deleteSelectedImage() {
  const selectedId = savedImagesSelect.value;
  if (!selectedId) {
    messageText.textContent = "No saved image selected to delete.";
    return;
  }

  savedImages = savedImages.filter((img) => img.id !== selectedId);
  saveImagesToStorage();
  loadSavedImagesUI();

  currentImage = imageSelect.value || builtInImages[0].value;
  setupBoard();
  messageText.textContent = "Saved image deleted.";
}
