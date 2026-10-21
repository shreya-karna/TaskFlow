# TaskFlow

A full-stack task manager built with the MERN stack (MongoDB, Express, React, Node.js). Sign up, add tasks, and move them across a To do / In progress / Done board.

## Features

- Landing page with an interactive demo board
- Signup and login (bcrypt-hashed passwords, JWT sessions)
- Kanban board with drag and drop, plus arrow buttons for moving tasks
- Task priorities, due dates (overdue tasks turn red), descriptions, and tags
- Edit and delete tasks
- Search by title, description, or tag, and filter by priority
- Progress bar showing the percentage of tasks completed
- Light and dark mode that remembers your choice
- Responsive layout for desktop and mobile
- Each user sees only their own tasks

## Tech stack

| Layer    | Tools                                      |
| -------- | ------------------------------------------ |
| Frontend | React 18, React Router, Vite, plain CSS    |
| Backend  | Node.js, Express, JSON Web Tokens, bcryptjs |
| Database | MongoDB with Mongoose                      |

## Project structure

```
taskflow/
├── client/                 React app (Vite)
│   └── src/
│       ├── pages/          Landing, Auth, Dashboard
│       ├── components/     ThemeToggle, Onboarding
│       ├── api.js          fetch helper that adds the auth token
│       └── styles.css      all styling, including dark theme
└── server/                 Express API
    ├── models/             User, Task
    ├── routes/             auth, tasks
    └── index.js            server entry point
```

## Getting started

### Prerequisites

- Node.js 18 or newer
- A MongoDB database: a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster, or MongoDB installed locally

### 1. Set up the server

```bash
cd server
cp .env.example .env
npm install
```

Edit `.env`:

```
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/taskflow?retryWrites=true&w=majority
JWT_SECRET=a-long-random-string
PORT=5000
```

For local MongoDB, use `MONGO_URI=mongodb://127.0.0.1:27017/taskflow`.

Start the API:

```bash
npm run dev
```

You should see `TaskFlow API ready`.

### 2. Set up the client

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173.

## API reference

All task routes require the header `Authorization: Bearer <token>`.

| Method | Endpoint           | Description                    |
| ------ | ------------------ | ------------------------------ |
| POST   | `/api/auth/signup` | Create an account              |
| POST   | `/api/auth/login`  | Log in and receive a token     |
| GET    | `/api/tasks`       | List your tasks                |
| POST   | `/api/tasks`       | Create a task                  |
| PUT    | `/api/tasks/:id`   | Update a task                  |
| DELETE | `/api/tasks/:id`   | Delete a task                  |

A task has: `title`, `status` (`todo`, `doing`, `done`), `priority` (`low`, `medium`, `high`), `description`, `tags` (up to 6), and `due`.

## Troubleshooting

- **MongoDB auth error:** check the username and password in `MONGO_URI`.
- **Connection timeout:** add your IP address under Network Access in Atlas.
- **Signup shows a network error:** make sure the server is running on port 5000.
- **Port already in use:** change `PORT` in `.env` and the proxy target in `client/vite.config.js`.
- **`.env` changes not applied:** restart the server.

## Security notes

- Never commit `.env`. Add it to `.gitignore`.
- Use a long random `JWT_SECRET` in production.
- Restrict MongoDB network access before going live.

## Roadmap

- Deployment (Atlas, Render, Vercel)
- Task ordering within columns
- Due date reminders
- Shared boards