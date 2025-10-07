# Getting Started for Local Development

This guide will help set up the project locally.

## Prerequisites

* [Node.js](https://nodejs.org/en/)
* [Docker](https://www.docker.com/get-started/) - Only if you want to run in a container environment.

## Steps

### 1. Clone the Repository

Use SSH to clone the repository to your local machine:

```bash
git clone git@github.com:aakarshanbasubhardwaj/backup.git
cd backup
```

### 2. Setup Backend Environment

Navigate to the backend folder and create a `.env` file:

```bash
cd backend
touch .env
```

Paste the backend environment variables into the `.env` file.

### 3. Setup Frontend Environment

Navigate to the frontend folder and create a `.env` file:

```bash
cd ../frontend
touch .env
```

Paste the frontend environment variables into the `.env` file.

### 4. Start the Application with Docker

From the root of the repository, run:

```bash
docker compose up --build -d
```

This command will build and start both the frontend and backend containers in detached mode.

---

Local development environment is now ready! You can access the frontend ```at localhost:8080/``` and backend at the PORT as configured in  `backend/.env` file.

### 5. Start the Application Locally

Navigate to the backend directory and install dependencies:
```
cd backend
npm i
```
Run the following command to start the backend server
```
npm run server
```
The backend will now be running on the port defined in your .env file.

Navigate to the frontend folder and run:
```
cd ../frontend
npm run serve
```
This will start the frontend in development mode.
