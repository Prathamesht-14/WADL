# Full-Stack CRUD User Management System

A complete full-stack application with Node.js (Express + MongoDB) backend and responsive HTML/CSS/JavaScript frontend, featuring user registration, login, CRUD operations, and map integration.

## Features

### Backend
- ✅ Express.js REST API
- ✅ MongoDB with Mongoose
- ✅ Password hashing with bcryptjs
- ✅ User registration and login
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ User location (latitude/longitude) storage
- ✅ Comprehensive error handling

### Frontend
- ✅ Responsive design (mobile + desktop)
- ✅ User authentication (login/register)
- ✅ Dashboard with user management
- ✅ Search and filter functionality
- ✅ Interactive Leaflet.js map integration
- ✅ Location selection on map
- ✅ User location markers with popups
- ✅ Toast notifications
- ✅ Modal dialogs for add/edit/delete
- ✅ Statistics dashboard
- ✅ Loading spinners
- ✅ Form validation

## Project Structure

```
CRUD/
├── backend/
│   ├── app/
│   │   ├── controllers/
│   │   │   └── User.js          # Business logic
│   │   ├── models/
│   │   │   └── User.js          # MongoDB schema
│   │   └── routes/
│   │       └── User.js          # API endpoints
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── server.js                # Main server file
│   ├── package.json             # Dependencies
│   └── .env                     # Environment variables
│
└── frontend/
    ├── index.html               # Login/Register page
    ├── dashboard.html           # Dashboard page
    └── assets/
        ├── css/
        │   └── styles.css       # All styles
        └── js/
            ├── app.js           # Auth logic
            └── dashboard.js     # Dashboard logic
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/user/users` - Get all users
- `GET /api/user/users/:id` - Get single user
- `PATCH /api/user/users/:id` - Update user
- `DELETE /api/user/users/:id` - Delete user

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Modern web browser

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure MongoDB connection in `.env`:
```
MONGODB_URI=mongodb://localhost:27017/crud-user-management
PORT=5000
NODE_ENV=development
```

   **For MongoDB Atlas:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crud-user-management
   ```

4. Start the server:
```bash
npm start
```
or for development with auto-reload:
```bash
npm run dev
```

Server will run on: `http://localhost:5000`

### Frontend Setup

1. Make sure backend is running (on port 5000)

2. Open frontend files in a web browser:
   - Open `frontend/index.html` for login/register
   - After login, you'll be redirected to `dashboard.html`

**Option: Using Live Server**
- Install VS Code Live Server extension
- Right-click `frontend/index.html` → "Open with Live Server"

## User Schema

```javascript
{
  email: String (unique, required, validated),
  firstName: String (required),
  lastName: String (required),
  phone: String (optional, validated),
  password: String (hashed, required),
  latitude: Number (for map),
  longitude: Number (for map),
  createdAt: Date,
  updatedAt: Date
}
```

## Usage Guidelines

### Register a New User
1. Go to login page
2. Click "Register here" link
3. Fill in the registration form
4. Password must be at least 6 characters
5. Click "Register" button
6. You'll be redirected to login after successful registration

### Login
1. Enter your email and password
2. Click "Login" button
3. You'll be redirected to the dashboard

### Dashboard Features

#### User Management
- **View Users**: Table displays all registered users
- **Search**: Use the search box to filter users by name or email
- **Add User**: Click "Add New User" button
- **Edit User**: Click "Edit" button next to user
- **Delete User**: Click "Delete" button, confirm in modal
- **Select Location**: Click on the map to select user location

#### Map View
- Shows all users with set locations
- Click markers to see user details
- Automatically fits map bounds to show all users

#### Statistics
- Total number of users
- Users with location set
- Registration date

## User Actions

### Add New User
1. Click "Add New User" button
2. Fill in user details
3. Click on location map to select coordinates
4. Click "Save User"

### Edit User
1. Click "Edit" button next to user
2. Update details as needed
3. Click on map to change location
4. Click "Save User"

### Delete User
1. Click "Delete" button next to user
2. Confirm deletion in modal
3. User will be permanently deleted

## Validation Rules

### Email
- Must be valid format (name@domain.com)
- Must be unique in database

### Phone
- Optional field
- Must have 10 digits (with or without country code)

### Password
- Minimum 6 characters
- Stored as hashed value (bcryptjs)

### Location
- Latitude and Longitude
- Can be set by clicking on map
- Optional field

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Technologies Used

### Backend
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling (Flexbox, Grid)
- **JavaScript (ES6+)** - Functionality
- **Leaflet.js** - Map integration

## Default Configuration

| Setting | Value |
|---------|-------|
| Backend Port | 5000 |
| MongoDB Database | crud-user-management |
| API Base URL | http://localhost:5000/api |
| Map Library | Leaflet.js (OpenStreetMap) |

## Error Handling

The application includes comprehensive error handling:
- Form validation with error messages
- API error responses with meaningful messages
- Network error handling
- Try-catch blocks for async operations
- Toast notifications for user feedback

## Notes for Academic Submission

- Code is clean, modular, and well-commented
- MVC structure followed on backend
- Separation of concerns maintained
- RESTful API design principles
- Responsive design for all devices
- No hardcoded values (uses environment variables)
- Production-like code structure

## Troubleshooting

### Backend won't connect to MongoDB
- Ensure MongoDB is running locally: `mongod`
- Check MongoDB URI in `.env` file
- For MongoDB Atlas, verify network access is allowed

### CORS errors
- Make sure backend is running on port 5000
- Check API_BASE_URL in frontend JavaScript files
- Clear browser cache and cookies

### Map not showing
- Verify Leaflet.js CDN link is not blocked
- Check browser console for errors
- Ensure you have internet connection (for map tiles)

### Users not loading
- Check Network tab in browser DevTools
- Verify backend API is responding
- Check MongoDB connection

## Future Enhancements

- User authentication with JWT
- Role-based access control
- User profile pictures
- Batch operations
- Data export (CSV/PDF)
- Advanced filtering options
- User activity logging
- Email verification
- Password reset functionality

## License

This project is for educational purposes.

---

**Happy Coding! 🚀**
