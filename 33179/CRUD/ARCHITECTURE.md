# System Architecture & Data Flow Diagrams

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                              │
│                    (Browser - Frontend)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐          ┌──────────────────┐             │
│  │  index.html      │          │ dashboard.html   │             │
│  │  (Login/Reg)     │          │   (CRUD Page)    │             │
│  └────────┬─────────┘          └────────┬─────────┘             │
│           │                              │                       │
│  ┌────────▼──────────────────────────────▼──────────────────┐   │
│  │        assets/js/app.js              dashboard.js        │   │
│  │  - Login validation         - User management            │   │
│  │  - Register handler         - API calls                  │   │
│  │  - Auth flow                - Map integration            │   │
│  │  - localStorage             - CRUD operations            │   │
│  └────────┬──────────────────────────────┬──────────────────┘   │
│           │                              │                       │
│  ┌────────▼──────────────────────────────▼──────────────────┐   │
│  │        assets/css/styles.css                             │   │
│  │  - Responsive design                                     │   │
│  │  - Components styling                                    │   │
│  │  - Animations                                            │   │
│  └────────┬──────────────────────────────┬──────────────────┘   │
│           │                              │                       │
│  ┌────────▼──────────────────────────────▼──────────────────┐   │
│  │        External Libraries                                │   │
│  │  - Leaflet.js (Maps)                                     │   │
│  │  - OpenStreetMap (Map Tiles)                             │   │
│  └───────────────────────┬─────────────────────────────────┘   │
│                          │                                      │
└──────────────────────────┼──────────────────────────────────────┘
                           │
                      FETCH API (HTTP)
                    JSON Request/Response
                           │
┌──────────────────────────┼──────────────────────────────────────┐
│                          │        SERVER SIDE                    │
│                 (Backend - Node.js + Express)                   │
├──────────────────────────┼──────────────────────────────────────┤
│                          ▼                                       │
│        ┌──────────────────────────────────┐                     │
│        │      server.js (Express App)     │                     │
│        │  - CORS enabled                  │                     │
│        │  - Routes registration           │                     │
│        │  - Middleware setup              │                     │
│        └────────┬─────────────────────────┘                     │
│                 │                                                │
│  ┌──────────────▼────────────────────────────────────┐          │
│  │      app/routes/User.js (Route Handlers)         │          │
│  │  POST   /auth/register                           │          │
│  │  POST   /auth/login                              │          │
│  │  GET    /user/users              ──┐             │          │
│  │  GET    /user/users/:id            ├─→ Requests │          │
│  │  PATCH  /user/users/:id            │  routed to │          │
│  │  DELETE /user/users/:id          ──┘  Controller│          │
│  └──────────────┬────────────────────────────────────┘          │
│                 │                                                │
│  ┌──────────────▼────────────────────────────────────┐          │
│  │   app/controllers/User.js (Business Logic)       │          │
│  │  - registerUser()                                │          │
│  │  - loginUser()                                   │          │
│  │  - getAllUsers()                                 │          │
│  │  - getSingleUser(id)                             │          │
│  │  - updateUser(id)                                │          │
│  │  - deleteUser(id)                                │          │
│  │  - Password hashing (bcryptjs)                   │          │
│  │  - Validation logic                              │          │
│  └──────────────┬────────────────────────────────────┘          │
│                 │                                                │
│  ┌──────────────▼────────────────────────────────────┐          │
│  │    app/models/User.js (Mongoose Schema)          │          │
│  │  - Define database structure                     │          │
│  │  - Email, firstName, lastName, phone             │          │
│  │  - password (hashed), latitude, longitude        │          │
│  │  - Field validation                              │          │
│  │  - Timestamps (createdAt, updatedAt)             │          │
│  └──────────────┬────────────────────────────────────┘          │
│                 │                                                │
│  ┌──────────────▼────────────────────────────────────┐          │
│  │   config/database.js (MongoDB Connection)        │          │
│  │  - Mongoose connection                           │          │
│  │  - Connection string from .env                   │          │
│  │  - Error handling                                │          │
│  └──────────────┬────────────────────────────────────┘          │
│                 │                                                │
└─────────────────┼────────────────────────────────────────────────┘
                  │
               MONGOOSE
               (ODM Layer)
                  │
┌─────────────────┼────────────────────────────────────────────────┐
│                 ▼                                                 │
│        MongoDB Database                                          │
│        ├── CRUD User Management                                  │
│        └── users collection                                      │
│            ├── email (unique index)                              │
│            ├── firstName, lastName                               │
│            ├── phone, password (hashed)                          │
│            ├── latitude, longitude                               │
│            └── createdAt, updatedAt                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request/Response Flow

