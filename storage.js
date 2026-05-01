// =========================
// STORAGE
// =========================
function saveImagesToStorage() {
  try {
    localStorage.setItem("puzzleSavedBackgrounds", JSON.stringify(savedImages));
    return true;
  } catch (error) {
    console.error("Could not save images:", error);
    messageText.textContent = "Storage full. Delete a saved image or upload a smaller one.";
    return false;
  }
}

function loadSavedImagesUI() {
  savedImagesSelect.innerHTML = "";

  if (savedImages.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No saved images";
    savedImagesSelect.appendChild(option);
    return;
  }

  savedImages.forEach((imgObj) => {
    const option = document.createElement("option");
    option.value = imgObj.id;
    option.textContent = imgObj.name;
    savedImagesSelect.appendChild(option);
  });
}
