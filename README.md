# Alpha Queue

This project is a music streaming application named Alpha Queue. It was formerly known as Gemini Music.

## Backend

The backend is built with **Node.js** and **Express**, using **MongoDB** for the database. The backend is responsible for user authentication and playlist management.

### Setup

1.  Navigate to the `backend` directory.
2.  Run `npm install` to install the backend dependencies.
3.  Create a `.env` file in the `backend` directory with the following content:

    ```
    MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
    ```

    Replace `<user>`, `<password>`, `<cluster-url>`, and `<database-name>` with your MongoDB Atlas credentials.

## Frontend

The frontend is a React application built with Create React App.

### Setup

1.  Install Node.js and npm.
2.  Run `npm install` in the root directory to install the dependencies.
3.  Run `npm start` to start the development server.

## Deployment

The application is deployed on **Heroku**. The `Procfile` in the root directory is configured to run the Node.js backend server.