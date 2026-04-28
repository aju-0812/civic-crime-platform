# Backend - Real-Time Crime Reporting System

Node.js + Express backend for the Real-Time Crime Reporting System with MongoDB database and Socket.IO for real-time updates.

## 📋 Prerequisites

- Node.js v14+
- npm or yarn
- MongoDB (local or cloud)

## 🚀 Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/crime-reporting
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
CLIENT_URL=http://localhost:3000
```

## 📁 Project Structure

```
server/
├── models/
│   ├── Report.js      # Crime report schema
│   └── Admin.js       # Admin user schema
├── controllers/
│   ├── reportController.js  # Report handlers
│   └── adminController.js   # Admin handlers
├── routes/
│   ├── reports.js     # Report endpoints
│   └── admins.js      # Admin endpoints
├── middleware/
│   ├── auth.js        # JWT authentication
│   └── upload.js      # File upload handling
├── uploads/           # Media storage
├── server.js          # Main server file
├── package.json       # Dependencies
└── .env               # Environment variables
```

## 🔌 API Endpoints

### Reports
- `POST /api/reports` - Create new report
- `GET /api/reports` - Get all reports
- `GET /api/reports/nearby` - Get reports by location
- `GET /api/reports/stats/all` - Get crime statistics
- `GET /api/reports/:id` - Get single report
- `PATCH /api/reports/:id/status` - Update report status (Admin)
- `POST /api/reports/:id/response` - Add response (Admin)
- `DELETE /api/reports/:id` - Delete report (Admin)

### Admin
- `POST /api/admins/register` - Register admin
- `POST /api/admins/login` - Login admin
- `GET /api/admins/me` - Get current admin (Protected)
- `GET /api/admins` - Get all admins (Protected)
- `PATCH /api/admins/:id` - Update admin (Protected)
- `DELETE /api/admins/:id` - Delete admin (Protected)

## 🗄️ Database Collections

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
  crimeType: String,
  severity: String,
  mediaFiles: Array,
  isAnonymous: Boolean,
  reporterName: String,
  reporterEmail: String,
  reporterPhone: String,
  status: String,
  adminNotes: String,
  responses: Array,
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
  email: String,
  password: String (hashed),
  role: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Running the Server

Development mode (with hot reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:5000`

## 🔌 Socket.IO Events

Listen for real-time updates:
- `newReport` - New report submitted
- `reportUpdated` - Report status changed
- `responseAdded` - Response added to report

## 🔐 Environment Variables

```env
MONGODB_URI         - MongoDB connection string
PORT               - Server port (default: 5000)
NODE_ENV           - Environment (development/production)
JWT_SECRET         - Secret key for JWT tokens
GOOGLE_MAPS_API_KEY - Google Maps API key
CLIENT_URL         - Frontend URL for CORS
```

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **socket.io** - Real-time communication
- **multer** - File upload handling
- **cors** - Cross-origin requests
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment variables

## 🧪 Testing

Create a test admin user:
```bash
# Use the admin login/register endpoints
# Default test credentials can be created via the API
```

Test report submission:
```bash
curl -X POST http://localhost:5000/api/reports \
  -F "description=Test crime" \
  -F "crimeType=theft" \
  -F "latitude=40.7128" \
  -F "longitude=-74.0060" \
  -F "address=New York, NY"
```

## 🛡️ Security

- JWT-based authentication for admin operations
- bcryptjs for password hashing
- CORS protection
- File upload validation (MIME type, size)
- Anonymous reporting support

## 📝 Notes

- Reports without media files are stored with empty array
- Anonymous reports don't store reporter details
- Admin notes are only visible to administrators
- Real-time updates broadcast to connected clients via Socket.IO

## 🐛 Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check connection string in .env
- Verify network access for MongoDB Atlas

**Port Already in Use**
- Change PORT in .env
- Kill process using the port

**File Upload Issues**
- Check uploads folder permissions
- Verify file size limits
- Ensure supported MIME types

## 📞 Support

For issues or questions, please contact the development team.

---

Made with ❤️ for community safety
