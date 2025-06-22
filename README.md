# 📚 Library Management System

A comprehensive RESTful API for managing library operations including book inventory, borrowing, and returning books. Built with Node.js, TypeScript, Express.js, and MongoDB.

## 🚀 Features

- **Book Management**: Add, update, delete, and search books
- **Borrowing System**: Track book borrowing and returns
- **User Management**: Handle library member information
- **Real-time Availability**: Check real-time book availability
- **Health Monitoring**: API health check endpoints
- **Error Handling**: Comprehensive error handling and validation
- **Database Integration**: MongoDB with Mongoose ODM

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Environment**: dotenv for configuration
- **Deployment**: Vercel (Production), Local development

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## ⚡ Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/sndpbag/Library-Management-API.git
cd library-management-system
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/DB-NAME?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

### 4. Run the application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

## 📖 API Documentation

### Base URL
- **Local**: `http://localhost:5000`
- **Production**: `https://library-management-system-orcin-five.vercel.app/`

### Health Check
```http
GET /
GET /api/health
```

### Books API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/books` | Get all books |
| `GET` | `/api/books/:id` | Get book by ID |
| `POST` | `/api/books` | Create new book |
| `PUT` | `/api/books/:id` | Update book |
| `DELETE` | `/api/books/:id` | Delete book |

#### Create Book Request Body
```json
{
  "title": "Living With The Himalayan Masters",
  "author": "Swami Rama",
  "genre": "SCIENCE",
  "isbn": "9780553380163",
  "description": "'Living with the Himalayan Masters ' by Swami Rama is a spiritual autobiography detailing his experiences living and learning",
  "copies": 5,
  "available": true
}
```

### Borrowing API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/borrow` | Borrow a book |
| `GET` | `/api/borrow` | Get all borrow records |
 

#### Borrow Book Request Body
```json
{
  "book": "64ab3f9e2a4b5c6d7e8f9012",
  "quantity": 2,
  "dueDate": "2025-07-18T00:00:00.000Z"
}
```

## 🏗️ Project Structure

```
library-management-system/
├── src/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── app.ts           # Express app configuration
│   └── index.ts         # Application entry point
├── .env                 # Environment variables
├── .gitignore          # Git ignore rules
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── vercel.json         # Vercel deployment config
└── README.md           # Project documentation
```

## 🚀 Deployment

### Vercel Deployment

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel --prod
```

4. **Set Environment Variables**
- Go to Vercel Dashboard
- Navigate to your project → Settings → Environment Variables
- Add your `MONGODB_URI` and other environment variables

### Environment Variables for Production

Make sure to set these environment variables in your deployment platform:

- `MONGODB_URI`: Your MongoDB connection string
- `NODE_ENV`: Set to `production`

## 🧪 Testing

### API Testing with curl

**Health Check:**
```bash
curl -X GET http://localhost:5000/api/health
```

**Get All Books:**
```bash
curl -X GET http://localhost:5000/api/books
```

**Create a Book:**
```bash
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sample Book",
    "author": "SNDP BAG",
    "isbn": "123-456-789",
    "publishedYear": 2024,
    "genre": "Technology",
    "copies": 3
  }'
```

## 🐛 Common Issues & Solutions

### MongoDB Connection Issues

1. **Check Connection String**: Ensure your MongoDB URI is correctly formatted
2. **Network Access**: Add `0.0.0.0/0` to MongoDB Atlas Network Access
3. **Special Characters**: URL encode special characters in password (@ → %40)

### Vercel Deployment Issues

1. **Environment Variables**: Ensure all env vars are set in Vercel dashboard
2. **Build Configuration**: Check `vercel.json` configuration
3. **Function Timeout**: Vercel has a 10-second timeout for serverless functions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@sndpbag](https://github.com/sndpbag)
- LinkedIn: [LinkedIn](https://linkedin.com/in/sndpbag)
- Email: sandipan735@gmail.com

## 🙏 Acknowledgments

- Thanks to the Express.js community for the excellent framework
- MongoDB team for the robust database solution
- Vercel for seamless deployment platform

---

⭐ **If you found this project helpful, please consider giving it a star!**