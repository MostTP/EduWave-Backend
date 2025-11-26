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

# Email Configuration (for email verification using RESEND)
RESEND_API_KEY=re_your_resend_api_key_here
FROM_EMAIL=EduWise <onboarding@resend.dev>
```

For MongoDB Atlas, use:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eduwise
```

**Note:** 
- Get your RESEND API key from [https://resend.com/api-keys](https://resend.com/api-keys)
- Update `FROM_EMAIL` with your verified domain email (e.g., `EduWise <noreply@yourdomain.com>`)
- For testing, you can use the default `onboarding@resend.dev` email, but you'll need to verify your domain for production use

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

