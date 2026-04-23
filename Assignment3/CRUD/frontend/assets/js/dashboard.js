// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Global Variables
let currentUser = null;
let allUsers = [];
let currentEditingUserId = null;
let deleteUserIdConfirm = null;

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

// Validate MongoDB ObjectId Format
function isValidObjectId(id) {
  return /^[0-9a-f]{24}$/.test(id);
}

// Initialize Dashboard
async function initDashboard() {
  // Get current user from localStorage
  const userJson = localStorage.getItem('user');
  if (!userJson) {
    window.location.href = 'index.html';
    return;
  }

  currentUser = JSON.parse(userJson);
  document.getElementById('userDisplayName').textContent = `${currentUser.firstName} ${currentUser.lastName}`;

  // Load users
  await loadUsers();
}

// Load all users
async function loadUsers() {
  try {
    const response = await fetch(`${API_BASE_URL}/user/users`);
    const data = await response.json();

    if (data.success) {
      allUsers = data.data;
      displayUsers(allUsers);
      updateStats();
    } else {
      showToast(data.message || 'Failed to load users', 'error');
    }
  } catch (error) {
    console.error('Error loading users:', error);
    showToast(error.message || 'Failed to load users', 'error');
  }
}

// Display users in table
function displayUsers(users) {
  const tbody = document.getElementById('usersTableBody');
  
  if (users.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 2rem; color: #6b7280;">
          No users found. <a href="#" onclick="openAddUserModal(event)" style="color: var(--primary-color);">Add a new user</a>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = users.map(user => `
    <tr>
      <td><code style="background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.85rem;">${user._id}</code></td>
      <td>${user.firstName} ${user.lastName}</td>
      <td>${user.email}</td>
      <td>${user.phone || 'N/A'}</td>
      <td>
        <div class="btn-group">
          <button class="btn btn-secondary btn-sm" onclick="openEditUserModal('${user._id}', event)">
            ✏️ Edit
          </button>
          <button class="btn btn-danger btn-sm" onclick="openDeleteModal('${user._id}', event)">
            🗑️ Delete
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Filter users based on search
function filterUsers() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const filtered = allUsers.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm) ||
    user.lastName.toLowerCase().includes(searchTerm) ||
    user.email.toLowerCase().includes(searchTerm) ||
    user._id.toLowerCase().includes(searchTerm)
  );
  displayUsers(filtered);
}

// Show/Hide Sections
function showSection(section, event) {
  event.preventDefault();
  
  // Hide all sections
  document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
  
  // Update active menu
  document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));
  event.target.classList.add('active');

  // Show selected section
  if (section === 'users') {
    document.getElementById('usersSection').style.display = 'block';
  } else if (section === 'stats') {
    document.getElementById('statsSection').style.display = 'block';
  }
}

// Update Statistics
function updateStats() {
  const total = allUsers.length;
  
  document.getElementById('totalUsers').textContent = total;
  document.getElementById('lastRegistered').textContent = new Date().toLocaleDateString();
}

// Clear error messages
function clearErrors() {
  const errorElements = document.querySelectorAll('#userModal .error-message');
  errorElements.forEach(el => el.textContent = '');
  
  const inputElements = document.querySelectorAll('#userModal input');
  inputElements.forEach(el => el.classList.remove('error'));
}

// Validate Name (First/Last)
function validateName(name, fieldName = 'Name') {
  if (!name || name.trim().length === 0) {
    return { valid: false, message: `${fieldName} is required` };
  }
  
  // Check length
  if (name.length < 2) {
    return { valid: false, message: `${fieldName} must be at least 2 characters` };
  }
  
  if (name.length > 50) {
    return { valid: false, message: `${fieldName} must be less than 50 characters` };
  }
  
  // Allow letters, spaces, hyphens, apostrophes, and accented characters
  const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
  if (!nameRegex.test(name)) {
    return { valid: false, message: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
  }
  
  // Check for multiple consecutive spaces
  if (/\s{2,}/.test(name)) {
    return { valid: false, message: `${fieldName} cannot contain multiple consecutive spaces` };
  }
  
  return { valid: true, message: '' };
}

// Validate Email
function validateEmail(email) {
  if (!email || email.trim().length === 0) {
    return { valid: false, message: 'Email is required' };
  }
  
  // Comprehensive email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }
  
  // Additional checks
  if (email.length > 100) {
    return { valid: false, message: 'Email is too long (max 100 characters)' };
  }
  
  if (email.startsWith('.') || email.endsWith('.')) {
    return { valid: false, message: 'Email cannot start or end with a dot' };
  }
  
  if (email.includes('..')) {
    return { valid: false, message: 'Email cannot contain consecutive dots' };
  }
  
  return { valid: true, message: '' };
}

// Validate Phone Number
function validatePhone(phone) {
  if (!phone || phone.trim().length === 0) {
    return { valid: true, message: '' }; // Phone is optional
  }
  
  // Remove common formatting characters
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  
  // Check if cleaned version has at least 10 digits
  if (!/^\+?\d{10,15}$/.test(cleaned)) {
    return { 
      valid: false, 
      message: 'Phone number must have 10-15 digits (can include country code)' 
    };
  }
  
  // Additional pattern checks
  const phonePatterns = [
    /^(\+1|1)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{4}$/, // US/Canada
    /^(\+44)?[\s\-]?[0-9]{10,11}$/, // UK
    /^(\+91)?[\s\-]?[0-9]{10}$/, // India
    /^(\+\d{1,3})?[\s\-]?\d{6,14}$/ // General international format
  ];
  
  const isValidPattern = phonePatterns.some(pattern => pattern.test(phone));
  
  if (!isValidPattern && !/^\+?\d{10,15}$/.test(cleaned)) {
    return { 
      valid: false, 
      message: 'Phone number format is invalid. Use format like: +1-123-456-7890 or 1234567890' 
    };
  }
  
  return { valid: true, message: '' };
}

// Open Add User Modal
function openAddUserModal(event) {
  if (event) event.preventDefault();
  
  clearErrors();
  currentEditingUserId = null;
  document.getElementById('modalTitle').textContent = 'Add New User';
  document.getElementById('userForm').reset();
  document.getElementById('passwordLabel').textContent = 'Password';
  document.getElementById('userPassword').required = true;
  
  document.getElementById('userModal').classList.add('show');
}

// Open Edit User Modal
async function openEditUserModal(userId, event) {
  if (event) event.preventDefault();
  
  clearErrors();
  currentEditingUserId = userId;
  document.getElementById('modalTitle').textContent = 'Edit User';
  document.getElementById('passwordLabel').textContent = 'Password (leave blank to keep current)';
  document.getElementById('userPassword').required = false;
  
  try {
    const response = await fetch(`${API_BASE_URL}/user/users/${userId}`);
    const data = await response.json();

    if (data.success) {
      const user = data.data;
      document.getElementById('userFirstName').value = user.firstName;
      document.getElementById('userLastName').value = user.lastName;
      document.getElementById('userEmail').value = user.email;
      document.getElementById('userPhone').value = user.phone || '';
    } else {
      showToast('Failed to load user', 'error');
      return;
    }
  } catch (error) {
    console.error('Error loading user:', error);
    showToast('Failed to load user', 'error');
    return;
  }

  document.getElementById('userModal').classList.add('show');
}

// Close User Modal
function closeUserModal() {
  document.getElementById('userModal').classList.remove('show');
  document.getElementById('userForm').reset();
  currentEditingUserId = null;
}

// Handle User Form Submission
document.getElementById('userForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  const firstName = document.getElementById('userFirstName').value.trim();
  const lastName = document.getElementById('userLastName').value.trim();
  const email = document.getElementById('userEmail').value.trim();
  const phone = document.getElementById('userPhone').value.trim();
  const password = document.getElementById('userPassword').value;

  // Validation
  let isValid = true;

  // Validate First Name
  const firstNameValidation = validateName(firstName, 'First name');
  if (!firstNameValidation.valid) {
    document.getElementById('userFirstNameError').textContent = firstNameValidation.message;
    document.getElementById('userFirstName').classList.add('error');
    isValid = false;
  }

  // Validate Last Name
  const lastNameValidation = validateName(lastName, 'Last name');
  if (!lastNameValidation.valid) {
    document.getElementById('userLastNameError').textContent = lastNameValidation.message;
    document.getElementById('userLastName').classList.add('error');
    isValid = false;
  }

  // Validate Email
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    document.getElementById('userEmailError').textContent = emailValidation.message;
    document.getElementById('userEmail').classList.add('error');
    isValid = false;
  }

  // Validate Phone (optional)
  if (phone) {
    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.valid) {
      document.getElementById('userPhoneError').textContent = phoneValidation.message;
      document.getElementById('userPhone').classList.add('error');
      isValid = false;
    }
  }

  // Validate Password
  if (!currentEditingUserId && !password) {
    document.getElementById('userPasswordError').textContent = 'Password is required';
    document.getElementById('userPassword').classList.add('error');
    isValid = false;
  } else if (password && password.length < 6) {
    document.getElementById('userPasswordError').textContent = 'Password must be at least 6 characters';
    document.getElementById('userPassword').classList.add('error');
    isValid = false;
  }

  if (!isValid) return;

  try {
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '⏳ Saving...';

    const userData = {
      firstName,
      lastName,
      email,
      phone: phone || ''
    };

    // Include password only if provided
    if (password) {
      userData.password = password;
    }

    const method = currentEditingUserId ? 'PATCH' : 'POST';
    const endpoint = currentEditingUserId 
      ? `${API_BASE_URL}/user/users/${currentEditingUserId}`
      : `${API_BASE_URL}/user/register`;

    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (data.success) {
      showToast(
        currentEditingUserId ? 'User updated successfully' : 'User created successfully',
        'success'
      );
      
      closeUserModal();
      await loadUsers();
    } else {
      showToast(data.message || 'Failed to save user', 'error');
    }
  } catch (error) {
    console.error('Error saving user:', error);
    showToast(error.message || 'Failed to save user', 'error');
  } finally {
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = false;
    btn.innerHTML = 'Save User';
  }
});

// Open Delete Confirmation Modal
function openDeleteModal(userId, event) {
  if (event) event.preventDefault();
  
  deleteUserIdConfirm = userId;
  document.getElementById('deleteModal').classList.add('show');
}

// Close Delete Modal
function closeDeleteModal() {
  document.getElementById('deleteModal').classList.remove('show');
  deleteUserIdConfirm = null;
}

// Confirm Delete User
async function confirmDelete() {
  if (!deleteUserIdConfirm) return;

  try {
    const response = await fetch(`${API_BASE_URL}/user/users/${deleteUserIdConfirm}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (data.success) {
      showToast('User deleted successfully', 'success');
      closeDeleteModal();
      await loadUsers();
    } else {
      showToast(data.message || 'Failed to delete user', 'error');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    showToast(error.message || 'Failed to delete user', 'error');
  }
}

// Logout
function logout() {
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
  const userModal = document.getElementById('userModal');
  const deleteModal = document.getElementById('deleteModal');
  
  if (e.target === userModal) {
    closeUserModal();
  }
  
  if (e.target === deleteModal) {
    closeDeleteModal();
  }
});

// Real-time Validation for Form Fields
function setupFieldValidation() {
  // First Name validation
  const firstNameField = document.getElementById('userFirstName');
  if (firstNameField) {
    firstNameField.addEventListener('blur', () => {
      const validation = validateName(firstNameField.value, 'First name');
      const errorEl = document.getElementById('userFirstNameError');
      if (!validation.valid) {
        firstNameField.classList.add('error');
        errorEl.textContent = validation.message;
      } else {
        firstNameField.classList.remove('error');
        errorEl.textContent = '';
      }
    });
    
    firstNameField.addEventListener('input', () => {
      if (firstNameField.classList.contains('error')) {
        const validation = validateName(firstNameField.value, 'First name');
        if (validation.valid) {
          firstNameField.classList.remove('error');
          document.getElementById('userFirstNameError').textContent = '';
        }
      }
    });
  }

  // Last Name validation
  const lastNameField = document.getElementById('userLastName');
  if (lastNameField) {
    lastNameField.addEventListener('blur', () => {
      const validation = validateName(lastNameField.value, 'Last name');
      const errorEl = document.getElementById('userLastNameError');
      if (!validation.valid) {
        lastNameField.classList.add('error');
        errorEl.textContent = validation.message;
      } else {
        lastNameField.classList.remove('error');
        errorEl.textContent = '';
      }
    });
    
    lastNameField.addEventListener('input', () => {
      if (lastNameField.classList.contains('error')) {
        const validation = validateName(lastNameField.value, 'Last name');
        if (validation.valid) {
          lastNameField.classList.remove('error');
          document.getElementById('userLastNameError').textContent = '';
        }
      }
    });
  }

  // Email validation
  const emailField = document.getElementById('userEmail');
  if (emailField) {
    emailField.addEventListener('blur', () => {
      const validation = validateEmail(emailField.value);
      const errorEl = document.getElementById('userEmailError');
      if (!validation.valid) {
        emailField.classList.add('error');
        errorEl.textContent = validation.message;
      } else {
        emailField.classList.remove('error');
        errorEl.textContent = '';
      }
    });
    
    emailField.addEventListener('input', () => {
      if (emailField.classList.contains('error')) {
        const validation = validateEmail(emailField.value);
        if (validation.valid) {
          emailField.classList.remove('error');
          document.getElementById('userEmailError').textContent = '';
        }
      }
    });
  }

  // Phone validation
  const phoneField = document.getElementById('userPhone');
  if (phoneField) {
    phoneField.addEventListener('blur', () => {
      const validation = validatePhone(phoneField.value);
      const errorEl = document.getElementById('userPhoneError');
      if (!validation.valid) {
        phoneField.classList.add('error');
        errorEl.textContent = validation.message;
      } else {
        phoneField.classList.remove('error');
        errorEl.textContent = '';
      }
    });
    
    phoneField.addEventListener('input', () => {
      if (phoneField.classList.contains('error')) {
        const validation = validatePhone(phoneField.value);
        if (validation.valid) {
          phoneField.classList.remove('error');
          document.getElementById('userPhoneError').textContent = '';
        }
      }
    });
  }

  // Password validation
  const passwordField = document.getElementById('userPassword');
  if (passwordField) {
    passwordField.addEventListener('blur', () => {
      const errorEl = document.getElementById('userPasswordError');
      const password = passwordField.value;
      
      if (!currentEditingUserId && !password) {
        passwordField.classList.add('error');
        errorEl.textContent = 'Password is required';
      } else if (password && password.length < 6) {
        passwordField.classList.add('error');
        errorEl.textContent = 'Password must be at least 6 characters';
      } else {
        passwordField.classList.remove('error');
        errorEl.textContent = '';
      }
    });
    
    passwordField.addEventListener('input', () => {
      if (passwordField.classList.contains('error')) {
        const password = passwordField.value;
        if (currentEditingUserId || password.length >= 6) {
          passwordField.classList.remove('error');
          document.getElementById('userPasswordError').textContent = '';
        }
      }
    });
  }
}

// Initialize field validation when modal is opened
const originalOpenAddUserModal = window.openAddUserModal;
window.openAddUserModal = function(event) {
  originalOpenAddUserModal.call(this, event);
  setTimeout(() => setupFieldValidation(), 100);
};

const originalOpenEditUserModal = window.openEditUserModal;
window.openEditUserModal = function(userId, event) {
  originalOpenEditUserModal.call(this, userId, event);
  setTimeout(() => setupFieldValidation(), 100);
};

// Initialize Dashboard on Page Load
window.addEventListener('DOMContentLoaded', () => {
  initDashboard();
});
