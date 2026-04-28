# Real-Time Crime Reporting System - Development Setup Guide

## Prerequisites

- **Node.js**: v14 or higher (Get from nodejs.org)
- **MongoDB**: v5.0 or higher
  - Local: Download from mongodb.com/try/download/community
  - Cloud: Create free account on mongodb.com/cloud
- **npm** or **yarn**: Package manager
- **Git**: Version control (optional)

## Installation Methods

### Method 1: Using Docker (Recommended)

**Windows/Mac/Linux**

1. Install Docker Desktop from docker.com

2. Start MongoDB container:
```bash
docker-compose up -d
```

3. Verify MongoDB is running:
```bash
docker ps
# Look for mongo:6.0 container
```

4. MongoDB connection string:
```
mongodb://admin:password@localhost:27017/crime-reporting?authSource=admin
```

### Method 2: Local MongoDB Installation

**Windows**

1. Download from mongodb.com/try/download/community
2. Run installer
3. Choose "Run as Service"
4. Start MongoDB Service:
   - Services > MongoDB Server > Start
5. Connection string:
```
mongodb://localhost:27017/crime-reporting
```

**macOS**

```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

Connection string:
```
mongodb://localhost:27017/crime-reporting
```

**Linux (Ubuntu)**

```bash
# Add repository
curl https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start service
sudo systemctl start mongod
```

### Method 3: MongoDB Atlas Cloud (Free)

1. Go to mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Use format:
```
mongodb+srv://username:password@cluster-name.mongodb.net/crime-reporting?retryWrites=true&w=majority
```

## Backend Setup

### Step 1: Navigate to Server Directory
```bash
cd server
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create Environment File
Create `.env` file with:
```env
MONGODB_URI=mongodb://localhost:27017/crime-reporting
PORT=5000
NODE_ENV=development
JWT_SECRET=dev_secret_key_here
GOOGLE_MAPS_API_KEY=your_key_here
CLIENT_URL=http://localhost:3000
```

### Step 4: Start Server
```bash
# Development (with auto-reload)
npm run dev

# OR Production
npm start
```

Expected output:
```
🚀 Server running on port 5000
✅ MongoDB connected
🔌 Socket.IO ready
```

## Frontend Setup

### Step 1: Navigate to Client Directory
```bash
cd client
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create Environment File (Optional)
Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Step 4: Start Frontend
```bash
npm start
```

Browser will auto-open to `http://localhost:3000`

## Verification Checklist

- [ ] Node.js installed: `node -v` (should be v14+)
- [ ] npm installed: `npm -v`
- [ ] MongoDB running: Connect to port 27017
- [ ] Backend running: `http://localhost:5000/api/health`
- [ ] Frontend running: `http://localhost:3000` opens in browser
- [ ] Both .env files created with values

## Testing the Setup

### Test 1: Backend Health Check
```bash
curl http://localhost:5000/api/health
# Expected response: { "status": "Server is running" }
```

### Test 2: Create Admin Account
```bash
curl -X POST http://localhost:5000/api/admins/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Admin",
    "email": "admin@test.com",
    "password": "password123",
    "role": "admin"
  }'
```

### Test 3: Submit Crime Report
```bash
curl -X POST http://localhost:5000/api/reports \
  -F "description=Test incident" \
  -F "crimeType=theft" \
  -F "severity=medium" \
  -F "latitude=40.7128" \
  -F "longitude=-74.0060" \
  -F "address=Test Address"
```

## Common Issues & Solutions

### Issue: MongoDB Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
- Verify MongoDB is running
- Check connection string in .env
- For Docker: `docker ps` to verify container status
- Try: `docker-compose up -d mongodb`

### Issue: Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
- Change PORT in .env (e.g., 5001)
- OR kill process using port:
  - Windows: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`
  - Mac/Linux: `lsof -i :5000` then `kill -9 <PID>`

### Issue: npm Install Fails
```
Error: npm ERR! code ERESOLVE
```

**Solution:**
```bash
npm install --legacy-peer-deps
```

### Issue: React App Won't Start
```
Error: ENOENT: no such file or directory
```

**Solution:**
- Clear cache: `rm -rf node_modules && npm install`
- Try: `npm cache clean --force`

## Database Management

### View MongoDB Collections
```bash
# Connect to MongoDB
mongo mongodb://localhost:27017/crime-reporting

# List collections
show collections

# View reports
db.reports.find().pretty()

# View admins
db.admins.find().pretty()
```

### Reset Database
```bash
# In MongoDB shell
db.dropDatabase()

# Then backend will recreate collections
```

## File Structure Verification

```
Real-Time Crime Reporting System/
├── server/
│   ├── node_modules/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
├── client/
│   ├── node_modules/
│   ├── src/
│   ├── public/
│   ├── .env (optional)
│   └── package.json
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Next Steps

1. **Local Development**: Run both backend and frontend
2. **Test Functionality**: Submit reports, view on map, test admin panel
3. **Customize**: Modify colors, texts, add features
4. **Production**: Follow deployment guides in README.md

## Performance Tips

- Use `npm install --legacy-peer-deps` if regular install fails
- Keep MongoDB indexes updated for faster queries
- Use Socket.IO namespaces for better real-time organization
- Cache frequently accessed data on frontend

## Debugging

### Backend Debug Logs
```bash
# Enable verbose logging
DEBUG=* npm run dev
```

### Frontend Debug Console
- Open DevTools: F12 or Ctrl+Shift+I
- Check Console tab for errors
- Use Network tab to inspect API calls

### MongoDB Logs
```bash
# View MongoDB logs
tail -f /var/log/mongodb/mongod.log  # macOS/Linux
```

## Additional Resources

- Node.js Docs: nodejs.org/docs
- Express Guide: expressjs.com
- MongoDB Manual: docs.mongodb.com
- React Docs: react.dev
- Socket.IO Guide: socket.io/docs

---

**Ready?** Follow the steps above and run the application!

Made with ❤️ for community safety
