# API Testing Guide

## Overview
Complete guide for testing all API endpoints of the Real-Time Crime Reporting System.

---

## 🧪 Testing Tools

### Recommended Tools
- **Postman**: GUI-based API testing
- **cURL**: Command-line testing
- **Insomnia**: REST client
- **Thunder Client**: VS Code extension
- **REST Client**: VS Code extension

---

## 🔑 Authentication

### Admin Login
Get authentication token first:

**Request:**
```bash
curl -X POST http://localhost:5000/api/admins/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "admin": {
    "id": "65abc123...",
    "name": "Test Admin",
    "email": "admin@test.com",
    "role": "admin"
  }
}
```

### Save Token
For subsequent requests, use the token in Authorization header:
```
Authorization: Bearer <token>
```

---

## 📋 Crime Reports API

### 1. Create Crime Report

**Endpoint:**
```
POST /api/reports
```

**Form Data:**
```
- description (string, required): "Shoplifting at Main Street store"
- crimeType (string, required): "theft"
- severity (string): "medium"
- latitude (number, required): 40.7128
- longitude (number, required): -74.0060
- address (string): "Times Square, New York, NY"
- isAnonymous (boolean): true
- media (files, optional): image.jpg, video.mp4
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/reports \
  -F "description=Someone shoplifting at the store" \
  -F "crimeType=theft" \
  -F "severity=medium" \
  -F "latitude=40.7128" \
  -F "longitude=-74.0060" \
  -F "address=Times Square, New York" \
  -F "isAnonymous=true"
```

**JavaScript/Fetch:**
```javascript
const formData = new FormData();
formData.append('description', 'Crime description');
formData.append('crimeType', 'theft');
formData.append('latitude', 40.7128);
formData.append('longitude', -74.0060);
formData.append('severity', 'medium');
formData.append('isAnonymous', true);

const response = await fetch('http://localhost:5000/api/reports', {
  method: 'POST',
  body: formData
});
const data = await response.json();
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Report submitted successfully",
  "data": {
    "_id": "65abc123...",
    "description": "Crime description",
    "crimeType": "theft",
    "severity": "medium",
    "location": {
      "type": "Point",
      "coordinates": [-74.0060, 40.7128],
      "address": "Times Square, New York"
    },
    "status": "pending",
    "isAnonymous": true,
    "createdAt": "2026-04-03T10:00:00.000Z"
  }
}
```

---

### 2. Get All Reports

**Endpoint:**
```
GET /api/reports?status=pending&page=1&limit=20
```

**Query Parameters:**
- `status` (string, optional): pending, in-progress, resolved, dismissed
- `page` (number, optional): Page number
- `limit` (number, optional): Items per page

**cURL Example:**
```bash
curl http://localhost:5000/api/reports?status=pending&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65abc123...",
      "description": "Crime description",
      "crimeType": "theft",
      "status": "pending",
      ...
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

---

### 3. Get Single Report

**Endpoint:**
```
GET /api/reports/:id
```

**Example:**
```bash
curl http://localhost:5000/api/reports/65abc123...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65abc123...",
    "description": "Full crime description",
    "crimeType": "theft",
    "location": {...},
    "status": "pending",
    "views": 5,
    "createdAt": "2026-04-03T10:00:00.000Z"
  }
}
```

---

### 4. Get Reports Nearby

**Endpoint:**
```
GET /api/reports/nearby?latitude=40.7128&longitude=-74.0060&maxDistance=5000
```

**Query Parameters:**
- `latitude` (number, required): User latitude
- `longitude` (number, required): User longitude
- `maxDistance` (number, optional): Distance in meters (default: 5000)

**Example:**
```bash
curl "http://localhost:5000/api/reports/nearby?latitude=40.7128&longitude=-74.0060&maxDistance=5000"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65abc123...",
      "description": "Nearby incident",
      "location": {...},
      ...
    }
  ]
}
```

---

### 5. Update Report Status (Admin)

**Endpoint:**
```
PATCH /api/reports/:id/status
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "in-progress",
  "adminNotes": "Responding to incident"
}
```

**cURL Example:**
```bash
curl -X PATCH http://localhost:5000/api/reports/65abc123.../status \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in-progress",
    "adminNotes": "Sent patrol unit to location"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Report status updated",
  "data": {
    "_id": "65abc123...",
    "status": "in-progress",
    "adminNotes": "Sent patrol unit to location",
    "updatedAt": "2026-04-03T10:05:00.000Z"
  }
}
```

---

### 6. Crime Statistics

**Endpoint:**
```
GET /api/reports/stats/all
```

**Example:**
```bash
curl http://localhost:5000/api/reports/stats/all
```

**Response:**
```json
{
  "success": true,
  "data": {
    "byCrimeType": [
      {
        "_id": "theft",
        "count": 15
      },
      {
        "_id": "assault",
        "count": 8
      },
      {
        "_id": "robbery",
        "count": 5
      }
    ],
    "byStatus": [
      {
        "_id": "pending",
        "count": 10
      },
      {
        "_id": "in-progress",
        "count": 8
      },
      {
        "_id": "resolved",
        "count": 10
      }
    ],
    "totalReports": 28
  }
}
```

---

### 7. Delete Report (Admin)

**Endpoint:**
```
DELETE /api/reports/:id
Authorization: Bearer <token>
```

**Example:**
```bash
curl -X DELETE http://localhost:5000/api/reports/65abc123... \
  -H "Authorization: Bearer eyJhbGc..."
