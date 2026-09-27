# Smart_Task_Manager_Assingment


Application built using Next.js, React, Node.js and Express.js.

# Problem Statement

Build a Smart Task Manager Web Application that allows users to create, edit, assign, and track tasks. The application supports multiple users, task priorities, statuses, and task dependencies. A task can depend on another task. Data is managed in memory for this exercise to simulate a real-world collaboration and state-driven application.

## Features

- Create new users
- Mock user login
- View all users
- Create tasks
- Edit tasks
- Delete tasks
- Assign tasks to users
- Set task priority
- Set task status
- Add task dependencies
- View My Tasks
- View blocked tasks
- Mark tasks as Done
- Task filtering
- In-memory data storage

## Technology Used

### Frontend
- Next.js
- React
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- CORS

### Database
- In-memory JavaScript Map

# Installation

Backend

cd backend
npm install

Frontend

Open a second terminal:

cd frontend
npm install

Run the Application

Two terminals are required.

Terminal 1: Backend

cd backend
npm run dev

If the project does not have a dev script:

node server.js

Backend:

http://localhost:5000

Terminal 2: Frontend

cd frontend
npm run dev

Frontend:

http://localhost:3000



## Project Structure

```text
Assignment_Task_Manager/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── app/
│   │   ├── page.js
│   │   ├── page.module.css
│   │   ├── globals.css
│   │   └── layout.js
│   
│   ├── package.json
│   └── package-lock.json
│
├── README.md
└── .gitignore