### Registration Flow
```
1. User Form Input
   ├── firstName, lastName, email, phone, password
   └── Click "Register"

2. Frontend Processing (app.js)
   ├── Validate inputs
   ├── Show loading spinner
   └── Send JSON POST request

3. Network Layer
   └── POST /auth/register

4. Backend Processing (server.js → routes → controller)
   ├── Authenticate request
   ├── Validate data
   ├── Hash password (bcryptjs)
   ├── Create user in database
   └── Return user object

5. Network Response
   └── JSON success/error response

6. Frontend Handling (app.js)
   ├── Check response success
   ├── Show toast notification
   ├── Clear input fields
   └── Redirect to login

7. User Action
   └── Login with new credentials
```

### Login Flow
```
1. User Submits Credentials
   ├── Email & Password
   └── Click "Login"

2. Frontend Validation (app.js)
   ├── Check email format
   ├── Check password exists
   ├── Show loading spinner
   └── Send POST request

3. Network Request
   └── POST /auth/login

4. Backend Authentication (controller)
   ├── Find user by email
   ├── Compare passwords (bcryptjs)
   ├── If valid: return user data
   └── If invalid: return error

5. Network Response
   └── User data or error message

6. Frontend Handling (app.js)
   ├── Save user to localStorage
   ├── Show success toast
   └── Redirect to dashboard

7. Dashboard Access
   ├── Check localStorage for user
   ├── Load all users from API
   └── Display dashboard
```

### CRUD Operations Flow
```
Add User:
  Form Input → Validation → API POST → Controller → DB Save → Response → Show Table

Edit User:
  Get User → Fill Form → Edit Data → API PATCH → Controller → DB Update → Response → Refresh Table

Delete User:
  Click Delete → Confirm Modal → API DELETE → Controller → DB Delete → Response → Refresh Table

View All:
  Dashboard Load → API GET → Controller → DB Query → Response → Display Table
```

---

## 📡 API Endpoints Map

```
┌─ /api
│
├─ /auth
│  ├─ POST /register      (Create new user)
│  └─ POST /login         (Authenticate user)
│
└─ /user
   ├─ /users
   │  ├─ GET              (Fetch all users)
   │  ├─ POST             (Create user via dashboard)
   │  │
   │  └─ /:id
   │     ├─ GET           (Fetch single user)
   │     ├─ PATCH         (Update user)
   │     └─ DELETE        (Remove user)
   │
   └─ /health             (Server status)
```

---

## 💾 Data Flow in CRUD

### Create User
```
Frontend Form
    ↓
Validation
    ↓
POST /user/register
    ↓
Controller: registerUser()
    ↓
Hash Password
    ↓
Create User Model
    ↓
Save to MongoDB
    ↓
Return Success Response
    ↓
Update UI Table
```

### Read Users
```
Frontend Dashboard Load
    ↓
GET /user/users
    ↓
Controller: getAllUsers()
    ↓
Query MongoDB
    ↓
Return Array of Users
    ↓
Display in Table
```

### Update User
```
Frontend Edit Button
    ↓
Load User Data (GET /user/users/:id)
    ↓
Display in Modal Form
    ↓
User Modifies Data
    ↓
PATCH /user/users/:id
    ↓
Controller: updateUser()
    ↓
Update MongoDB Document
    ↓
Return Updated User
    ↓
Refresh Table
```

### Delete User
```
Frontend Delete Button
    ↓
Show Confirmation Modal
    ↓
User Confirms
    ↓
DELETE /user/users/:id
    ↓
Controller: deleteUser()
    ↓
Remove from MongoDB
    ↓
Return Success
    ↓
Remove from Table
```

---

## 🗺️ Map Component Architecture

```
┌─────────────────────────────────────────────┐
│          Dashboard Page                      │
│    (dashboard.html)                          │
├─────────────────────────────────────────────┤
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │   Map Section (Leaflet Container)      │ │
│  │   id="map"                             │ │
│  │   Dimensions: 100% × 400px             │ │
│  ├────────────────────────────────────────┤ │
│  │                                        │ │
│  │  ┌──────────────────────────────────┐ │ │
│  │  │  L.map() - Leaflet Instance      │ │ │
│  │  │  Tile Layer - OpenStreetMap      │ │ │
│  │  │  User Markers - L.marker()       │ │ │
│  │  │  Popups - L.popup()              │ │ │
│  │  │  Event Listeners                 │ │ │
│  │  └──────────────────────────────────┘ │ │
│  │                                        │ │
│  └────────────────────────────────────────┘ │
│                                              │
└─────────────────────────────────────────────┘
         ↓ Data Flow ↓
   
APIsend GET /user/users
    ↓
Get All Users with (latitude, longitude)
    ↓
displayUserMarkers()
    ↓
Loop through users
    ├─ If user has coordinates
    ├─ Create L.marker([lat, lng])
    ├─ Add to map
    └─ Add popup with user info
    ↓
Fit map to marker bounds
    ↓
Show all users on map
```

