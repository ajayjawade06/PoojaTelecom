# Pooja Telecom - eCommerce Platform

A production-ready, highly scalable MERN stack web application for Pooja Telecom. Built with React.js (Vite), Redux Toolkit, Node.js, Express, MongoDB, Tailwind CSS, and Razorpay.

## Features
- **Client System:** Full featured shopping cart, product details, user profile, password change, and secure Razorpay payment checkout.
- **Admin System:** Dedicated dashboard, complete product management (CRUD + Image Uploads), user management, and order status updates.
- **Security:** Built with JWT (`httpOnly` cookies), bcrypt password hashing, auth/admin middlewares, and React protected routes.
- **UI/UX:** Fully responsive, modern UI created with Tailwind CSS V4, interactive toast/loaders, sticky navbars, and animated progress steps.

## Folder Structure
- `/client`: Frontend React application powered by Vite.
- `/server`: Backend Node.js APIs and Mongoose data models.

## Local Setup

### 1. Environment Variables
Create a `.env` file in the `/server` directory and populate it according to `/server/.env.example`.

### 2. Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd client
npm install
```

### 3. Run Application concurrently
Run the backend and frontend simultaneously.
```bash
# In terminal 1
cd server
npm run dev # or node server.js

# In terminal 2
cd client
npm run dev
```

## Deployment Guide
1. **Frontend**: The `client` folder is deployed best to **Vercel** or **Netlify**. Ensure environment variables if any are set in the dashboard.
2. **Backend**: The `server` folder can be deployed to **Render** or **Railway**. Supply all `process.env` keys into their secret/environment manager.
3. **Database**: Use **MongoDB Atlas** for the `MONGO_URI`. 
4. Ensure CORS in `server.js` points to your deployed frontend domain instead of `localhost`.
# PoojaTelecom
# PoojaTelecom
