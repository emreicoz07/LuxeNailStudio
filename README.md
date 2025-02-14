# Professional Nail Studio Web Application

A modern, responsive web application for a professional nail studio that allows users to book appointments, browse services, and showcase past work. Built with a candy pink theme and focus on user experience.

## 🚀 Tech Stack

### Backend:

TypeScript with Nest.js/Express.js
Prisma ORM & Mongoose
JWT-based authentication
Swagger for API documentation
Winston for logging
Zod/Joi for validation
Email service with Nodemailer

Reference:
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/config": "^3.3.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/jwt": "^11.0.0",
    "@nestjs/mongoose": "^11.0.1",
    "@nestjs/passport": "^11.0.5",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/schedule": "^3.0.4",
    "@nestjs/swagger": "^7.4.2",
    "@prisma/client": "^5.0.0",
    "@tanstack/react-query": "^5.66.0",
    "axios": "^1.7.9",
    "bcrypt": "^5.1.1",
    "bcryptjs": "^2.4.3",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "date-fns": "^4.1.0",
    "handlebars": "^4.7.8",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^8.10.0",
    "nest-commander": "^3.16.0",
    "nodemailer": "^6.10.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "stripe": "^17.6.0",
    "swagger-ui-express": "^5.0.1",
    "winston": "^3.10.0",
    "zod": "^3.21.4"
  },

  
### Frontend:

TypeScript with React
Redux Toolkit for state management
Tailwind CSS
React Query & Axios
React Hook Form with Yup validation
Framer Motion for animations
Vite as build tool

Reference:
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.0",
    "@hookform/resolvers": "^3.10.0",
    "@reduxjs/toolkit": "^1.9.5",
    "@tailwindcss/forms": "^0.5.10",
    "@tanstack/react-query": "^5.66.0",
    "axios": "^1.7.9",
    "date-fns": "^4.1.0",
    "framer-motion": "^10.18.0",
    "jwt-decode": "^4.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.54.2",
    "react-hot-toast": "^2.5.1",
    "react-icons": "^5.4.0",
    "react-redux": "^8.0.7",
    "react-router-dom": "^6.11.2",
    "react-toastify": "^9.1.3",
    "yup": "^1.6.1",
    "zod": "^3.22.0"
  },
  
  
### Database:

MongoDB (Primary database)
PostgreSQL (Supported alternative)


## ✨ Features

User Authentication (JWT-based)
Appointment Booking System
Service Management
Admin Dashboard
Payment Integration (Stripe)
Email Notifications
Responsive Design
Real-time Form Validation
API Documentation with Swagger

# Clone the repository
git clone <repository-url>

# Start the application using Docker Compose
docker-compose up -d

version: '3.8'

services:
  mongodb:
    image: mongo:latest
    environment:
      MONGO_INITDB_ROOT_USERNAME: user
      MONGO_INITDB_ROOT_PASSWORD: password
      MONGO_INITDB_DATABASE: nailstudio
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  backend:
    build:
      context: ./backend
      target: development
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=mongodb://user:password@mongodb:27017/nailstudio
    depends_on:
      - mongodb
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build:
      context: ./frontend
      target: development
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:3001
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  mongodb_data:

  
### Manual Setup

#### Backend:
```bash
cd backend
npm install
npm run dev
```

#### Frontend:
```bash
cd frontend
npm install
npm run dev
```


## 🔧 Environment Variables
Create a `.env` file in both backend and frontend directories:

### Backend `.env`:
```ini
# Database
MONGODB_URI=mongodb://localhost:27017/nail-studio
DATABASE_URL=your_mongodb_url

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Server
PORT=3000
FRONTEND_URL=http://localhost:5173

# Email
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_app_password

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Frontend `.env`:
```ini
VITE_API_URL=http://localhost:3000/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

Reference:
import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/nail-studio',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '24h',
  },
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
}));


## 🤝 Contributing

1. Fork the repository

2. Create your feature branch (`git checkout -b feature/AmazingFeature`)

3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)

4. Push to the branch (`git push origin feature/AmazingFeature`)

5. Open a Pull Request

Please ensure your code follows the project's coding standards and includes appropriate tests.

Reference:
    "general": {
      "description": "Project-wide development rules and best practices",
      "rules": {
        "useTypescript": true,
        "enforceEslintPrettier": true,
        "useDotenv": true,
        "requireCodeComments": true,
        "useGitBranching": true,
        "ciCdRequired": true
      }
    },

    
## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.


## 🔗 API Documentation

API documentation is available at `http://localhost:3000/api-docs` when running the development server.

Reference:
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Nail Studio API')
    .setDescription('Professional Nail Studio API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);