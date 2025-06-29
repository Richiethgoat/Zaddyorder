let currentUser = null;
let users = {};

// Auth Modal Functions
function showAuthModal() {
    document.getElementById('authModal').style.display = 'block';
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

// Handle Registration
function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    if (users[username]) {
        alert('Username already exists!');
        return;
    }

    users[username] = {
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };

    alert('Account created successfully!');
    switchToLogin();
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (!users[username] || users[username].password !== password) {
        alert('Invalid username or password!');
        return;
    }

    currentUser = username;
    document.getElementById('usernameDisplay').textContent = username;
    closeAuthModal();
    showDashboard();
}

// Show Dashboard
function showDashboard() {
    const heroSection = document.querySelector('.hero');
    const featuresSection = document.getElementById('features');
    const footerSection = document.querySelector('.footer');
    const dashboardSection = document.getElementById('dashboard');

    if (heroSection) heroSection.style.display = 'none';
    if (featuresSection) featuresSection.style.display = 'none';
    if (footerSection) footerSection.style.display = 'none';
    if (dashboardSection) dashboardSection.style.display = 'block';
}

// Logout
function logout() {
    currentUser = null;
    const heroSection = document.querySelector('.hero');
    const featuresSection = document.getElementById('features');
    const footerSection = document.querySelector('.footer');
       const dashboardSection = document.getElementById('dashboard');
    const pairingStatus = document.getElementById('pairingStatus');
    const pairingCode = document.getElementById('pairingCode');
    const deploymentSuccess = document.getElementById('deploymentSuccess');
    const phoneNumberInput = document.getElementById('phoneNumber');

    if (heroSection) heroSection.style.display = 'block';
    if (featuresSection) featuresSection.style.display = 'block';
    if (footerSection) footerSection.style.display = 'block';
    if (dashboardSection) dashboardSection.style.display = 'none';

    // Reset deployment UI
    if (pairingStatus) pairingStatus.style.display = 'none';
    if (pairingCode) pairingCode.style.display = 'none';
    if (deploymentSuccess) deploymentSuccess.style.display = 'none';
    if (phoneNumberInput) phoneNumberInput.value = '';
}

// Start Pairing Process
async function startPairing() {
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const pairingStatus = document.getElementById('pairingStatus');
    const pairingCode = document.getElementById('pairingCode');
    const deploymentSuccess = document.getElementById('deploymentSuccess');
    const codeSpan = document.getElementById('code');

    if (!phoneNumber) {
        alert('Please enter your phone number');
        return;
    }

    // Show loading status
    if (pairingStatus) pairingStatus.style.display = 'block';
    if (pairingCode) pairingCode.style.display = 'none';
    if (deploymentSuccess) deploymentSuccess.style.display = 'none';

    try {
        // Simulate API call (replace with actual API endpoint)
        setTimeout(() => {
            // Simulate success
            if (codeSpan) codeSpan.textContent = '123456'; // Replace with actual code
            if (pairingStatus) pairingStatus.style.display = 'none';
            if (pairingCode) pairingCode.style.display = 'block';

            // Simulate deployment success after some time
            setTimeout(() => {
                if (pairingCode) pairingCode.style.display = 'none';
                if (deploymentSuccess) deploymentSuccess.style.display = 'block';
            }, 3000); // Show success after 3 seconds

        }, 2000); // Simulate API call taking 2 seconds

    } catch (error) {
        console.error('Pairing failed:', error);
        alert('Pairing failed. Please try again.');
        if (pairingStatus) pairingStatus.style.display = 'none';
    }
}