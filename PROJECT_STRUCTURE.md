# Project Structure Overview

## 📦 Complete File Structure

```
Real-Time Crime Reporting System/
│
├── 📄 README.md                 # Main project documentation
├── 📄 QUICK_START.md            # 5-minute setup guide
├── 📄 SETUP_GUIDE.md            # Detailed setup instructions
├── 📄 .env.example              # Environment variables template
├── 📄 docker-compose.yml        # Docker setup for local dev
├── 📄 .gitignore                # Git ignore rules
│
├── 📁 server/                   # Backend - Node.js + Express
│   ├── 📄 package.json          # Backend dependencies
│   ├── 📄 server.js             # Main server entry point
│   ├── 📄 .env.example          # Server env template
│   ├── 📄 README.md             # Backend documentation
│   │
│   ├── 📁 models/
│   │   ├── Report.js            # Crime report schema
│   │   └── Admin.js             # Admin user schema
│   │
│   ├── 📁 controllers/
│   │   ├── reportController.js  # Report business logic
│   │   └── adminController.js   # Admin business logic
│   │
│   ├── 📁 routes/
│   │   ├── reports.js           # Report endpoints
│   │   └── admins.js            # Admin endpoints
│   │
│   ├── 📁 middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── upload.js            # File upload handling
│   │
│   └── 📁 uploads/              # Uploaded media files
│       └── .gitkeep             # Ensure directory tracked
│
└── 📁 client/                   # Frontend - React
    ├── 📄 package.json          # Frontend dependencies
    ├── 📄 README.md             # Frontend documentation
    │
    ├── 📁 public/
    │   └── index.html           # HTML template
    │
    └── 📁 src/
        ├── 📄 App.js            # Main React component
        ├── 📄 App.css           # Global styles
        ├── 📄 index.js          # React entry point
        ├── 📄 index.css         # Global CSS
        │
        ├── 📁 components/
        │   └── Navigation.js    # Header navigation component
        │
        ├── 📁 pages/
        │   ├── Home.js          # Landing page
        │   ├── ReportCrime.js   # Crime reporting form
        │   ├── LiveMap.js       # Interactive map page
        │   ├── AdminLogin.js    # Admin authentication
        │   └── AdminDashboard.js # Admin management panel
        │
        ├── 📁 styles/
        │   ├── home.css         # Home page styling
        │   ├── report.css       # Report form styling
        │   ├── map.css          # Live map styling
        │   ├── admin.css        # Admin panel styling
        │   └── navigation.css   # Navigation styling
        │
        └── 📁 utils/
            ├── api.js           # Axios API client
            └── socket.js        # Socket.IO setup
```

## 🔧 Key Components

### Backend (Node.js + Express)

**Entry Point**: `server/server.js`
- Express app initialization
- MongoDB connection
- Socket.IO server setup
- CORS configuration
- Static file serving

**Models**
- `Report`: Crime incident data
- `Admin`: Admin user accounts

**Controllers**
- `reportController`: Create, read, update, delete reports
- `adminController`: Admin authentication and management

**Middleware**
- `auth.js`: JWT token verification
- `upload.js`: Multer file upload handling

**Routes**
- `/api/reports`: Report CRUD operations
- `/api/admins`: Admin authentication

### Frontend (React)

**Entry Point**: `client/src/index.js` → `client/public/index.html`

**Pages**
- `Home`: Landing page with features
- `ReportCrime`: Crime reporting form
- `LiveMap`: Interactive map with reports
- `AdminLogin`: Admin authentication
- `AdminDashboard`: Admin management console

**Components**
- `Navigation`: Top navigation bar

**Utilities**
- `api.js`: Axios instance with JWT interceptors
- `socket.js`: Socket.IO client connection

**Styles**
- Global: `App.css` with responsive design
- Component-specific: CSS files per page/component

## 📊 Data Flow

### Crime Report Submission
1. User fills form on `ReportCrime` page
2. Form data sent via `reportAPI.createReport()`
3. Backend validates and stores in MongoDB
4. Socket.IO emits `newReport` event
5. All connected clients receive update
6. Report appears on `LiveMap` in real-time

