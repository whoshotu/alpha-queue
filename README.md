# Alpha Queue

This project is a music streaming application named Alpha Queue.

## Overview

This is a full-stack application with a React frontend and a Node.js/Express backend. It uses MongoDB for the database.

## Features

*   User registration and login using JWT authentication.
*   Search for music on YouTube.
*   Create, save, and load playlists.
*   A persistent play queue.

## Running the Application

This application is designed to be run locally. You will need to run two separate processes in two separate terminals.

### 1. Run the Backend Server

-   Open a terminal.
-   Navigate to the backend directory: `cd backend`
-   Install dependencies: `npm install`
-   Start the server: `npm start`
-   *Leave this terminal running.*

### 2. Run the Frontend Application

-   Open a **second** terminal.
-   Navigate to the project's root directory.
-   Install dependencies: `npm install`
-   Start the application: `npm start`
-   Your browser should open to `http://localhost:3001`.

## Configuration

-   The backend requires a `.env` file in the `backend` directory with your `MONGODB_URI` and a `JWT_SECRET`.
-   The frontend API connection is configured in `src/services/api.ts`.