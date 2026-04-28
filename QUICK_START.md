# Quick Start Guide - Real-Time Crime Reporting System

## 🚀 5-Minute Setup

### Prerequisites
- Node.js installed (v14+)
- MongoDB running locally or MongoDB Atlas account
- Terminal/Command Prompt

### Step 1: Backend Setup (Terminal 1)

```bash
cd server
npm install
```

Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/crime-reporting
PORT=5000
NODE_ENV=development
JWT_SECRET=dev_secret_key_123
GOOGLE_MAPS_API_KEY=your_api_key
CLIENT_URL=http://localhost:3000
```

Start server:
```bash
npm run dev
```

✅ Backend running on `http://localhost:5000`

### Step 2: Frontend Setup (Terminal 2)

```bash
cd client
npm install
```

Start frontend:
```bash
npm start
```

✅ Frontend running on `http://localhost:3000` (auto-opens in browser)

## 🧪 Quick Test

### Test 1: Submit a Crime Report
1. Click "📝 Report Crime" in navigation
2. Allow location access
3. Fill in the form:
   - Crime Type: Select any
   - Description: "Test incident"
   - Severity: Medium
4. Click "📨 Submit Report"
5. See success message

### Test 2: View Live Map
1. Click "🗺️ Live Map"
2. See your submitted report on map
3. Click markers to view details

### Test 3: Admin Functionality
1. Click "👤 Admin" in navigation
2. Choose "Register here"
3. Fill admin registration:
   - Name: Test Admin
   - Email: admin@test.com
   - Password: password123
4. Click "✍️ Register"
5. You're now in Admin Dashboard
6. View and manage reports

## 📊 Database Setup

### MongoDB Local Setup
```bash
# Windows users using MongoDB Community
mongod
```

### MongoDB Atlas Setup
1. Create account at mongodb.com/cloud
2. Create cluster
3. Get connection string
4. Update MONGODB_URI in .env

## 🔧 Troubleshooting

**Issue**: Port already in use
```bash
# Change PORT in .env (e.g., 5001)
# Frontend auto-configures to backend
```

**Issue**: Cannot connect to MongoDB
```bash
# Verify MongoDB running
# Check connection string format
# For Atlas: mongodb+srv://user:pass@cluster.mongodb.net/database
```

**Issue**: CORS errors
```bash
# Ensure CLIENT_URL is correct in backend .env
# Should be http://localhost:3000 for local dev
```

## 📁 File Uploads

Create uploads directory (if not exists):
```bash
mkdir server/uploads
```

Test file upload:
1. Go to Report Crime page
2. Select "Upload Photos/Videos"
3. Max 5 files, 50MB each

## 🔌 Real-time Testing

1. Open two browser windows
2. Window 1: Go to `/map`
3. Window 2: Go to `/report`
4. Submit report in Window 2
5. Watch report appear instantly in Window 1

## 🎯 Common Tasks

### Create More Admin Users
1. Login as existing admin
2. Go to dashboard
3. Create new admin accounts via registration page

### View Statistics
1. Go to Admin Dashboard
2. See crime distribution chart
3. Filter reports by type/status

### Monitor Reports
1. Dashboard shows real-time count
2. Click "👁️ View" to see details
3. Update status and add notes

## 📦 Production Deployment

### Backend (Heroku)
```bash
cd server
heroku create your-app
heroku config:set MONGODB_URI=your_uri
git push heroku main
```

### Frontend (Vercel)
```bash
cd client
vercel
```

## 🆘 Need Help?

- Check `README.md` in project root
- Check `server/README.md` for backend details
- Check `client/README.md` for frontend details
- Review console logs in browser/terminal

## ✅ Verification Checklist

- [ ] Backend running on 5000
- [ ] Frontend running on 3000
- [ ] MongoDB connected
- [ ] Can see home page
- [ ] Can submit crime report
- [ ] Can view map
- [ ] Can login as admin
- [ ] Real-time updates working

## 🎉 You're Ready!

Your Real-Time Crime Reporting System is now running locally. 

**Next Steps:**
1. Customize the UI colors/branding
2. Add more crime types
3. Integrate with real authorities
4. Deploy to production
5. Scale infrastructure

---

For detailed documentation, see the main README.md file.

Made with ❤️ for community safety
