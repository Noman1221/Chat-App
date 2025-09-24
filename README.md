# Chat Application (MERN + Socket.IO)

A real-time chat application built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js) and **Socket.IO** for instant messaging. The application supports one-to-one messaging with image sharing, authentication, and persistent storage in MongoDB.  

> **Note:** The current focus of this project is on **functionality**, not UI design. Future updates will include responsive design, group chat functionality, and improved user experience skeletons.

---

## 🌟 Features

- **User Authentication:** Sign up, login, and update profile.
- **Real-Time Messaging:** One-to-one chat using **Socket.IO**.
- **Image Sharing:** Users can send images using **Multer** and **Cloudinary**.
- **Message Persistence:** All messages are stored in **MongoDB** for future retrieval.
- **Online User Tracking:** Shows which users are currently online.
- **Backend Handling via Context API:** React `useContext` is used to interact with backend APIs for authentication, messaging, and profile updates.

---

## 🛠 Tech Stack

- **Frontend:** React.js, Context API
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas)
- **Real-Time Communication:** Socket.IO
- **File Upload:** Multer + Cloudinary
- **Environment Variables Management:** dotenv

---
backend/
├─ Controllers/ # All backend controllers
├─ Routes/ # API routes for auth and messages
├─ utils/ # DB connection and helper functions
├─ config/ # Cloudinary configuration
├─ middleware/ # Auth middleware and other middleware
└─ server.js # Main backend entry point

frontend/
├─ src/
│ ├─ components/ # React components
│ ├─ context/ # Context API for auth and messaging
│ ├─ assets/ # Images and static assets
│ └─ App.js # Main frontend entry
## 📂 Project Structure

## ⚙️ Backend APIs

- **POST /users/api/signup** → Register a new user
- **POST /users/api/login** → Login
- **GET /users/api/me** → Get current authenticated user
- **PUT /users/api/updateProfile** → Update profile with optional image
- **GET /api/messages/users** → Get users for sidebar
- **GET /api/messages/:id** → Get messages between users
- **PUT /api/messages/mark/:id** → Mark messages as seen
- **POST /api/messages/:id** → Send text or image message

---

## 💻 Frontend Features

- Uses **React Context API** to manage state and interact with backend APIs.
- Handles authentication, sending/receiving messages, marking messages as seen.
- Supports **file/image uploads** via Multer + Cloudinary integration.
- Tracks online users with **Socket.IO**.
- Auto-scrolls chat to the latest message.
- Currently, UI is not fully responsive; priority is given to functionality.

---

## 📈 Future Enhancements

- Make UI fully **responsive** across devices.
- Add **group chat functionality**.
- Add **skeleton screens and better user experience elements**.
- Improve **error handling** and **loading states**.
- Enhance **notification system** for new messages.

---

## 🚀 Getting Started

### Backend

1. Clone the repository:


git clone https://github.com/yourusername/chat-app.git
cd chat-app/backend
npm install


Create a .env file:

PORT=5000
MONGO_URL=<Your MongoDB URI>
SECRET_KEY=<Your JWT Secret>
CLOUDINARY_CLOUD_NAME=<Cloudinary Cloud Name>
CLOUDINARY_API_KEY=<Cloudinary API Key>
CLOUDINARY_API_SECRET=<Cloudinary API Secret>


Start backend server:

npm run dev

Frontend

Navigate to frontend:

cd ../frontend


Install dependencies:

npm install


Start frontend:

npm start


Open browser: http://localhost:5173

⚠️ Notes

Currently, the frontend is not fully responsive.

Focus has been on real-time functionality, authentication, and message persistence.

Ensure CORS is configured correctly in the backend when deploying.

🔗 Demo & GitHub

Demo: https://chat-app-1-y8hy.onrender.com/

GitHub Repository: https://github.com/yourusername/chat-app

📄 License

MIT License

Author: Noman Khan
