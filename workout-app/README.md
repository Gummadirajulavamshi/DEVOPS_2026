# 🏋️ FitForge — Personalized Home Workout Generator

A complete MERN-style web app (Node/Express/MongoDB + Vanilla JS frontend) that generates
personalized home workout plans based on your fitness goal, experience level, duration,
and available equipment.

---

## 📁 Project Structure

```
workout-app/
├── server.js              ← Main server (Express + MongoDB)
├── package.json
├── .env.example           ← Copy this to .env
├── models/
│   ├── User.js            ← User schema
│   └── Workout.js         ← Workout schema
├── routes/
│   ├── auth.js            ← Register / Login routes
│   └── workout.js         ← Generate / Save / Fetch workouts
├── middleware/
│   └── auth.js            ← JWT middleware
└── public/                ← Frontend (served by Express)
    ├── index.html
    ├── style.css
    └── app.js
```

---

## ⚙️ Setup Instructions

### 1. Install dependencies
```bash
npm install
```

### 2. Set up MongoDB

**Option A — Local MongoDB:**
- Install MongoDB Community: https://www.mongodb.com/try/download/community
- Start the service: `mongod` (or via system service)

**Option B — MongoDB Atlas (cloud, free):**
- Go to https://cloud.mongodb.com
- Create a free cluster
- Click "Connect" → "Drivers" → copy the connection string
- Replace `<password>` and `<dbname>` in the URI

### 3. Create your .env file
```bash
cp .env.example .env
```
Edit `.env`:
```
MONGO_URI=mongodb://localhost:27017/workoutapp
JWT_SECRET=changethissecret123
PORT=5000
```

### 4. Start the server
```bash
node server.js
```

### 5. Open in browser
```
http://localhost:5000
```

---

## 🧩 Features

| Feature | Details |
|---|---|
| Auth | Register + Login with JWT, bcrypt password hashing |
| Workout Generator | Condition-based logic — no external API |
| Goals | Weight Loss, Muscle Gain, General Fitness |
| Levels | Beginner, Intermediate, Advanced |
| Durations | 15 / 30 / 45 minutes |
| Equipment | None, Dumbbells, Resistance Bands |
| Save Workouts | Stored in MongoDB per user |
| Dashboard | Profile + full workout history |
| Timer | Built-in workout timer with start/pause/reset |

---

## 🔐 Sample .env
```
MONGO_URI=mongodb://localhost:27017/workoutapp
JWT_SECRET=mysupersecretkey123
PORT=5000
```

---

## 🎨 Tech Stack
- **Backend**: Node.js, Express, Mongoose, JWT, bcryptjs
- **Database**: MongoDB
- **Frontend**: HTML5, CSS3 (custom), Vanilla JS
- **Fonts**: Bebas Neue + DM Sans (Google Fonts)

No React. No bundler. No build step. Just `npm install` + `node server.js`.
