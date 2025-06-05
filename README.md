# Engineering Resource Management System

## 📌 Project Overview

The Engineering Resource Management System is a full-stack web application designed to help engineering managers efficiently allocate engineers to projects based on availability and capacity. It offers a modern interface, simple dashboards, and real-time visibility into team workload — all built with a strong focus on usability and performance.

Managers can assign engineers to projects, track capacity in percentage, and prevent over-allocation. Engineers can view their current assignments, update their profile, and manage their tech stack and past project details.

The app was designed with user-friendly UI elements and a color palette inspired by [GeekyAnts](https://geekyants.com). The login interface design was inspired by [Topgeek](https://topgeek.io).

---

## 🚀 Demo Links

- **Frontend (Live on Vercel):** [https://resource-manager-frontend.vercel.app](https://resource-manager-frontend.vercel.app)  
- **Backend (Live on Render):** [https://resource-manager-backend.onrender.com](https://resource-manager-backend.onrender.com)

---

## 🔐 Login Credentials

### 👨‍💼 Manager  
- **Username:** `manager1`  
- **Password:** `pass123`

### 👨‍💻 Engineer  
- **Username:** `engineer1`  
- **Password:** `pass456`

---

## 🧰 Tech Stack

### **Frontend**
- React.js (Vite)
- Tailwind CSS
- React Icons
- Axios
- Vercel (Deployment)

### **Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- dotenv
- Render (Deployment)

---

## 📒 Features

- Role-based authentication (Manager & Engineer)
- Manager dashboard with assignment system
- Engineer dashboard with capacity tracking
- Profile management (photo, tech stack, past projects)
- Dynamic project and engineer forms
- Assignment analytics and validation
- Clean UI/UX and mobile-friendly design

---

## 🧠 Development Notes

During the development process, helpful tools were used to:
- Understand forgotten concepts
- Debug small logic or data mapping issues
- Refactor and document parts of the code with better comments

The entire application was built from scratch, ensuring clarity and full understanding of every component and route.

---

## 📦 Getting Started Locally

1. **Clone the Repositories**

```bash
git clone https://github.com/pranavsthakur/resource-manager-frontend.git
git clone https://github.com/pranavsthakur/resource-manager-backend.git


FRONTEND 

cd resource-manager-frontend
npm install
npm run dev

BACKEND

cd resource-manager-backend
npm install
node server.js

ENVIRONMENT VARIABLES
MONGO_URI=your_mongodb_connection_string
PORT=5000

