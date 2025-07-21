# Sri Vasavi Jewels (SVJ) - Full Stack Web Application

A modern, full-stack e-commerce website for jewelry business built with React.js and Node.js.

## 🚀 Project Structure

```
srivasavijewels/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.js
│   │   │   │   └── Signup.js
│   │   │   └── Home.js
│   │   ├── App.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Node.js Backend
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── authRoutes.js
│   ├── .env
│   ├── index.js
│   └── package.json
└── README.md
```

## 🛠️ Technology Stack

### Frontend

- **React.js** - UI Library
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP Client

### Backend

- **Node.js** - Runtime
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password Hashing

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

## 🚀 Getting Started

### Step 1: Install MongoDB (if not already installed)

**Option A: Local MongoDB**

```bash
# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# The default connection string will be: mongodb://localhost:27017/srivasavijewels
```

**Option B: MongoDB Atlas (Cloud)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Update the `MONGO_URI` in `server/.env`

### Step 2: Setup Environment Variables

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/srivasavijewels
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
```

### Step 3: Install Dependencies

**Backend:**

```bash
cd server
npm install
```

**Frontend:**

```bash
cd ../client
npm install
```

### Step 4: Run the Application

**Terminal 1 - Start Backend Server:**

```bash
cd server
npm run dev
```

Server will run on: http://localhost:5000

**Terminal 2 - Start Frontend:**

```bash
cd client
npm start
```

Frontend will run on: http://localhost:3000

## 🧪 Testing the Application

### 1. Test Backend API (using curl or Postman)

**Signup:**

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mukesh Pabbathi",
    • Email: admin@srivasavijewels.com
    • Password: password123
  }'
```

**Login:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Test Frontend

1. Open http://localhost:3000
2. Navigate to http://localhost:3000/signup to create an account
3. Navigate to http://localhost:3000/login to sign in
4. Home page should show user info when logged in

## 📱 Features Implemented

### ✅ Phase 1 - Authentication & Basic UI

- [x] User signup/registration
- [x] User login/authentication
- [x] JWT token-based sessions
- [x] Password hashing with bcrypt
- [x] Protected routes
- [x] Responsive home page
- [x] Role-based access (customer/admin)

### 🔄 Coming Next (Phase 2)

- [ ] Admin dashboard
- [ ] Product management (CRUD)
- [ ] Shopping cart functionality
- [ ] Order management
- [ ] Payment integration
- [ ] User profile management

## 🎨 UI/UX Features

- **Responsive Design** - Works on desktop and mobile
- **Tailwind CSS** - Modern, utility-first styling
- **Gold Theme** - Jewelry business appropriate colors
- **Clean Layout** - Professional and elegant design

## 🔐 Security Features

- **Password Hashing** - bcryptjs with salt
- **JWT Authentication** - Secure token-based auth
- **Protected Routes** - Middleware-based protection
- **Input Validation** - Server-side validation
- **CORS Enabled** - Cross-origin resource sharing

## 🐛 Troubleshooting

### Common Issues:

**1. MongoDB Connection Error:**

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:** Make sure MongoDB is running locally or check your Atlas connection string.

**2. Port Already in Use:**

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:** Kill the process using the port or change the PORT in .env

**3. Tailwind Styles Not Working:**
**Solution:** Make sure you have the Tailwind directives in `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 📝 API Endpoints

### Authentication Routes

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Mukesh Pabbathi**

- GitHub: [@Mukeshpabbathi](https://github.com/Mukeshpabbathi)
- Project: Sri Vasavi Jewels

---

**Happy Coding! 💎✨**
