# Setup & Installation Guide

## Quick Start (5 Minutes)

### Step 1: Install Node.js & MongoDB

#### Windows:
1. Download Node.js from https://nodejs.org/ (LTS version)
2. Run installer and follow setup
3. Download MongoDB Community from https://www.mongodb.com/try/download/community
4. Run MongoDB installer and follow setup
5. Start MongoDB service

#### Mac:
```bash
brew install node
brew install mongodb-community
brew services start mongodb-community
```

#### Linux:
```bash
sudo apt update
sudo apt install nodejs npm mongodb
sudo systemctl start mongodb
```

### Step 2: Setup Backend

1. Open terminal/command prompt
2. Navigate to the CRUD/backend folder:
```bash
cd path/to/CRUD/backend
```

3. Install dependencies:
```bash
npm install
```

4. Verify .env file exists with correct MongoDB URI

5. Start the server:
```bash
npm start
```

You should see:
```
Server running on port 5000
MongoDB Connected: localhost
```

### Step 3: Start Frontend

1. Open a new terminal
2. Navigate to frontend folder:
```bash
cd path/to/CRUD/frontend
```

3. Open index.html in your browser (one of these methods):

   **Option A: Double-click file**
   - Navigate to frontend folder in file explorer
   - Double-click `index.html`

   **Option B: Use Live Server (VS Code)**
   - Install "Live Server" extension
   - Right-click `index.html`
   - Select "Open with Live Server"

   **Option C: Use Python server**
   ```bash
   python -m http.server 8000
   # Then open http://localhost:8000 in browser
   ```

### Step 4: Test the Application

1. Go to login page
2. Click "Register here"
3. Create a new account with:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Phone: 1234567890
   - Password: password123
4. Login with the credentials
5. You should see the Dashboard

---

## Detailed Setup Instructions

### MongoDB Setup

#### Option 1: Local MongoDB

**Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Run MSI installer
3. Choose "Install MongoDB as a Service"
4. MongoDB will start automatically

**Verify it's running:**
```bash
mongo --version
```

#### Option 2: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster (free tier available)
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/database`
5. Update `.env` file in backend folder:
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/crud-user-management
```

### Backend Configuration

**File: backend/.env**

```env
# Database
MONGODB_URI=mongodb://localhost:27017/crud-user-management

# Server
PORT=5000
NODE_ENV=development
```

### Frontend Configuration

**File: frontend/assets/js/app.js & dashboard.js**

Look for this line (should already be correct):
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

If backend is on different server/port, update this URL.

---

## Running the Application

### Terminal 1: Backend Server
```bash
cd backend
npm install
npm start
```

Output should show:
```
Server running on port 5000
MongoDB Connected: localhost
```

### Terminal 2: Frontend Server

Choose one method:

**Method 1: Live Server (Recommended)**
```bash
# In VS Code, right-click index.html → Open with Live Server
```

**Method 2: Python HTTP Server**
```bash
cd frontend
python -m http.server 8000
# Open http://localhost:8000 in browser
```

**Method 3: Direct File**
```bash
# Open frontend/index.html directly in browser
# Note: Some features may not work with file:// protocol
```

---

## Testing Each Feature

### 1. Authentication
- [ ] Register new user
- [ ] Login with registered user
- [ ] See error for invalid credentials
- [ ] Logout and return to login

### 2. User Management
- [ ] View all users in table
- [ ] Add new user
- [ ] Edit existing user
- [ ] Delete user
- [ ] Search/filter users

### 3. Map Integration
- [ ] Click on map to select location during user creation
- [ ] See user markers on map view
- [ ] Click marker to see user details
- [ ] Update user location
- [ ] Map auto-fits to show all users

### 4. Validation
- [ ] Email must be valid format
- [ ] Password minimum 6 characters
- [ ] Phone validation
- [ ] Required fields validation

### 5. UI/UX
- [ ] Responsive design works on mobile
- [ ] Toast notifications appear
- [ ] Loading spinners show during API calls
- [ ] Error messages display correctly
- [ ] Modal dialogs work properly

---

## Troubleshooting

### Issue: "Cannot connect to MongoDB"

**Solution:**
```bash
# Windows: Start MongoDB service
net start MongoDB

# Mac: Restart MongoDB
brew services restart mongodb-community

# Linux: Start MongoDB
sudo systemctl start mongodb
```

### Issue: "Port 5000 already in use"

**Solution:**
```bash
# Change port in .env file
PORT=5001

# Or find and kill process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5000
kill -9 <PID>
```

### Issue: "CORS error in browser console"

**Solution:**
- Ensure backend is running on port 5000
- Check API_BASE_URL in JavaScript files
- Clear browser cache (Ctrl+Shift+Delete)

### Issue: "Map not showing"

**Solution:**
- Check internet connection (map tiles needed)
- Verify Leaflet CDN is accessible
- Check browser console for errors
- Try different browser

### Issue: "Cannot find module 'express'"

**Solution:**
```bash
cd backend
npm install
npm start
```

---

## Database Management

### View MongoDB Data (Command Line)

```bash
# Open MongoDB shell
mongosh

# List databases
show dbs

# Use CRUD database
use crud-user-management

# View users collection
db.users.find()

# Count users
db.users.countDocuments()
```

### Clear Database

```bash
# In MongoDB shell
use crud-user-management
db.users.deleteMany({})
```

---

## Development vs Production

### Development Mode
```env
NODE_ENV=development
```
- More verbose error messages
- Easier debugging
- Auto-reload with nodemon

### Production Mode
```env
NODE_ENV=production
```
- Optimized performance
- Minimal error details
- Build optimization

---

## Useful Commands

### Backend
```bash
# Install dependencies
npm install

# Start server
npm start

# Start with auto-reload
npm run dev

# Check port usage
netstat -ano | findstr :5000
```

### MongoDB
```bash
# Connect to database
mongosh

# Backup database
mongodump --out ./backup

# Restore database
mongorestore ./backup
```

### Frontend
```bash
# Python HTTP server
python -m http.server 8000

# Node.js HTTP server
npx http-server
```

---

## Performance Tips

1. **Compress Images**: Users with photos
2. **Lazy Load**: Load users as needed
3. **Cache API Calls**: Reduce database queries
4. **Optimize Bundle**: Minify CSS/JS for production
5. **Index Database**: Add indexes to frequently queried fields

---

## Security Considerations

⚠️ **This is for educational purposes. For production:**

- [ ] Use JWT tokens instead of localStorage
- [ ] Add input sanitization
- [ ] Implement rate limiting
- [ ] Add HTTPS encryption
- [ ] Use environment variables for secrets
- [ ] Implement password reset functionality
- [ ] Add email verification
- [ ] Use helmet.js for security headers
- [ ] Implement CSRF protection
- [ ] Add role-based access control

---

## Getting Help

If you encounter issues:

1. **Check Console**: Open browser DevTools (F12)
2. **Check Logs**: Look at terminal output
3. **Check Network**: See API responses in Network tab
4. **Check Database**: Verify MongoDB is running
5. **Try Restart**: Restart both backend and frontend

---

## Next Steps

After successful setup:

1. Explore the code
2. Try modifying styles.css
3. Add new features
4. Deploy to cloud (Heroku, MongoDB Atlas)
5. Add authentication (JWT)
6. Add user roles and permissions

Happy coding! 🚀
