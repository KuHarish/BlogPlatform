# Full-Stack Blog Platform

A production-ready full-stack blog platform built with React, Node.js, Express, MongoDB Atlas, and JWT Authentication.

## Features
- **Authentication**: JWT-based user registration and login.
- **Blog Posts**: Create, read, update, and delete posts with a rich text editor (React Quill) and Cloudinary image upload.
- **Comments**: Users can add and delete comments on blog posts.
- **Dashboard**: Profile page with user statistics.
- **Responsive UI**: Modern UI with Tailwind CSS and dark mode support.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, React Router, React Hook Form, Axios, React Toastify
- **Backend**: Node.js, Express, MongoDB (Mongoose), bcryptjs, jsonwebtoken, Cloudinary

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB Atlas account/cluster
- Cloudinary account for image hosting

### 1. Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Open `server/.env` and update the placeholders with your actual credentials:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_uri_here
   JWT_SECRET=your_jwt_secret_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
4. Run the backend server:
   ```bash
   npx nodemon server.js
   ```
   *(Server runs on http://localhost:5000)*

### 2. Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *(Client runs on http://localhost:5173)*

The frontend API requests are proxied to `http://localhost:5000` via Vite configuration.

## Database Information
This project is configured to use a dedicated database named `blog_platform_db` to avoid conflicts with other projects.
The collections explicitly mapped are:
- `blog_users`
- `blog_posts`
- `blog_comments`
