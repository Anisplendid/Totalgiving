const causes = [
  {
    id: "orphanage",
    title: "Feed Orphanage & Children’s Home",
    desc: "Help provide nutritious meals, clean water and everyday essentials for children.",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "medical",
    title: "Medical Care & Emergency Support",
    desc: "Help individuals and families meet urgent medical and healthcare needs.",
    image: "https://img.magnific.com/free-photo/ill-kid-treatment-sleeping-hospital-pediatrics-ward-room-while-worried-mother-sitting-her-sick-little-girl-resting-patient-bed-while-mother-praying-beside-her_482257-49728.jpg?semt=ais_hybrid&w=740&q=80"
  },
  {
    id: "food",
    title: "Food & Basic Needs",
    desc: "Support food parcels, clean water, clothing and essential household supplies.",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "education",
    title: "Education Support",
    desc: "Help provide school supplies, learning materials and education opportunities.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "families",
    title: "Families in Need",
    desc: "Support vulnerable families facing temporary financial or basic-needs challenges.",
    image: "https://www.icrc.org/sites/default/files/styles/desktop_full/public/2025-12/Families-in-Tawila-Sudan-October-2025.JPG.webp?h=c3635fa2&itok=pZ-5WkhC"
  },
  {
    id: "community",
    title: "Community Projects",
    desc: "Help fund practical projects that improve local communities and shared spaces.",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=85"
  }
];

const cryptoAddresses = {
  BTC: "bc1qcpye0af8274vw0fyqg9w5y5q0hmsvc9ulyd7ts",
  TRX: "TDMs1k82gQjmyoJffpRd9DrXaAUPvMG4Mg",
  ETH: "0x93e010544c9a97c37c1b90b256606280e8f2337f",
  SOL: "JCZ1Qrqh7SAic7edWj56FpV9SNvk2zUuqMEqnEDRfB5P",
  XRP: "rDFNcEJTG8JPWvKDMp96Rj3mgiWz1D5gec"
};

const bankDetails = {
  bank: "YOUR BANK NAME",
  accountName: "TOTAL GIVING",
  accountNumber: "YOUR ACCOUNT NUMBER",
  reference: "TOTAL-GIVING-DONATION"
};

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function load(key, fallback = null) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

const causeGrid = document.getElementById("causeGrid");
if (causeGrid) {
  causeGrid.innerHTML = causes
    .map(
      (c) => `
    <article class="cause-card">
      <div class="cause-image" style="background-image:url('${c.image}')"></div>
      <div class="cause-card-body">
        <div class="cause-tag">SUPPORT</div>
        <h2>${c.title}</h2>
        <p>${c.desc}</p>
        <button class="btn primary" onclick="selectCause('${c.id}')">Proceed to Donate</button>
      </div>
    </article>`
    )
    .join("");
}

function selectCause(id) {
  const cause = causes.find((c) => c.id === id);
  save("donationCause", cause);
  location.href = "payment.html";
}

const selectedCause = document.getElementById("selectedCause");
const cause = load("donationCause");
if (selectedCause && cause) {
  selectedCause.textContent = `You selected: ${cause.title}`;
}

document.querySelectorAll(".payment-option").forEach((btn) =>
  btn.addEventListener("click", () => {
    const method = btn.dataset.method;
    if (!method) return;
    save("paymentMethod", method);
    location.href = method === "crypto" ? "crypto.html" : "checkout.html";
  })
);

const cryptoCause = document.getElementById("cryptoCause");
if (cryptoCause && cause) {
  cryptoCause.textContent = `Donation cause: ${cause.title}`;
}

document.querySelectorAll(".crypto-card").forEach((btn) =>
  btn.addEventListener("click", () => {
    save("cryptoType", btn.dataset.crypto);
    save("paymentMethod", "crypto");
    location.href = "checkout.html";
  })
);

const details = document.getElementById("paymentDetails");
const checkoutTitle = document.getElementById("checkoutTitle");
const checkoutSubtitle = document.getElementById("checkoutSubtitle");
const eyebrow = document.getElementById("checkoutEyebrow");

