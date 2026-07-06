# Shiksha Niketan — Ed-Tech Ecosystem

Welcome to the Shiksha Niketan Ed-Tech Ecosystem! This is a complete, scalable, and premium educational platform designed for local development and testing.

## Project Structure

The project is strictly separated into three main directories:

- `/frontend` - Next.js (App Router), React, TypeScript, Tailwind CSS
- `/backend` - Express.js, MongoDB, REST APIs, Socket.io
- `/start-project` - Utility directory for starting both frontend and backend concurrently with a single command

## Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB (A cloud cluster URI or local instance)
- Local Redis (Optional but recommended for full functionality)

## Getting Started

1. **Clone the repository.**
2. **Install all dependencies:**
   You need to install dependencies in each of the three directories.
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   cd ../start-project && npm install
   cd ..
   ```
3. **Environment Variables:**
   - Create a `.env.local` file in the `/frontend` directory.
   - Create a `.env` file in the `/backend` directory based on the `.env.example`. Make sure to set `MONGODB_URI` properly.
4. **Run the Project:**
   Use the `start-project` package to launch everything at once.
   ```bash
   cd start-project
   npm run dev
   ```

This will concurrently start:
- Frontend on `http://localhost:3000`
- Backend on `http://localhost:5000`

## Core Modules Built

- Auth System (JWT, OTP, RBAC)
- LMS Engine (Courses, Video Player, Quizzes)
- Testing Engine
- AI Mentor Integration
- Gamification & Leaderboards
- Home Tuition Marketplace
- Live Classes
- Secure Payments

For more details, see the implementation plan and specific `README.md` files inside the `/frontend` and `/backend` directories.
