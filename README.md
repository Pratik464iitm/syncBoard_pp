# SyncBoard

SyncBoard is a full-stack web application for managing and organizing boards.

## Features

- User authentication
- Create and manage boards
- User management
- Secure routes using authentication middleware
- REST API backend

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### Frontend
- React
- JavaScript
- CSS

## Project Structure

```text
syncboard/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── boardController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── Board.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── boardRoutes.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/