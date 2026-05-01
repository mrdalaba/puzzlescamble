// =========================
// AUTH HELPERS
// =========================

async function handleManageSubscription() {
  if (!currentUser) {
    authStatus.textContent = "Please log in first.";
    return;
  }

  manageBtn.disabled = true;
  manageBtn.textContent = "Opening subscription page...";

  try {
    const { data, error } = await supabaseClient.functions.invoke(
      "create-customer-portal",
      {
        body: {
          userId: currentUser.id,
          email: currentUser.email
        }
      }
    );

    if (error) {
      console.error("Customer portal error:", error);
      authStatus.textContent = "Could not open subscription page.";
      return;
    }

    if (!data?.url) {
      authStatus.textContent = "No subscription page URL returned.";
      return;
    }

    window.location.href = data.url;
  } catch (err) {
    console.error(err);
    authStatus.textContent = err.message;
  } finally {
    manageBtn.disabled = false;
    manageBtn.textContent = "Remove Subscription";
  }
}

function updatePremiumUI() {
  if (currentUser) {
    authStatus.textContent = `Logged in: ${currentUser.email}`;
    loginState.textContent = "Logged In";
    loginState.style.color = "#4ade80";
  } else {
    authStatus.textContent = "Not logged in";
    loginState.textContent = "Not Logged In";
    loginState.style.color = "#facc15";
  }

  if (isPremiumUser) {
    premiumStatus.textContent = "🔥 Premium Active";
    premiumStatus.classList.remove("premium-off");
    premiumStatus.classList.add("premium-on");

    uploadImage.disabled = false;
    uploadBox.classList.remove("locked");
    uploadBox.classList.add("unlocked");
    uploadNote.textContent = "Premium unlocked. You can upload custom images.";
  } else {
    premiumStatus.textContent = currentUser ? "Free User - Upload Locked" : "Free User";
    premiumStatus.classList.remove("premium-on");
    premiumStatus.classList.add("premium-off");

    uploadImage.disabled = true;
    uploadBox.classList.remove("unlocked");
    uploadBox.classList.add("locked");
    uploadNote.textContent = "Premium required for custom uploads.";
  }
}

function setAuthButtonsDisabled(disabled) {
  signUpBtn.disabled = disabled;
  loginBtn.disabled = disabled;
}

async function ensureProfileRow(user) {
  if (!user) return;

  const { data: existingProfile, error: selectError } = await supabaseClient
    .from("profiles")
    .select("id, is_premium")
    .eq("id", user.id)
    .maybeSingle();

  if (selectError) {
    console.error("Profile lookup error:", selectError);
    return;
  }

  if (!existingProfile) {
    const { error: insertError } = await supabaseClient
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email,
        is_premium: false
      });

    if (insertError) {
      console.error("Profile insert error:", insertError);
    }
  }
}

