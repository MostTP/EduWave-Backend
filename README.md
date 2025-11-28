# EduWise - Node.js Express with Mongoose

A Node.js Express application with MongoDB using Mongoose ODM.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/eduwise

# JWT Secrets
JWT_ACCESS_SECRET=your-super-secret-access-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Email Configuration (for email verification using Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=EduWise <your-email@gmail.com>

# Resend Configuration (kept for reference/backup)
RESEND_API_KEY=re_your_resend_api_key_here
FROM_EMAIL=EduWise <onboarding@resend.dev>
```

For MongoDB Atlas, use:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eduwise
```

**Email Configuration Notes:** 
- **Nodemailer (Currently Active)**: 
  - For Gmail: Use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password
  - For other providers (Outlook, Yahoo, etc.), update `SMTP_HOST` and `SMTP_PORT` accordingly
  - Common SMTP settings:
    - Gmail: `smtp.gmail.com:587`
    - Outlook: `smtp-mail.outlook.com:587`
    - Yahoo: `smtp.mail.yahoo.com:587`
  - Set `SMTP_SECURE=true` for port 465 (SSL), `false` for port 587 (TLS)
- **Resend (Backup)**: Configuration kept for reference but not actively used

## Running the Application

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000` (or the PORT specified in your .env file).

## API Endpoints

### Health Check
- `GET /` - Welcome message
- `GET /health` - Server and database health status

### Authentication API
- `POST /auth/register` - Register a new user
  - Body: `{ "fullName": "John Doe", "email": "john@example.com", "password": "password123", "passwordConfirm": "password123" }`
- `POST /auth/login` - Login user
  - Body: `{ "email": "john@example.com", "password": "password123" }`
  - Returns: `{ "accessToken": "...", "refreshToken": "..." }`
- `GET /auth/verify-email/:token` - Verify email address (sent via email)

### Users API
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a single user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

## Project Structure

```
eduwise/
├── config/
│   └── database.js           # MongoDB connection configuration
├── controllers/
│   └── authController.js     # Authentication controller
├── middleware/
│   └── auth.js               # JWT authentication middleware
├── models/
│   └── User.js               # User model schema
├── routes/
│   ├── authRoutes.js         # Authentication routes
│   └── userRoutes.js         # User API routes
├── utils/
│   ├── generateToken.js      # JWT token generation utilities
│   ├── generateVerificationToken.js  # Email verification token
│   └── sendEmail.js          # Email sending utility
├── server.js                 # Main application entry point
├── package.json              # Project dependencies
└── .env                      # Environment variables (create this)
```

## Example API Usage

### Register a new user:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "passwordConfirm": "password123"
  }'
```

### Login:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Access protected route (with JWT token):
```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## License

ISC




```
# Tool Features System Documentation

## Overview

The Tool Features System provides a modular, extensible architecture for handling feature functionalities across different tools in the EDU-WAVE platform. Each tool can have multiple features, each with its own requirements, parameters, and execution logic.

## Architecture

### Components

1. **Tool Model** (`models/Tool.js`)
   - Enhanced with `features` array and `config` object
   - Stores tool metadata and feature definitions

2. **Base Tool Controller** (`controllers/tools/baseToolController.js`)
   - Abstract base class for all tool controllers
   - Provides common functionality: feature validation, access control, parameter validation

3. **Tool-Specific Controllers** (`controllers/tools/`)
   - Each tool has its own controller extending `BaseToolController`
   - Implements tool-specific feature logic

4. **Tool Registry** (`utils/toolRegistry.js`)
   - Maps tool IDs to their controller classes
   - Centralized tool controller management

5. **Routes** (`routes/toolRoutes.js`)
   - RESTful API endpoints for tool features
   - Handles feature listing and execution

6. **Middleware** (`middleware/toolFeature.js`)
   - Validates tool and feature access
   - Checks authentication and premium requirements

## API Endpoints

### Get All Features for a Tool
```
GET /api/tools/:toolId/features
```
Returns all available features for a specific tool.

**Response:**
```json
{
  "success": true,
  "toolId": "cgpa-calculator",
  "features": [
    {
      "id": "calculate",
      "name": "Calculate CGPA",
      "description": "Calculate CGPA from course grades",
      "requiresAuth": false,
      "requiresPremium": false,
      "parameters": [...]
    }
  ]
}
```

### Get Specific Feature
```
GET /api/tools/:toolId/features/:featureId
```
Returns details about a specific feature.

### Execute Feature
```
POST /api/tools/:toolId/features/:featureId/execute
Content-Type: application/json
Authorization: Bearer <token> (optional)

{
  "courses": [...],
  "otherParams": "..."
}
```

**Response:**
```json
{
  "success": true,
  "toolId": "cgpa-calculator",
  "featureId": "calculate",
  "result": {
    "cgpa": 3.75,
    "totalPoints": 45,
    "totalCredits": 12
  }
}
```

## Adding a New Tool

### Step 1: Create Tool Controller

Create a new file in `controllers/tools/`:

```javascript
const BaseToolController = require('./baseToolController');

class MyToolController extends BaseToolController {
  constructor() {
    super('my-tool-id');
    this.features = [
      {
        id: 'my-feature',
        name: 'My Feature',
        description: 'Description of the feature',
        requiresAuth: true,
        requiresPremium: false,
        parameters: [
          {
            name: 'param1',
            type: 'string',
            required: true,
            description: 'Parameter description'
          }
        ]
      }
    ];
  }

  async getFeatures() {
    return this.features;
  }

  async executeFeature(featureId, params, user = null) {
    const feature = this.features.find(f => f.id === featureId);
    
    if (!feature) {
      throw new Error(`Feature '${featureId}' not found`);
    }

    // Check access
    const accessCheck = this.checkFeatureAccess(feature, user);
    if (!accessCheck.allowed) {
      throw new Error(accessCheck.reason);
    }

    // Validate parameters
    const validation = this.validateParams(params, feature.parameters);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Implement feature logic
    switch (featureId) {
      case 'my-feature':
        return this.myFeatureMethod(params, user);
      default:
        throw new Error(`Feature '${featureId}' not implemented`);
    }
  }

  async myFeatureMethod(params, user) {
    // Your implementation here
    return {
      success: true,
      data: 'result'
    };
  }
}

module.exports = MyToolController;
```

### Step 2: Register Tool

Add to `utils/toolRegistry.js`:

```javascript
const MyToolController = require('../controllers/tools/myToolController');

const toolRegistry = {
  // ... existing tools
  'my-tool-id': MyToolController,
};
```

### Step 3: Add Tool to Database

Use the admin API or seed script to add the tool:

```javascript
POST /api/tools
Authorization: Bearer <admin-token>

{
  "id": "my-tool-id",
  "name": "My Tool",
  "icon": "<i class='fas fa-icon'></i>",
  "description": "Tool description",
  "category": "Academic",
  "status": "available",
  "url": "my-tool.html",
  "handler": "myToolController"
}
```

## Feature Parameters

### Parameter Types
- `string` - Text value
- `number` - Numeric value
- `boolean` - True/false
- `array` - Array of values
- `object` - Object/JSON value

### Parameter Definition
```javascript
{
  name: 'paramName',
  type: 'string',        // Required: parameter type
  required: true,        // Required: whether parameter is mandatory
  description: '...'     // Optional: parameter description
}
```

## Access Control

### Authentication
- `requiresAuth: true` - Feature requires user authentication
- `requiresAuth: false` - Feature can be used without authentication

### Premium Access
- `requiresPremium: true` - Feature requires premium subscription
- `requiresPremium: false` - Feature available to all users

The system checks for premium status in the following order:
1. `user.isPremium`
2. `user.subscription?.isPremium`
3. `user.subscription?.active`

## Error Handling

The system returns appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request (validation errors, missing parameters)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (premium required, tool not available)
- `404` - Not Found (tool or feature not found)
- `500` - Internal Server Error

## Example: CGPA Calculator

### Feature: Calculate CGPA

**Request:**
```bash
POST /api/tools/cgpa-calculator/features/calculate/execute
Content-Type: application/json

{
  "courses": [
    { "grade": "A", "creditHours": 3 },
    { "grade": "B+", "creditHours": 4 },
    { "grade": "A-", "creditHours": 3 }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "toolId": "cgpa-calculator",
  "featureId": "calculate",
  "result": {
    "success": true,
    "cgpa": 3.75,
    "totalPoints": 37.5,
    "totalCredits": 10,
    "coursesCount": 3
  }
}
```

## Best Practices

1. **Parameter Validation**: Always validate input parameters using the built-in `validateParams` method
2. **Access Control**: Use `checkFeatureAccess` to verify user permissions
3. **Error Messages**: Provide clear, descriptive error messages
4. **Documentation**: Document all features and their parameters
5. **Testing**: Test each feature with various input scenarios
6. **Security**: Never trust client input; always validate and sanitize

## Current Tools

- **CGPA Calculator** (`cgpa-calculator`)
  - Features: calculate, save-calculation, get-history

- **Progress Analytics** (`progress-analytics`)
  - Features: get-stats, export-report, set-goals, get-goals

- **Study Planner** (`study-planner`)
  - Features: create-schedule, update-schedule, get-schedules, get-recommendations

- **Text to PDF** (`text-to-pdf`)
  - Features: convert, get-conversion-status

- **PDF to Link** (`pdf-to-link`)
  - Features: upload, generate-link, revoke-link, get-links

- **Course Creator** (`course-creator`)
  - Features: create-course, add-lesson, publish-course

## Future Enhancements

- Database persistence for feature results
- Feature usage analytics
- Rate limiting per feature
- Feature versioning
- Webhook support for async operations
- Batch feature execution

```