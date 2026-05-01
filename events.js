// =========================
// PROFILE POPUP EVENTS
// =========================
if (profileIcon && authPopup) {
  profileIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    authPopup.classList.toggle("hidden");
  });

  authPopup.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  document.addEventListener("click", () => {
    authPopup.classList.add("hidden");
  });
}

// =========================
// BUTTON EVENTS
// =========================
signUpBtn.addEventListener("click", handleSignUp);
loginBtn.addEventListener("click", handleLogin);
logoutBtn.addEventListener("click", handleLogout);
payBtn.addEventListener("click", handlePayment);

if (manageBtn) {
  manageBtn.addEventListener("click", handleManageSubscription);
}

// =========================
// GAME EVENTS
// =========================
startBtn.addEventListener("click", () => {
  setupBoard();
  shuffleBoard();
});

shuffleBtn.addEventListener("click", () => {
  if (!gameStarted) setupBoard();
  shuffleBoard();
});

solveBtn.addEventListener("click", solveBoard);

// =========================
// UI EVENTS
// =========================
sizeSelect.addEventListener("change", setupBoard);
categorySelect.addEventListener("change", handleCategoryChange);
imageSelect.addEventListener("change", handleBuiltInImageChange);
uploadImage.addEventListener("change", handleImageUpload);
useSavedBtn.addEventListener("click", useSavedBackground);
deleteImageBtn.addEventListener("click", deleteSelectedImage);

// =========================
// ENTER KEY LOGIN
// =========================
passwordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleLogin();
  }
});

// =========================
// AUTH STATE LISTENER
// =========================
supabaseClient.auth.onAuthStateChange((event, session) => {
  console.log("AUTH STATE CHANGED:", event, session);

  if (session?.user) {
    currentUser = session.user;
    ensureProfileRow(currentUser).then(() => loadUserState());
  } else {
    currentUser = null;
    isPremiumUser = false;
    updatePremiumUI();
  }
});