---

## 🔐 Authentication Architecture

```
Login/Register Page
    ↓
┌──────────────────┐
│ Form Submission  │
└────────┬─────────┘
         ↓
┌─────────────────────────────────────────┐
│  Frontend Validation                    │
│  - Email format check                   │
│  - Password length check                │
│  - Fields not empty                     │
└────────┬────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│  API Request (HTTPS in production)      │
│  POST /auth/login or /auth/register     │
└────────┬────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│  Backend Validation                     │
│  - Check required fields                │
│  - Email format validation              │
│  - Check database for duplicates        │
└────────┬────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│  Password Processing                    │
│  REGISTER: Hash & Save                  │
│  LOGIN: Compare with stored hash        │
└────────┬────────────────────────────────┘
         ↓
         │
    ┌────┴────┐
    │          │
    ✓          ✗
    │          │
Success      Error
    │          │
    ↓          ↓
Save to    Return
localStorage Error
    │
    ↓
Redirect to
Dashboard
```

---

## 🎨 Frontend Component Hierarchy

```
Page Structure
    │
    ├─ Navbar
    │  ├─ App Title
    │  ├─ User Display
    │  └─ Logout Button
    │
    ├─ Toast Container
    │  └─ Dynamic Toasts
    │
    ├─ Dashboard Layout
    │  │
    │  ├─ Sidebar
    │  │  └─ Menu
    │  │     ├─ Users
    │  │     ├─ Map View
    │  │     └─ Statistics
    │  │
    │  └─ Main Content
    │     ├─ Users Section
    │     │  ├─ Header
    │     │  ├─ Search Bar
    │     │  └─ Users Table
    │     │
    │     ├─ Map Section
    │     │  └─ Leaflet Map
    │     │
    │     └─ Statistics Section
    │        └─ Stats Cards
    │
    ├─ User Modal
    │  ├─ Form Fields
    │  ├─ Location Map
    │  └─ Buttons
    │
    └─ Delete Modal
       ├─ Confirmation Message
       └─ Action Buttons
```

---

## 📊 Database Schema Diagram

```
MongoDB Database: "crud-user-management"
    │
    └─ Collection: "users"
       │
       └─ Documents
          │
          ├─ _id: ObjectId (Primary Key)
          │
          ├─ email: String (Unique Index)
          │  └─ Validates: RFC 5322 email format
          │
          ├─ firstName: String
          │  └─ Max Length: 50
          │
          ├─ lastName: String
          │  └─ Max Length: 50
          │
          ├─ phone: String (Optional)
          │  └─ Validates: 10 digits with country code
          │
          ├─ password: String (Hashed)
          │  └─ Algorithm: bcryptjs with salt rounds 10
          │
          ├─ latitude: Number
          │  └─ Range: -90 to 90
          │
          ├─ longitude: Number
          │  └─ Range: -180 to 180
          │
          ├─ createdAt: Date (Auto)
          │  └─ Set on document creation
          │
          └─ updatedAt: Date (Auto)
             └─ Updated on any modification
```

---

## 🔄 Session Management

```
User Registration/Login
    ↓
Server Response (User Data)
    ↓
localStorage.setItem('user', userData)
    ↓
┌─────────────────────────────────┐
│   localStorage                  │
│   ├─ _id                       │
│   ├─ email                     │
│   ├─ firstName                 │
│   ├─ lastName                  │
│   ├─ phone                     │
│   ├─ latitude                  │
│   ├─ longitude                 │
│   ├─ createdAt                 │
│   └─ updatedAt                 │
└─────────────────────────────────┘
    ↓
Persisted Until:
    ├─ User clicks Logout
    ├─ Browser data cleared
    └─ localStorage.removeItem('user')
```

---

## ⚡ Performance Flow

```
Page Load
    ↓
Check localStorage for user
    ├─ YES: Continue to dashboard
    └─ NO: Redirect to login
    ↓
Dashboard Load
    ├─ Load CSS
    ├─ Load JS
    ├─ Initialize JavaScript
    └─ Fetch users list
    ↓
User Action
    ├─ Form Submission
    ├─ Show Loading Spinner
    ├─ Disable Buttons
    ├─ Send API Request
    └─ Handle Response
    ↓
Update UI
    ├─ Refresh Table
    ├─ Show Success Toast
    ├─ Close Modal
    └─ Clear Form
```

---

**This architecture ensures:**
- ✅ Clear separation of concerns
- ✅ Scalable design
- ✅ Secure authentication
- ✅ Efficient data management
- ✅ Responsive user experience
- ✅ Easy to maintain and extend

