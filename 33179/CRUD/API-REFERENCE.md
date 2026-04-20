# API Reference & Feature Guide

## API Endpoints Summary

### Base URL
```
http://localhost:5000/api
```

---

## Authentication Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890",
  "password": "password123"
}

Response (Success):
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "1234567890",
    "latitude": 0,
    "longitude": 0,
    "createdAt": "2024-01-01T10:00:00Z"
  }
}

Response (Error):
{
  "success": false,
  "message": "Email already in use" | "Please provide all required fields"
}
```

### Login User
```
POST /auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (Success):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    ...
  }
}

Response (Error):
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

## User Management Endpoints

### Get All Users
```
GET /user/users

Response (Success):
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "1234567890",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "createdAt": "2024-01-01T10:00:00Z"
    },
    ...
  ]
}
```

### Get Single User
```
GET /user/users/:id

Example: /user/users/507f1f77bcf86cd799439011

Response (Success):
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "1234567890",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "createdAt": "2024-01-01T10:00:00Z"
  }
}

Response (Error):
{
  "success": false,
  "message": "User not found"
}
```

### Update User
```
PATCH /user/users/:id
Content-Type: application/json

Example: /user/users/507f1f77bcf86cd799439011

Request Body (All fields optional):
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "9876543210",
  "latitude": 51.5074,
  "longitude": -0.1278
}

Response (Success):
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "jane@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    ...
  }
}
```

### Delete User
```
DELETE /user/users/:id

Example: /user/users/507f1f77bcf86cd799439011

Response (Success):
{
  "success": true,
  "message": "User deleted successfully",
  "data": {}
}

Response (Error):
{
  "success": false,
  "message": "User not found"
}
```

---

## Frontend Features

### Pages

#### 1. Login/Register Page (index.html)
- Two forms: Login and Register
- Email and password validation
- Switch between forms
- Redirect to dashboard on success

**Features:**
- Email format validation
- Password length validation (min 6 chars)
- Phone number validation (optional)
- Error messages for each field
- Toast notifications
- Loading state on submit

#### 2. Dashboard Page (dashboard.html)
- User management table
- Map view with user locations
- Statistics section
- Sidebar navigation

**Sections:**
1. **Users Section**
   - Table of all users
   - Search/filter functionality
   - Add New User button
   - Edit and Delete buttons
   - Shows name, email, phone, location

2. **Map Section**
   - Interactive Leaflet map
   - All user locations marked
   - Click markers for user details
   - Auto-fit to show all users

3. **Statistics Section**
   - Total users count
   - Users with location
   - Registration date

---

## Frontend Functions

### Authentication (app.js)

```javascript
// Show register form
switchToRegister(event)

// Show login form
switchToLogin(event)

// Handle login submission
document.getElementById('loginFormElement').addEventListener('submit', async (e) => { ... })

// Handle register submission
document.getElementById('registerFormElement').addEventListener('submit', async (e) => { ... })

// Show toast notification
showToast(message, type)
// Types: 'success', 'error', 'info', 'warning'
```

### Dashboard Functions (dashboard.js)

```javascript
// Initialize dashboard
initDashboard()

// Load all users from API
loadUsers()

// Display users in table
displayUsers(users)

// Filter users by search term
filterUsers()

// Show specific section
showSection(section, event)
// Sections: 'users', 'map', 'stats'

// Update statistics
updateStats()

// Initialize map
initializeMap()

// Display user markers on map
displayUserMarkers()

// Add new user
openAddUserModal(event)

// Edit user
openEditUserModal(userId, event)

// Close user modal
closeUserModal()

// Delete confirmation
openDeleteModal(userId, event)

// Confirm delete user
confirmDelete()

// Logout user
logout()
```

---

## Form Validation Rules

