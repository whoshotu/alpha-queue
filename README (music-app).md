# Gemini Music

A modern music streaming web application built with React and TypeScript, featuring a PHP backend for user authentication and saved playlists.

## Roadmap

- [x] **Phase 1: Project Setup**
- [x] **Phase 2: Core Player Features**
- [x] **Phase 3: User Accounts & Playlists**
  - [x] Backend API (PHP)
  - [x] Frontend Integration (React)
- [x] **Phase 4: Local Development Environment Setup**
- [ ] **Phase 5: UI/UX Overhaul**
- [ ] **Phase 6: YouTube Song Search**

---

## How to Run

This project has two parts: a React frontend and a PHP backend. To run it locally, you need two servers: the React development server and a PHP server (like Apache).

### 1. Local Development Setup (One-Time Setup)

To run the PHP backend and the database, a local server environment like XAMPP is required.

1.  **Install XAMPP:** Download and install XAMPP for Windows. Accept all default settings during installation.
2.  **Configure Apache:**
    - Open the XAMPP Control Panel.
    - For the **Apache** module, click **Config** -> **`httpd.conf`**.
    - Change `Listen 80` to `Listen 8080`.
    - Change `ServerName localhost:80` to `ServerName localhost:8080`.
    - Change `DocumentRoot "C:/xampp/htdocs"` to `DocumentRoot "c:/projects"`.
    - Change `<Directory "C:/xampp/htdocs">` to `<Directory "c:/projects">`.
    - Save and close the file.
3.  **Start Servers:** In the XAMPP Control Panel, start both the **Apache** and **MySQL** modules. They should both have a green background.
4.  **Create Local Database:**
    - Go to `http://localhost:8080/phpmyadmin` in your browser.
    - Create a new database named `my_hereisreal`.
    - Select the new database and go to the **SQL** tab.
    - Copy and run the contents of `backend/config/setup.sql` and `backend/config/setup_playlists.sql` to create the necessary tables.

### 2. Running the Frontend

1.  Open a terminal.
2.  Navigate to the `music-app` directory if you are not already there.
3.  Run the command `npm start`. This will open the application in your browser at `http://localhost:3001`.

---

## Deployment to AlterVista

1.  **Build the Application:** Run `npm --prefix music-app run build` to create the optimized `build` folder.
2.  **Upload Frontend:** Upload the **contents** of the `music-app/build` folder to the `music-app` directory on your AlterVista server.
3.  **Upload Backend:** Upload the entire `backend` folder to the `music-app` directory on your AlterVista server.

---

## Backend API

The backend is located in the `/backend` directory and provides the following endpoints.

### User Authentication

#### `POST /api/register.php`
Creates a new user.

#### `POST /api/login.php`
Authenticates a user.

### Playlists

#### `POST /api/playlists/create.php`
Saves the current queue as a playlist for a logged-in user.

**Request Body:**
```json
{
  "user_id": 1,
  "name": "My Awesome Playlist",
  "songs": [ { "id": "videoId1", "title": "..." }, { "id": "videoId2", "title": "..." } ]
}
```

#### `GET /api/playlists/get.php`
Retrieves all playlists for a given user.

**URL Parameter:** `?user_id=1`

**Response (Success):**
```json
[
  {
    "id": 1,
    "name": "My Awesome Playlist",
    "created_at": "...",
    "songs": [ { "id": "videoId1", "title": "..." } ]
  }
]
```

---

## Database Setup

To use the backend, a MySQL database is required.

1.  **Log in to AlterVista** and open phpMyAdmin.
2.  **Select your database**.
3.  Click the **SQL** tab.
4.  Run the contents of `backend/config/setup.sql` to create the `users` table.
5.  Run the contents of `backend/config/setup_playlists.sql` to create the `playlists` and `playlist_songs` tables.

---

## How to Run (Frontend Development)

1.  Navigate to the `music-app` directory:
    ```bash
    cd music-app
    
---

## Deployment

To deploy the application to a web host like AlterVista, you must first build the application for production.

1.  **Build the Application:**
    Open your terminal and run the following command from the `c:\projects` directory:
    ```bash
    npm --prefix music-app run build
    ```
    This will create a `build` folder inside `c:\projects\music-app`.

2.  **Upload to Server:**
    - Connect to your AlterVista server using a file transfer tool (like WinSCP).
    - On your server, navigate to the root directory (e.g., `htdocs`).
    - Create a folder named `music-app` if it doesn't exist.
    - **Important:** Upload only the **contents** of the local `music-app\build` folder into the `music-app` folder on your server.

Your application will be live at `your-domain.com/music-app`.