// Initialize Supabase
const SUPABASE_URL = 'https://komzyhduotkgdfuvfldk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvbXp5aGR1b3RrZ2RmdXZmbGRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MDI2NzEsImV4cCI6MjA2ODk3ODY3MX0.42UN_2zFzn_OcnnRI5T2PZuUv4-Cj_IjgbTtIM1Ah88';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentUser = null;

// Modal Controls
function showAuthModal() {
  document.getElementById('authModal').style.display = 'flex';
}
function closeAuthModal() {
  document.getElementById('authModal').style.display = 'none';
}
function switchToRegister() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
}
function switchToLogin() {
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
}

// Register User via Supabase
async function handleRegister(event) {
  event.preventDefault();
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    showAdvancedAlert(error.message, 'error');
    return;
  }

  showAdvancedAlert('Account created successfully! Please log in.', 'success');
  switchToLogin();
}

// Login User via Supabase
async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    showAdvancedAlert('Invalid login credentials.', 'error');
    return;
  }

  currentUser = data.user?.email || email;
  showAdvancedAlert('Login successful!', 'success');

  // Redirect to dashboard
  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1200);
}

// Utility: Alerts
function showAdvancedAlert(message, type) {
  const alertBox = document.createElement('div');
  alertBox.className = `advanced-alert ${type}`;
  alertBox.innerHTML = `
    <div class="alert-icon">
      <i class="fas fa-${type === 'success' ? 'check-circle' :
                        type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
    </div>
    <div class="alert-message">${message}</div>
    <button class="alert-close" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;
  document.body.appendChild(alertBox);
  setTimeout(() => alertBox.remove(), 5000);
}

// Close modal when clicking outside
window.onclick = function(e) {
  const modal = document.getElementById('authModal');
  if (e.target === modal) closeAuthModal();
};

/* Pairing Functions (unchanged) */
async function startPairing() {
  const phoneNumber = document.getElementById('phoneNumber').value.trim();
  if (!phoneNumber) {
    showAdvancedAlert('Please enter your phone number', 'warning');
    return;
  }
  document.getElementById('pairingStatus').style.display = 'block';
  document.getElementById('pairingCode').style.display = 'none';
  document.getElementById('deploymentSuccess').style.display = 'none';

  try {
    const res = await fetch('/api/start-pairing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, username: currentUser })
    });
    if (!res.ok) throw new Error('Failed to start pairing');
    pollForPairingCode(phoneNumber);
  } catch (err) {
    showAdvancedAlert('Failed to start pairing process. Try again.', 'error');
    document.getElementById('pairingStatus').style.display = 'none';
  }
}

async function pollForPairingCode(phoneNumber) {
  let attempts = 0, maxAttempts = 30;
  const poll = async () => {
    try {
      const res = await fetch(`/api/get-pairing-code?phone=${phoneNumber}`);
      if (res.ok) {
        const data = await res.json();
        if (data.code) return showPairingCode(data.code);
      }
      if (++attempts < maxAttempts) setTimeout(poll, 1000);
      else throw new Error('Timeout waiting for code');
    } catch {
      showAdvancedAlert('Could not retrieve pairing code.', 'error');
      document.getElementById('pairingStatus').style.display = 'none';
    }
  };
  poll();
}

function showPairingCode(code) {
  document.getElementById('pairingStatus').style.display = 'none';
  document.getElementById('codeValue').textContent = code;
  document.getElementById('pairingCode').style.display = 'block';
  setTimeout(() => checkConnectionStatus(), 5000);
}

async function checkConnectionStatus() {
  try {
    const res = await fetch('/api/connection-status');
    if (res.ok) {
      const data = await res.json();
      if (data.connected) return showDeploymentSuccess();
      setTimeout(checkConnectionStatus, 3000);
    }
  } catch {
    setTimeout(checkConnectionStatus, 3000);
  }
}

function showDeploymentSuccess() {
  document.getElementById('pairingCode').style.display = 'none';
  document.getElementById('deploymentSuccess').style.display = 'block';
}

function copyCode() {
  const code = document.getElementById('codeValue').textContent;
  navigator.clipboard.writeText(code.replace(/-/g, ''));
  showAdvancedAlert('Code copied!', 'success');
}