async function testSupabaseHealth() {
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/health`, {
      method: "GET",
      headers: {
        apikey: SUPABASE_ANON_KEY
      },
      cache: "no-store"
    });

    const text = await res.text();
    console.log("HEALTH STATUS:", res.status);
    console.log("HEALTH TEXT:", text);
    return { ok: true, status: res.status, text };
  } catch (err) {
    console.error("HEALTH FETCH FAILED:", err);
    return { ok: false, error: err };
  }
}

async function testDirectPasswordLogin(email, password) {
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const text = await res.text();
    console.log("DIRECT LOGIN STATUS:", res.status);
    console.log("DIRECT LOGIN BODY:", text);

    return {
      ok: res.ok,
      status: res.status,
      body: text
    };
  } catch (err) {
    console.error("DIRECT LOGIN FETCH FAILED:", err);
    return {
      ok: false,
      error: err
    };
  }
}

async function loadUserState() {
  try {
    const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();

    console.log("SESSION DATA:", sessionData);
    console.log("SESSION ERROR:", sessionError);

    if (sessionError || !sessionData.session) {
      currentUser = null;
      isPremiumUser = false;
      updatePremiumUI();
      return;
    }

    currentUser = sessionData.session.user;
    await ensureProfileRow(currentUser);

    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("id, email, is_premium")
      .eq("id", currentUser.id)
      .maybeSingle();

    console.log("PROFILE DATA:", profile);
    console.log("PROFILE ERROR:", profileError);

    if (profileError) {
      isPremiumUser = false;
    } else {
      isPremiumUser = !!profile?.is_premium;
    }

    updatePremiumUI();
  } catch (err) {
    console.error("LOAD USER STATE ERROR:", err);
    authStatus.textContent = `Load user error: ${err.message}`;
  }
}

// =========================
// AUTH ACTIONS
// =========================
async function handleSignUp() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    authStatus.textContent = "Enter email and password first.";
    return;
  }

  setAuthButtonsDisabled(true);
  authStatus.textContent = "Creating account...";

  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password
    });

    console.log("SIGNUP DATA:", data);
    console.log("SIGNUP ERROR:", error);

    if (error) {
      authStatus.textContent = `Sign up error: ${error.message}`;
      return;
    }

    if (data?.user) {
      await ensureProfileRow(data.user);
    }

    authStatus.innerHTML = `
      ✅ Account created! <br>
      📧 Check your email to confirm your account <br>
      🔐 Then come back and log in
    `;
  } catch (err) {
    console.error("RAW SIGNUP ERROR:", err);
    authStatus.textContent = `Sign up error: ${err.message}`;
  } finally {
    setAuthButtonsDisabled(false);
  }
}

async function handleLogin() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    authStatus.textContent = "Enter email and password first.";
    return;
  }

  if (!navigator.onLine) {
    authStatus.textContent = "No internet connection.";
    return;
  }

  setAuthButtonsDisabled(true);
  loginBtn.textContent = "Logging in...";
  authStatus.textContent = "Testing connection...";

  try {
    const health = await testSupabaseHealth();

    if (!health.ok) {
      authStatus.textContent = "Cannot reach Supabase health endpoint. Check internet, ad blocker, DNS, or browser security.";
      return;
    }

    authStatus.textContent = "Trying direct auth request...";

    const direct = await testDirectPasswordLogin(email, password);

    if (direct.error) {
      authStatus.textContent = `Direct login request failed: ${direct.error.message}`;
      return;
    }

    if (!direct.ok) {
      let lowerBody = (direct.body || "").toLowerCase();

      if (lowerBody.includes("email not confirmed")) {
        authStatus.textContent = "Please confirm your email before logging in.";
      } else if (lowerBody.includes("invalid login credentials")) {
        authStatus.textContent = "Wrong email or password.";
      } else {
        authStatus.textContent = `Direct login failed (${direct.status}). Check console for details.`;
      }
      return;
    }

    authStatus.textContent = "Direct login works. Creating Supabase session...";

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    console.log("SDK LOGIN DATA:", data);
    console.log("SDK LOGIN ERROR:", error);

    if (error) {
      authStatus.textContent = `SDK login error: ${error.message}`;
      return;
    }

    if (!data?.user) {
      authStatus.textContent = "Login response came back, but no user was returned.";
      return;
    }

    currentUser = data.user;
    await ensureProfileRow(currentUser);
    await loadUserState();

    authStatus.textContent = "Logged in successfully.";
    authPopup.classList.add("hidden");
  } catch (err) {
    console.error("RAW LOGIN ERROR:", err);
    authStatus.textContent = `Login error: ${err.message}`;
  } finally {
    setAuthButtonsDisabled(false);
    loginBtn.textContent = "Login";
  }
}

async function handleLogout() {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    authStatus.textContent = `Logout error: ${error.message}`;
    return;
  }

  currentUser = null;
  isPremiumUser = false;
  updatePremiumUI();
  authStatus.textContent = "Logged out.";
}

async function handlePayment() {
  if (!currentUser) {
    authStatus.textContent = "Please log in first.";
    return;
  }

  payBtn.disabled = true;
  payBtn.textContent = "Opening payment...";

  try {
    const { data, error } = await supabaseClient.functions.invoke("create-checkout-session", {
      body: {
        userId: currentUser.id,
        email: currentUser.email
      }
    });

    if (error) {
      console.error(error);
      authStatus.textContent = "Payment error.";
      return;
    }

    if (!data?.url) {
      authStatus.textContent = "No checkout URL returned.";
      return;
    }

    window.location.href = data.url;

  } catch (err) {
    console.error(err);
    authStatus.textContent = err.message;
  } finally {
    payBtn.disabled = false;
    payBtn.textContent = "Unlock Uploads ($2.99/month)";
  }
}