```

**Response:**
```json
{
  "success": true,
  "message": "Report deleted successfully"
}
```

---

## 👮 Admin API

### 1. Register Admin

**Endpoint:**
```
POST /api/admins/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@police.gov",
  "password": "SecurePassword123!",
  "role": "admin"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/admins/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@police.gov",
    "password": "SecurePassword123!",
    "role": "admin"
  }'
```

**Response (201):**
```json
{
  "success": true,
  "message": "Admin registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "admin": {
    "id": "65abc123...",
    "name": "John Doe",
    "email": "john@police.gov",
    "role": "admin"
  }
}
```

---

### 2. Login Admin

**Endpoint:**
```
POST /api/admins/login
```

**Request Body:**
```json
{
  "email": "john@police.gov",
  "password": "SecurePassword123!"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/admins/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@police.gov",
    "password": "SecurePassword123!"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "admin": {
    "id": "65abc123...",
    "name": "John Doe",
    "email": "john@police.gov",
    "role": "admin"
  }
}
```

---

### 3. Get Current Admin

**Endpoint:**
```
GET /api/admins/me
Authorization: Bearer <token>
```

**Example:**
```bash
curl http://localhost:5000/api/admins/me \
  -H "Authorization: Bearer eyJhbGc..."
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "65abc123...",
    "name": "John Doe",
    "email": "john@police.gov",
    "role": "admin",
    "isActive": true,
    "createdAt": "2026-04-03T09:00:00.000Z"
  }
}
```

---

### 4. Get All Admins (Admin)

**Endpoint:**
```
GET /api/admins
Authorization: Bearer <token>
```

**Example:**
```bash
curl http://localhost:5000/api/admins \
  -H "Authorization: Bearer eyJhbGc..."
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65abc123...",
      "name": "John Doe",
      "email": "john@police.gov",
      "role": "admin",
      "isActive": true
    },
    {
      "_id": "65abc456...",
      "name": "Jane Smith",
      "email": "jane@police.gov",
      "role": "moderator",
      "isActive": true
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Token is not valid"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Not authorized"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 🧪 Testing Workflow

### Step 1: Register Admin
```bash
curl -X POST http://localhost:5000/api/admins/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Admin",
    "email": "admin@test.com",
    "password": "test123456",
    "role": "admin"
  }'
```

### Step 2: Login Admin
```bash
curl -X POST http://localhost:5000/api/admins/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "test123456"
  }'
```

Save the returned token.

### Step 3: Submit Crime Report
```bash
curl -X POST http://localhost:5000/api/reports \
  -F "description=Test theft at store" \
  -F "crimeType=theft" \
  -F "severity=medium" \
  -F "latitude=40.7128" \
  -F "longitude=-74.0060"
```

Save the report ID.

### Step 4: Get Reports
```bash
curl http://localhost:5000/api/reports
```

### Step 5: Update Report Status (as Admin)
```bash
curl -X PATCH http://localhost:5000/api/reports/<REPORT_ID>/status \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "resolved",
    "adminNotes": "Incident resolved"
  }'
```

### Step 6: Get Statistics
```bash
curl http://localhost:5000/api/reports/stats/all
```

---

## 📊 Postman Collection

Can be imported into Postman as JSON:

```json
{
  "info": {
    "name": "Crime Reporting API",
    "description": "API endpoints for testing"
  },
  "item": [
    {
      "name": "Admin Register",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/api/admins/register",
        "body": {
          "raw": "{\"name\":\"Test\",\"email\":\"test@test.com\",\"password\":\"test123456\"}"
        }
      }
    }
  ]
}
```

---

## 🔗 Useful Links

- **Local**: http://localhost:5000
- **API Base**: http://localhost:5000/api
- **Frontend**: http://localhost:3000
- **Health Check**: http://localhost:5000/api/health

---

## ✅ Success Criteria

- All endpoints return 2xx status codes
- Response format matches documentation
- Error messages are descriptive
- Token authentication works
- File uploads process correctly
- Real-time updates broadcast

---

Made with ❤️ for community safety
