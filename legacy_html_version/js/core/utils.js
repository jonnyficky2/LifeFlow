const TOAST_TIMEOUT = 3000; // milliseconds

export function getToday() {
  return new Date().toISOString().split("T")[0];
}

export function getLocalDate(date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().split("T")[0];
}

/**
 * Displays a toast notification.
 * @param {string} message - The message to display.
 * @param {'success'|'warning'|'error'|'info'} [type='info'] - The type of notification.
 */
export function showToast(message, type = 'info') {
  const toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    console.warn("Toast container not found.");
    return;
  }

  const toastMessage = document.createElement("div");
  toastMessage.className = `toast-message toast-message--${type}`;
  toastMessage.textContent = message;

  toastContainer.appendChild(toastMessage);

  // Trigger show animation
  requestAnimationFrame(() => {
    toastMessage.classList.add("show");
  });

  // Auto dismiss
  setTimeout(() => {
    toastMessage.classList.remove("show");
    toastMessage.classList.add("hide"); // Add hide class for exit animation

    // Remove from DOM after animation
    toastMessage.addEventListener('transitionend', () => {
      toastMessage.remove();
    }, { once: true });

  }, TOAST_TIMEOUT);
}

export function celebrate() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

// Legal content functions (moved from js/modules/settings.js)
export function getPrivacyPolicyContent() {
  return `
    <h3>LifeFlow Privacy Policy</h3>
    <p>This Privacy Policy describes how LifeFlow collects, uses, and discloses your personal information when you use our application.</p>
    <h4>Information We Collect</h4>
    <p>We collect information you provide directly to us, such as your name, email address, and profile picture when you sign up or log in using Google. We also collect data related to your tasks, habits, and notes within the app.</p>
    <h4>How We Use Your Information</h4>
    <p>We use the information we collect to:</p>
    <ul>
      <li>Provide, maintain, and improve our services.</li>
      <li>Personalize your experience.</li>
      <li>Communicate with you about your account or services.</li>
      <li>Sync your data across devices.</li>
    </ul>
    <h4>Data Sharing and Disclosure</h4>
    <p>We do not share or sell your personal information to third parties for their marketing purposes. We may share information with service providers who perform services on our behalf, such as hosting and analytics.</p>
    <h4>Security</h4>
    <p>We take reasonable measures to protect your information from unauthorized access, use, or disclosure.</p>
    <h4>Changes to This Policy</h4>
    <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
    <p>Last updated: May 15, 2026</p>
  `;
}

export function getTermsOfServiceContent() {
  return `
    <h3>LifeFlow Terms of Service</h3>
    <p>Welcome to LifeFlow! These Terms of Service ("Terms") govern your access to and use of the LifeFlow application and services ("Services").</p>
    <h4>Acceptance of Terms</h4>
    <p>By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy.</p>
    <h4>Use of Services</h4>
    <p>You may use the Services only if you are 13 years or older and are not barred from using the Services under applicable law. You agree to use the Services only for lawful purposes.</p>
    <h4>Your Content</h4>
    <p>You retain ownership of any content you submit, post, or display on or through the Services. By submitting content, you grant LifeFlow a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, modify, publish, transmit, display, and distribute such content in any and all media or distribution methods.</p>
    <h4>Prohibited Conduct</h4>
    <p>You agree not to engage in any of the following prohibited activities:</p>
    <ul>
      <li>Using the Services for any illegal purpose.</li>
      <li>Interfering with or disrupting the integrity or performance of the Services.</li>
      <li>Attempting to gain unauthorized access to the Services or its related systems or networks.</li>
    </ul>
    <h4>Termination</h4>
    <p>We may terminate or suspend your access to our Services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
    <h4>Disclaimer</h4>
    <p>The Services are provided "as is" without warranties of any kind, either express or implied.</p>
    <p>Last updated: May 15, 2026</p>
  `;
}

export function getOpenSourceLicensesContent() {
  return `
    <h3>LifeFlow Open Source Licenses</h3>
    <p>LifeFlow utilizes various open-source libraries and components. We are grateful to the open-source community for their contributions.</p>
    <p>Below is a list of some of the key open-source projects used in LifeFlow and their respective licenses:</p>
    <ul>
      <li><strong>Firebase SDK:</strong> Apache License 2.0</li>
      <li><strong>Chart.js:</strong> MIT License</li>
      <li><strong>Confetti.js:</strong> MIT License</li>
      <li><strong>Poppins Font:</strong> Open Font License (OFL)</li>
      <li><strong>Icons (from Feather Icons):</strong> MIT License</li>
      <li><strong>Color.js (kurkle/color):</strong> MIT License</li>
      <!-- Add more as needed -->
    </ul>
    <p>For full details on each license, please refer to the respective project's documentation.</p>
  `;
}

/**
 * Performance helper to dynamically load scripts (Lazy Loading)
 * @param {string} src - Path to the script
 * @returns {Promise}
 */
export function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