### Registration Form
```
Email:
- Required
- Must be valid email format (user@domain.com)
- Must be unique in database

First Name:
- Required
- Max 50 characters

Last Name:
- Required
- Max 50 characters

Phone:
- Optional
- Must be 10 digits if provided

Password:
- Required for registration
- Minimum 6 characters
- Stored as hashed value
```

### Login Form
```
Email:
- Required
- Must be valid format

Password:
- Required
- Checked against hashed value
```

### User Management Form
```
Same as registration, except:
- Password is optional when editing
- Location can be set via map
```

---

## Data Storage

### Browser (localStorage)
```javascript
// Current user data
localStorage.getItem('user')
// Returns: { _id, email, firstName, lastName, phone, latitude, longitude }

// Set after login
localStorage.setItem('user', JSON.stringify(userData))

// Clear on logout
localStorage.removeItem('user')
```

### Database (MongoDB)
Users collection fields:
- `_id` - MongoDB ObjectId
- `email` - User email (unique)
- `firstName` - User first name
- `lastName` - User last name
- `phone` - Phone number
- `password` - Hashed password
- `latitude` - Location latitude
- `longitude` - Location longitude
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

---

## Error Messages

### Validation Errors
```
"Email is required"
"Please enter a valid email"
"Email already in use"
"First name is required"
"Last name is required"
"Phone number is required"
"Please enter a valid phone number"
"Password is required"
"Password must be at least 6 characters"
```

### API Errors
```
"Invalid credentials"
"User not found"
"User already exists"
"Failed to load users"
"Failed to save user"
"Failed to delete user"
"Error registering user"
"Error logging in"
```

---

## Map Features

### Location Selection
1. Click on map to select location
2. Coordinates show as Lat/Lng
3. Marker appears at clicked location
4. Can click multiple times to change

### User Markers
1. Show all users with coordinates
2. Click marker for user popup
3. Popup shows user details
4. "Edit" link to modify user
5. Auto-fit map to show all users

### Map Library
- **Leaflet.js** - Interactive maps
- **OpenStreetMap** - Map data
- **Latitude/Longitude** - Coordinate system

---

## Response Status Codes

```
200 - OK (successful GET, PATCH)
201 - Created (successful POST)
400 - Bad Request (validation error)
401 - Unauthorized (invalid credentials)
404 - Not Found (user not found)
500 - Server Error
```

---

## Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get All Users
```bash
curl http://localhost:5000/api/user/users
```

### Get Single User
```bash
curl http://localhost:5000/api/user/users/507f1f77bcf86cd799439011
```

### Update User
```bash
curl -X PATCH http://localhost:5000/api/user/users/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "latitude": 40.7128,
    "longitude": -74.0060
  }'
```

### Delete User
```bash
curl -X DELETE http://localhost:5000/api/user/users/507f1f77bcf86cd799439011
```

---

## Browser DevTools Tips

### Console
- Check for JavaScript errors
- See custom log messages
- Test API functions

### Network Tab
- Monitor API requests
- Check response status codes
- Debug CORS issues

### Storage
- View localStorage data
- Cookies and session data
- Clear cache

### Application
- View cached resources
- Service worker status
- Manifest files

---

## Common Tasks

### How to Add a New User?
1. Go to Dashboard
2. Click "Add New User" button
3. Fill in details
4. Click on map to select location
5. Click "Save User"

### How to Update User?
1. Find user in table
2. Click "Edit" button
3. Modify details
4. Update location on map if needed
5. Click "Save User"

### How to Delete User?
1. Find user in table
2. Click "Delete" button
3. Confirm in modal
4. User is deleted

### How to Search Users?
1. Use search box in Users section
2. Type name or email
3. Table updates automatically

### How to View Map?
1. Click "Map View" in sidebar
2. See all user locations
3. Click markers for details

---

## Performance Notes

- Users loaded on dashboard init
- Lazy map loading
- Toast auto-disappears (4s)
- Form validation on submit
- Modal transitions (0.3s)
- Table search in real-time

---

**Last Updated: 2024**
