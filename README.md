# ElectionGuide AI - PromptWars

ElectionGuide AI is an interactive, full-stack application that helps users learn about elections using Google's Gemini AI model. It features a React-based frontend built with Vite and an Express backend, leveraging Firebase for authentication and database management.

## Project Structure

The project is structured as a monorepo containing both the client and server code:

- `client/`: Contains the frontend Vite application (React, Firebase Auth/DB).
- `server/`: Contains the Node.js Express backend (Gemini API integration, Firebase Admin).

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (Node Package Manager)
- A Google Cloud Project with Gemini API access
- A Firebase Project with Authentication (Google Sign-In) and Realtime Database enabled

## Environment Setup

Before running the application, you need to set up the environment variables for both the client and the server.

### 1. Client Environment Variables

Navigate to the `client` directory and copy the example environment file:

```bash
cd client
cp .env.example .env
```

Open `client/.env` and fill in your Firebase configuration and Google Client ID.

### 2. Server Environment Variables

Navigate to the `server` directory and copy the example environment file:

```bash
cd server
cp .env.example .env
```

Open `server/.env` and fill in your Google Client ID, Google Client Secret, Gemini API Key, and Firebase Project ID.

## Installation

You need to install dependencies for both the frontend and the backend.

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## Running the Application

### Using the Batch Script (Windows)

The easiest way to run the application on Windows is to use the provided `run_app.bat` script. This script will automatically install any missing dependencies, build the frontend, and start the backend server.

Simply double-click `run_app.bat` or run it from your terminal:

```cmd
.\run_app.bat
```

The application will be available at `http://localhost:3005`.

### Manual Start

If you prefer to run the components manually:

1. **Build the frontend:**
   ```bash
   cd client
   npm run build
   ```

2. **Start the backend server:**
   ```bash
   cd server
   npm start
   ```

The application will be served by the backend at `http://localhost:3005`.

## Development

To run the frontend in development mode with Hot Module Replacement (HMR):

```bash
cd client
npm run dev
```

This will start the Vite development server (usually on port 5173). Note that you will also need to have the backend server running to handle API requests.
