# Sri Vasavi Jewels (SVJ) - Full Stack Web Application

A modern, full-stack e-commerce website for jewelry business built with React.js and Node.js.

## 🚀 Project Overview

Sri Vasavi Jewels is a comprehensive jewelry e-commerce platform featuring user authentication, product management, shopping cart, wishlist, and admin dashboard functionality.

## 📁 Project Structure

```
srivasavijewels/
├── client/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/
│   │   │   │   ├── AdminDashboard.js
│   │   │   │   ├── ProductForm.js
│   │   │   │   ├── ProductList.js
│   │   │   │   └── ProductManagement.js
│   │   │   ├── Auth/
│   │   │   │   ├── Login.js
│   │   │   │   └── Signup.js
│   │   │   ├── Cart/
│   │   │   │   ├── CartIcon.js
│   │   │   │   └── ShoppingCart.js
│   │   │   ├── Chat/
│   │   │   │   ├── ChatBot.js
│   │   │   │   └── ChatWindow.js
│   │   │   ├── Wishlist/
│   │   │   │   └── WishlistPage.js
│   │   │   ├── common/
│   │   │   │   └── PriceDisplay.js
│   │   │   ├── Collections.js
│   │   │   ├── Contact.js
│   │   │   ├── Home.js
│   │   │   ├── Navbar.js
│   │   │   └── ProductDetail.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   ├── CartContext.js
│   │   │   └── ChatContext.js
│   │   ├── App.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Node.js Backend
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   └── productController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── productValidation.js
│   │   └── upload.js
│   ├── models/
│   │   ├── Chat.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── chatRoutes.js
│   │   └── productRoutes.js
│   ├── scripts/
│   │   ├── createAdmin.js
│   │   ├── seedDatabase.js
│   │   └── testConnection.js
│   ├── uploads/            # Product images storage
│   ├── .env
│   ├── index.js
│   └── package.json
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **React.js** - UI Library
- **Tailwind CSS** - Styling Framework
- **React Router** - Client-side Routing
- **Axios** - HTTP Client
- **Context API** - State Management

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MongoDB** - NoSQL Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password Hashing
- **Multer** - File Upload Handling
- **Sharp** - Image Processing

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login
- JWT-based authentication
- Role-based access control (Customer/Admin)
- Protected routes and middleware

### 🛍️ E-commerce Functionality
- Product catalog with categories
- Advanced product search and filtering
- Shopping cart with quantity management
- Wishlist functionality
- Dynamic pricing with discount percentages
- Real-time stock management

### 👑 Admin Dashboard
- Product management (CRUD operations)
- Image upload and optimization
- Bulk product operations
- User management
- Order tracking
- Analytics dashboard

### 💎 Product Features
- Dynamic pricing based on gold rates
- Wastage and making charges calculation
- Discount percentage system
- Multiple product images
- Product specifications (weight, purity, dimensions)
- Stock status tracking

### 🤖 AI Chat Assistant
- Intelligent product recommendations
- Customer support automation
- Chat history management
- Context-aware responses

### 📱 User Experience
- Responsive design for all devices
- Modern, jewelry-appropriate UI
- Fast loading with optimized images
- Intuitive navigation
- Real-time updates

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd srivasavijewels
```

### 2. Install Dependencies

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

### 3. Environment Setup

Create `.env` file in the `server` directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/srivasavijewels

# Authentication
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads/

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 4. Database Setup

**Option A: Local MongoDB**
```bash
# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Option B: MongoDB Atlas**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`

### 5. Initialize Database

```bash
# Test database connection
cd server
npm run test-db

# Create admin user
npm run create-admin

# Seed sample data (optional)
npm run seed
```

### 6. Start the Application

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
```
Server runs on: http://localhost:4000

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```
Frontend runs on: http://localhost:3000

## 🧪 Testing the Application

### API Testing
```bash
# Test signup
curl -X POST http://localhost:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Test login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Frontend Testing
1. Open http://localhost:3000
2. Register a new account
3. Browse products and collections
4. Test cart and wishlist functionality
5. Access admin panel (if admin user)

## 📊 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/admin/products` - Create product (admin)
- `PUT /api/admin/products/:id` - Update product (admin)
- `DELETE /api/admin/products/:id` - Delete product (admin)

### Chat
- `POST /api/chat` - Send chat message
- `GET /api/chat/history` - Get chat history (protected)

## 🎨 Key Features Explained

### Dynamic Pricing System
Products are priced based on:
- Current gold/silver rates
- Product weight
- Wastage percentage
- Making charges
- Discount percentage

### Discount System
- Percentage-based discounts (0-100%)
- Automatic calculation of savings
- Visual discount badges
- Strikethrough original pricing

### Image Management
- Multiple image upload per product
- Automatic image optimization
- Responsive image serving
- Fallback image handling

### Search & Filtering
- Text-based product search
- Category and subcategory filtering
- Price range filtering
- Metal and purity filtering
- Tag-based filtering

## 🔧 Development Scripts

### Backend Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run test-db    # Test database connection
npm run create-admin # Create admin user
npm run seed       # Seed sample data
```

### Frontend Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

## 🚀 Deployment

The application can be deployed on various platforms:

### Recommended Platforms
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Backend**: Railway, Heroku, AWS EC2, DigitalOcean
- **Database**: MongoDB Atlas (recommended)

### Build for Production
```bash
# Build frontend
cd client
npm run build

# The build folder is ready for deployment
```

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Server-side validation
- **File Upload Security**: Type and size restrictions
- **CORS Configuration**: Controlled cross-origin access
- **Environment Variables**: Sensitive data protection

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running or check Atlas connection string

**Port Already in Use:**
```
Error: listen EADDRINUSE: address already in use :::4000
```
**Solution:** Kill existing process or change PORT in .env

**Image Upload Issues:**
- Check file size limits
- Verify upload directory permissions
- Ensure supported file formats (jpg, png, webp)

**Build Warnings:**
- ESLint warnings are normal and won't affect functionality
- Can be fixed by following the suggested solutions

## 📈 Performance Optimizations

- **Image Optimization**: Sharp for automatic compression
- **Lazy Loading**: Images loaded on demand
- **Caching**: Browser caching for static assets
- **Code Splitting**: React lazy loading
- **Database Indexing**: Optimized queries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Mukesh Pabbathi**
- GitHub: [@Mukeshpabbathi](https://github.com/Mukeshpabbathi)
- Email: mukesh@srivasavijewels.com

## 🙏 Acknowledgments

- React.js community for excellent documentation
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the flexible database solution
- All open-source contributors

---

**Happy Coding! 💎✨**

For support or questions, please open an issue in the repository.
