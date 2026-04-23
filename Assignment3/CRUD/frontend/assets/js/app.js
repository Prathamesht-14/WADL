// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Toast Notification System
function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠'
  };

  toast.innerHTML = `
    <span>${icons[type]}</span>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

// Clear all error messages
function clearErrors() {
  const errorElements = document.querySelectorAll('.error-message');
  errorElements.forEach(el => el.textContent = '');
  
  const inputElements = document.querySelectorAll('input');
  inputElements.forEach(el => el.classList.remove('error'));
}

// Switch to Register Form
function switchToRegister(event) {
  event.preventDefault();
  clearErrors();
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
}

// Switch to Login Form
function switchToLogin(event) {
  event.preventDefault();
  clearErrors();
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('registerForm').style.display = 'none';
}

// Validate Email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate Phone
function validatePhone(phone) {
  if (!phone) return true; // Phone is optional
  const re = /^(\+?\d{1,3}[- ]?)?\d{10}$/;
  return re.test(phone);
}

// Validate Password
function validatePassword(password) {
  return password.length >= 6;
}

// Login Handler
document.getElementById('loginFormElement')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  // Validation
  let isValid = true;

  if (!email) {
    document.getElementById('loginEmailError').textContent = 'Email is required';
    document.getElementById('loginEmail').classList.add('error');
    isValid = false;
  } else if (!validateEmail(email)) {
    document.getElementById('loginEmailError').textContent = 'Please enter a valid email';
    document.getElementById('loginEmail').classList.add('error');
    isValid = false;
  }

  if (!password) {
    document.getElementById('loginPasswordError').textContent = 'Password is required';
    document.getElementById('loginPassword').classList.add('error');
    isValid = false;
  }

  if (!isValid) return;

  try {
    // Show loading state
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner" style="width: 20px; height: 20px; border-width: 2px;"></span> Logging in...';

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success) {
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(data.data));
      showToast('Login successful! Redirecting...', 'success');
      
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    } else {
      showToast(data.message || 'Login failed', 'error');
    }
  } catch (error) {
    console.error('Login error:', error);
    showToast(error.message || 'Login failed', 'error');
  } finally {
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = false;
    btn.innerHTML = 'Login';
  }
});

// Register Handler
document.getElementById('registerFormElement')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  const firstName = document.getElementById('registerFirstName').value.trim();
  const lastName = document.getElementById('registerLastName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const phone = document.getElementById('registerPhone').value.trim();
  const password = document.getElementById('registerPassword').value;

  // Validation
  let isValid = true;

  if (!firstName) {
    document.getElementById('registerFirstNameError').textContent = 'First name is required';
    document.getElementById('registerFirstName').classList.add('error');
    isValid = false;
  }

  if (!lastName) {
    document.getElementById('registerLastNameError').textContent = 'Last name is required';
    document.getElementById('registerLastName').classList.add('error');
    isValid = false;
  }

  if (!email) {
    document.getElementById('registerEmailError').textContent = 'Email is required';
    document.getElementById('registerEmail').classList.add('error');
    isValid = false;
  } else if (!validateEmail(email)) {
    document.getElementById('registerEmailError').textContent = 'Please enter a valid email';
    document.getElementById('registerEmail').classList.add('error');
    isValid = false;
  }

  if (phone && !validatePhone(phone)) {
    document.getElementById('registerPhoneError').textContent = 'Please enter a valid phone number';
    document.getElementById('registerPhone').classList.add('error');
    isValid = false;
  }

  if (!password) {
    document.getElementById('registerPasswordError').textContent = 'Password is required';
    document.getElementById('registerPassword').classList.add('error');
    isValid = false;
  } else if (!validatePassword(password)) {
    document.getElementById('registerPasswordError').textContent = 'Password must be at least 6 characters';
    document.getElementById('registerPassword').classList.add('error');
    isValid = false;
  }

  if (!isValid) return;

  try {
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner" style="width: 20px; height: 20px; border-width: 2px;"></span> Registering...';

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone: phone || '',
        password
      })
    });

    const data = await response.json();

    if (data.success) {
      showToast('Registration successful! Please login.', 'success');
      
      setTimeout(() => {
        switchToLogin({ preventDefault: () => {} });
        document.getElementById('loginEmail').value = email;
      }, 1000);
    } else {
      showToast(data.message || 'Registration failed', 'error');
    }
  } catch (error) {
    console.error('Registration error:', error);
    showToast(error.message || 'Registration failed', 'error');
  } finally {
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = false;
    btn.innerHTML = 'Register';
  }
});

// Check if user is already logged in on page load
window.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('user');
  if (user) {
    window.location.href = 'dashboard.html';
  }
});