### Admin Status Update
1. Admin opens `AdminDashboard`
2. Selects report and changes status
3. API call to `updateReportStatus()`
4. Backend updates MongoDB
5. Socket.IO emits `reportUpdated` event
6. Changes broadcast to all clients

### Real-time Map Updates
1. Client connects to Socket.IO on `LiveMap`
2. Joins `reports` channel
3. Receives `newReport` and `reportUpdated` events
4. Updates report markers and list dynamically
5. No page refresh needed

## 🗄️ Database Schema

### Reports Collection
```javascript
{
  _id: ObjectId,
  description: String,
  location: {
    type: "Point",
    coordinates: [longitude, latitude],
    address: String
  },
  crimeType: String (enum),
  severity: String (enum),
  mediaFiles: [{
    filename: String,
    path: String,
    type: String
  }],
  isAnonymous: Boolean,
  reporterName: String,
  reporterEmail: String,
  reporterPhone: String,
  status: String (enum),
  adminNotes: String,
  responses: [{
    responderId: ObjectId,
    message: String,
    timestamp: Date
  }],
  views: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Admins Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin/moderator/responder),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints Summary

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | /api/reports | Create report | Public |
| GET | /api/reports | List reports | Public |
| GET | /api/reports/nearby | Nearby reports | Public |
| GET | /api/reports/:id | Get single | Public |
| PATCH | /api/reports/:id/status | Update status | Admin |
| POST | /api/reports/:id/response | Add response | Admin |
| DELETE | /api/reports/:id | Delete report | Admin |
| GET | /api/reports/stats/all | Statistics | Public |
| POST | /api/admins/register | Register admin | Public |
| POST | /api/admins/login | Login admin | Public |
| GET | /api/admins/me | Current admin | Admin |
| GET | /api/admins | List admins | Admin |
| PATCH | /api/admins/:id | Update admin | Admin |
| DELETE | /api/admins/:id | Delete admin | Admin |

## 🔌 Socket.IO Events

| Event | From | To | Data |
|-------|------|-----|------|
| joinReports | Client | Server | - |
| newReport | Server | Clients | Report object |
| reportUpdated | Server | Clients | Updated report |
| responseAdded | Server | Clients | Response data |

## 📱 UI Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| / | Home | Landing page |
| /report | ReportCrime | Submit report |
| /map | LiveMap | View map |
| /admin/login | AdminLogin | Admin auth |
| /admin/dashboard | AdminDashboard | Admin panel |

## 🔐 Authentication Flow

1. Admin registers via `AdminLogin`
2. Password hashed with bcryptjs
3. JWT token generated
4. Token stored in localStorage
5. Token sent in Authorization header
6. Backend verifies with JWT middleware
7. Protected routes check token
8. Logout removes token from storage

## 📦 Dependencies

### Backend
- express (web framework)
- mongoose (database ODM)
- socket.io (real-time)
- multer (file upload)
- bcryptjs (password hashing)
- jsonwebtoken (JWT)
- cors (cross-origin)
- dotenv (env config)

### Frontend
- react (UI library)
- react-router-dom (routing)
- axios (HTTP client)
- socket.io-client (real-time)
- leaflet (maps)
- react-leaflet (React maps wrapper)

## 🚀 Deployment Checklist

- [ ] Backend deployed (Heroku, Railway, etc.)
- [ ] Frontend deployed (Vercel, Netlify, etc.)
- [ ] MongoDB Atlas configured
- [ ] Environment variables set
- [ ] CORS configured
- [ ] SSL/HTTPS enabled
- [ ] File uploads to cloud storage
- [ ] Email notifications configured
- [ ] Monitoring set up
- [ ] Backup strategy implemented

## 📈 Performance Optimization

- Geospatial indexing on location
- Pagination for large result sets
- Socket.IO namespaces for organization
- Frontend lazy loading of routes
- Image optimization for uploads
- Caching strategies
- Database query optimization

## 🔄 Development Workflow

1. Clone repository
2. Install dependencies (backend & frontend)
3. Configure .env files
4. Start MongoDB
5. Start backend server
6. Start frontend dev server
7. Open browser to http://localhost:3000
8. Test features
9. Commit changes
10. Deploy

---

For more details, see individual README files in backend and frontend directories.