if (details) {
  const method = load("paymentMethod", "bank");
  const type = load("cryptoType");

  if (cause) checkoutSubtitle.textContent = `For: ${cause.title}`;

  if (method === "crypto") {
    const address = cryptoAddresses[type] || "YOUR_CRYPTO_ADDRESS_HERE";
    eyebrow.textContent = `CRYPTO • ${type}`;
    checkoutTitle.textContent = `Pay with ${type}`;
    details.innerHTML = `
      <div class="detail-row">
        <div class="detail-label">Network / asset</div>
        <strong>${type}</strong>
      </div>
      <div class="detail-row">
        <div class="detail-label">Wallet address</div>
        <div class="copy-row">
          <input id="address" readonly value="${address}">
          <button class="copy-btn" id="copyAddress">Copy</button>
        </div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Important</div>
        <span> Only send the selected assets to this address. 
        </span>
      </div>`;
    document.getElementById("copyAddress").onclick = () => {
      navigator.clipboard?.writeText(address);
      document.getElementById("copyAddress").textContent = "Copied";
    };
  } else if (method === "bank") {
    eyebrow.textContent = "BANK TRANSFER";
    checkoutTitle.textContent = "Complete bank transfer";
    details.innerHTML = `
      <div class="detail-row">
        <div class="detail-label">Bank</div>
        <strong>${bankDetails.bank}</strong>
      </div>
      <div class="detail-row">
        <div class="detail-label">Account name</div>
        <strong>${bankDetails.accountName}</strong>
      </div>
      <div class="detail-row">
        <div class="detail-label">Account number</div>
        <strong>${bankDetails.accountNumber}</strong>
      </div>
      <div class="detail-row">
        <div class="detail-label">Payment reference</div>
        <strong>${bankDetails.reference}</strong>
      </div>`;
 
      } else {
  eyebrow.textContent = "PAYPAL";
  checkoutTitle.textContent = "Continue with PayPal";
  details.innerHTML = `
    <div class="detail-row">
      <strong>PayPal payment</strong>
     
    </div>
    <div class="detail-row">
      <a class="btn primary" href="#" onclick="return false;">Pay with PayPal</a>
    </div>

    <div class="detail-row">
      <div class="detail-label">Payment Account</div>
      <button class="btn secondary full" id="copyPaypal">Click To Copy Payment Account</button>
    </div>
  `;

  // The real account (hidden)
  const paypalAccount = "YOUR_PAYPAL_EMAIL/ACCOUNT";

  document.getElementById("copyPaypal").onclick = () => {
    navigator.clipboard?.writeText(paypalAccount).then(() => {
      const btn = document.getElementById("copyPaypal");
      btn.textContent = "Copied!";
      setTimeout(() => {
        btn.textContent = "Click To Copy Payment Account";
      }, 1500);
    });
  };
}

}

// ===== CONFIRM BUTTON + 1 MINUTE COUNTDOWN (FIXED) =====
const confirmPaid = document.getElementById("confirmPaid");
const timerDisplay = document.getElementById("timer");
const countdownText = document.getElementById("countdownText");
const amountInput = document.getElementById("amount");

if (confirmPaid) {
  const TOTAL_TIME = 60; // seconds
  const STORAGE_KEY = "confirmCountdownStart";

  // Restore amount if exists
  const savedAmount = load("tempAmount");
  if (savedAmount && amountInput) {
    amountInput.value = savedAmount;
  }

  // Save amount while typing
  if (amountInput) {
    amountInput.addEventListener("input", () => {
      save("tempAmount", amountInput.value);
    });
  }

  // Get saved start time
  let startTime = load(STORAGE_KEY);

  // If no start time or it's too old (more than 2 minutes), reset it
  if (!startTime || (Date.now() - startTime) > 120000) {
    startTime = Date.now();
    save(STORAGE_KEY, startTime);
  }

  function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    let timeLeft = TOTAL_TIME - elapsed;

    if (timeLeft <= 0) {
      // Timer finished
      clearInterval(timerInterval);
      confirmPaid.disabled = false;
      
      if (timerDisplay) timerDisplay.textContent = "0:00";
      if (countdownText) {
        countdownText.innerHTML = "Confirm your payment";
        countdownText.style.color = "#16a34a";
      }
      return;
    }

    // Still counting down
    confirmPaid.disabled = true;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    if (timerDisplay) {
      timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
  }

  // Run immediately
  updateTimer();
  const timerInterval = setInterval(updateTimer, 1000);

  // Click handler
  confirmPaid.addEventListener("click", () => {
    const amount = amountInput?.value.trim();

    if (!amount) {
      alert("Please enter a donation amount.");
      amountInput?.focus();
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 20) {
      alert("Minimum donation amount is $20.");
      amountInput?.focus();
      return;
    }

    // Clear storage
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("tempAmount");

    document.getElementById("loader").classList.add("show");
    save("lastDonation", {
      cause: load("donationCause"),
      method: load("paymentMethod"),
      crypto: load("cryptoType"),
      amount: numAmount
    });
    setTimeout(() => (location.href = "success.html"), 1800);
  });
}