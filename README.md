# Sports Equipment Management System

A modern MERN stack application for managing sports equipment borrowing in universities. Students can scan their ID cards, verify with OTP, and borrow equipment, while administrators can manage inventory, approve requests, and track usage.

## 🚀 Features

### For Students
- **ID Card Scanning**: Upload and verify student ID cards
- **OTP Authentication**: Two-factor authentication (OTP logged to console for testing)
- **Equipment Catalog**: Browse available sports equipment
- **Request Management**: Submit and track borrowing requests
- **Real-time Updates**: Get notified about request status changes

### For Administrators
- **Dashboard**: Overview of equipment, requests, and students
- **Request Management**: Approve/reject equipment requests
- **Equipment Management**: Add, edit, and track equipment inventory
- **Student Management**: View and manage student accounts
- **Notifications**: Send announcements and updates
- **Analytics**: View usage statistics and reports

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Advanced animations
- **React Hook Form** - Form handling and validation
- **React Hot Toast** - Toast notifications
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client
- **React Query** - Data fetching and caching

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **Nodemailer** - Email notifications
- **Helmet** - Security headers
- **Rate Limiting** - API protection

## 📁 Project Structure

```
SGP/
├── backend/
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Student.js
│   │   ├── Equipment.js
│   │   ├── Request.js
│   │   └── Notification.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── equipment.js
│   │   ├── requests.js
│   │   ├── notifications.js
│   │   └── students.js
│   ├── server.js
│   ├── package.json
│   └── env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   └── auth/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)

- Email service (for notifications)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/sports_equipment
   JWT_SECRET=your_jwt_secret_here
   
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/sports_equipment

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d



# Email (Notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📱 Usage

### Student Flow
1. **Register**: Upload ID card and provide details
2. **Verify**: Receive OTP via SMS and verify
3. **Browse**: View available equipment catalog
4. **Request**: Submit borrowing requests
5. **Track**: Monitor request status and history

### Admin Flow
1. **Login**: Use admin credentials
2. **Dashboard**: View system overview
3. **Manage**: Handle equipment and requests
4. **Monitor**: Track usage and statistics
5. **Notify**: Send announcements to students

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **OTP Verification**: Two-factor authentication for students
- **File Upload Security**: Validated file uploads
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Comprehensive form validation
- **CORS Protection**: Cross-origin request security
- **Helmet Security**: HTTP security headers

## 🎨 UI/UX Features

- **Modern Design**: Clean and professional interface
- **Responsive Layout**: Works on all device sizes
- **Smooth Animations**: Framer Motion animations
- **Dark/Light Mode**: Theme support (planned)
- **Loading States**: User-friendly loading indicators
- **Error Handling**: Comprehensive error messages
- **Toast Notifications**: Real-time feedback

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/student/register` - Student registration
- `POST /api/auth/student/verify-otp` - OTP verification
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/me` - Get current user

### Equipment Endpoints
- `GET /api/equipment` - List equipment
- `GET /api/equipment/:id` - Get equipment details
- `POST /api/equipment` - Add equipment (admin)
- `PUT /api/equipment/:id` - Update equipment (admin)

### Request Endpoints
- `POST /api/requests` - Create request
- `GET /api/requests` - List requests
- `PUT /api/requests/:id/approve` - Approve request (admin)
- `PUT /api/requests/:id/reject` - Reject request (admin)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **QR Code Integration**: Equipment tracking with QR codes
- **Mobile App**: React Native mobile application
- **Advanced Analytics**: Detailed usage reports
- **Equipment Maintenance**: Maintenance scheduling
- **Payment Integration**: Equipment rental fees
- **Multi-language Support**: Internationalization
- **Real-time Chat**: Admin-student communication
- **Equipment Reservations**: Advanced booking system

---

**Built with ❤️ for university sports equipment management** 