# Frontend - Real-Time Crime Reporting System

React-based frontend for the Real-Time Crime Reporting System with interactive maps, real-time updates, and admin dashboard.

## 📋 Prerequisites

- Node.js v14+
- npm or yarn
- Modern web browser

## 🚀 Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 📁 Project Structure

```
client/
├── src/
│   ├── components/
│   │   └── Navigation.js    # Header navigation
│   ├── pages/
│   │   ├── Home.js          # Landing page
│   │   ├── ReportCrime.js   # Crime reporting form
│   │   ├── LiveMap.js       # Interactive map
│   │   ├── AdminLogin.js    # Admin authentication
│   │   └── AdminDashboard.js # Admin panel
│   ├── styles/
│   │   ├── home.css         # Home page styles
│   │   ├── report.css       # Report form styles
│   │   ├── map.css          # Map page styles
│   │   ├── admin.css        # Admin styles
│   │   └── navigation.css   # Navigation styles
│   ├── utils/
│   │   ├── api.js           # API client
│   │   └── socket.js        # Socket.IO setup
│   ├── App.js               # Main component
│   ├── App.css              # Global styles
│   ├── index.js             # Entry point
│   └── index.css            # Global styles
├── public/
│   └── index.html           # HTML template
└── package.json             # Dependencies
```

## 🎨 Pages

### Home Page (`/`)
- Landing page with project overview
- Features showcase
- Benefits overview
- Call-to-action buttons

### Report Crime Page (`/report`)
- Location information form
- Incident details form
- Media upload section
- Reporter information (optional)
- Real-time location detection

### Live Map Page (`/map`)
- Interactive map with crime reports
- Real-time markers with popup
- Reports list with filtering
- Statistics dashboard
- Socket.IO real-time updates

### Admin Login Page (`/admin/login`)
- Login form for existing admins
- Registration form for new admins
- Role selection (admin/moderator/responder)
- JWT token management

### Admin Dashboard (`/admin/dashboard`)
- Reports overview statistics
- Crime type distribution
- Reports management table
- Report detail modal
- Status update functionality
- Admin notes addition
- Delete report feature

## 🚀 Running the Application

Development mode:
```bash
npm start
```

The app will open at `http://localhost:3000`

Production build:
```bash
npm run build
```

## 🔌 Socket.IO Features

Real-time updates:
- New reports appear instantly on the map
- Report status changes broadcast to all clients
- Admin responses update in real-time

## 🎯 Key Features

### Report Crime
- GPS-based location tagging
- Multiple crime type selection
- Severity level indication
- Photo/video upload (up to 5 files, 50MB each)
- Anonymous or named reporting
- Real-time validation

### Live Map
- Leaflet.js interactive map
- Marker clustering
- Real-time location detection
- Popup with report details
- Crime statistics
- Reports filtering by status

### Admin Dashboard
- Real-time report synchronization
- Status management (pending → in-progress → resolved)
- Admin notes documentation
- Report deletion capability
- Crime distribution statistics
- Bulk filtering options

### Authentication
- JWT token storage in localStorage
- Automatic token injection in requests
- Protected routes for admin pages
- Logout functionality

## 📦 Dependencies

- **react** - UI framework
- **react-router-dom** - Client-side routing
- **axios** - HTTP client
- **socket.io-client** - Real-time communication
- **leaflet** - Map library
- **react-leaflet** - React wrapper for Leaflet

## 🎨 Styling

Global styles in `App.css`:
- Responsive grid layouts
- Button variants
- Form styling
- Card components
- Modal dialogs
- Alert messages

Component-specific styles:
- `navigation.css` - Navigation bar
- `home.css` - Home page
- `report.css` - Report form
- `map.css` - Map page
- `admin.css` - Admin pages

## 🔐 Authentication

Admin authentication flow:
1. User fills login/register form
2. API returns JWT token
3. Token stored in localStorage
4. Token automatically added to API requests
5. Protected routes check for token
6. Unauthorized redirects to login

## 🌐 API Integration

API client setup in `utils/api.js`:
- Base URL configuration
- Request interceptors for JWT
- Error handling
- Response formatting

Example API calls:
```javascript
import { reportAPI, adminAPI } from '../utils/api';

// Create report
await reportAPI.createReport(data);

// Get reports
await reportAPI.getReports({ status: 'pending' });

// Admin login
await adminAPI.login({ email, password });
```

## 🧪 Testing

Test the application:

1. **Home Page**: Visit `/` to see landing page
2. **Report Crime**: Click "Report a Crime" button
   - Fill form with test data
   - Submit report
3. **Live Map**: Click "View Live Map"
   - See reports displayed on map
4. **Admin Access**: Click "Admin" in navigation
   - Login or register as admin
   - Access dashboard

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints at 768px
- Hamburger menu support (future implementation)
- Touch-friendly buttons and inputs
- Flexible grid layouts

## 🐛 Troubleshooting

**Cannot connect to backend**
- Check API_URL in .env
- Ensure backend is running on 5000
- Check CORS configuration

**Maps not showing**
- Verify Leaflet is loaded
- Check internet connection
- Review console for errors

**Real-time updates not working**
- Verify Socket.IO connection
- Check backend Socket.IO server
- Review browser console

## 🚀 Deployment

**Vercel Deployment**:
```bash
npm install -g vercel
vercel
```

**Netlify Deployment**:
```bash
npm run build
# Upload build/ folder to Netlify
```

**Docker Deployment**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📞 Support

For issues or questions, please contact the development team.

---

Made with ❤️ for community safety
