# Budget-Aware Expense Tracker

A full-stack web application for tracking expenses, managing budgets, and generating monthly reports.

## Features

- **User Authentication**: Sign up and login with email/password
- **Category Management**: Create, edit, and delete expense categories with custom colors
- **Budget Setting**: Set monthly budgets for each category
- **Expense Tracking**: Add expenses with instant budget status feedback
- **Dashboard**: Visual overview with progress bars and budget status
- **Monthly Reports**: Detailed spending analysis with tables and summaries
- **Responsive Design**: Mobile-friendly interface with bottom navigation

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing
- CORS enabled

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
NODE_ENV=development
```

5. Start the server:
```bash
npm run dev
```

The server will run on http://localhost:5000

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The client will run on http://localhost:5173

### MongoDB Setup

#### Option 1: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use the connection string: `mongodb://localhost:27017/expense-tracker`

#### Option 2: MongoDB Atlas
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update the `MONGODB_URI` in your `.env` file

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Budgets
- `GET /api/budgets/:year/:month` - Get budgets for specific month
- `POST /api/budgets` - Create/update budget
- `DELETE /api/budgets/:id` - Delete budget

### Expenses
- `GET /api/expenses` - Get expenses (with optional month/year filter)
- `POST /api/expenses` - Create expense
- `DELETE /api/expenses/:id` - Delete expense

### Reports
- `GET /api/reports/:year/:month` - Get monthly report

## API Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### Create Category
```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name": "Food", "color": "#10B981"}'
```

### Add Expense
```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"categoryId": "CATEGORY_ID", "amount": 25.50, "date": "2024-11-17", "description": "Lunch"}'
```

## Project Structure

```
expense-tracker/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── utils/          # Utility functions
│   │   └── App.jsx         # Main app component
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── server.js           # Main server file
└── README.md
```

## Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Update API base URL in production

### Backend (Railway/Render/Heroku)
1. Set environment variables
2. Deploy the server directory
3. Ensure MongoDB connection is configured

## Environment Variables

### Server (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.