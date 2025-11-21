# Simple Bank - Full-Stack Application

This project is a simple, single-page web application for basic banking operations, including user authentication and money transfers. It was built using a Python FastAPI backend and a vanilla HTML, CSS, and JavaScript frontend.

---

## Features

- User authentication via Name and PIN.
- A dashboard to view account balance.
- Functionality to transfer money to other users.
- Real-time validation and feedback for user actions.
- Clean, responsive, and modern user interface.

---

## Project Structure

```
/
├── main.py           # FastAPI Backend Server
├── index.html        # Frontend HTML
├── styles.css        # Frontend CSS
├── app.js            # Frontend JavaScript
├── requirements.txt  # Python dependencies
└── README.md         # This file
```

---

## Setup and Running the Application

### 1. Backend (FastAPI Server)

First, you need to install the required Python packages.

**Installation:**
Open your terminal and run the following command in the project root directory:
```bash
pip install -r requirements.txt
```

**Running the Server:**
Once the dependencies are installed, you can start the backend server:
```bash
uvicorn main:app --reload
```
The server will start on `http://127.0.0.1:8000`. The `--reload` flag means the server will automatically restart when you make changes to the `main.py` file.

### 2. Frontend (Web Interface)

The frontend is built with simple HTML, CSS, and JavaScript and requires no build step.

**Running the Frontend:**
Simply open the `index.html` file in your web browser. For the best experience (to avoid potential CORS issues with local files), it's recommended to serve the file using a simple local server. If you have VS Code, the "Live Server" extension is a great option.

---

## Test User Credentials

You can use the following user accounts to test the application:

| Name    | PIN   | Initial Balance |
|---------|-------|-----------------|
| `Alice` | `1234`| $5,000.00       |
| `Bob`   | `5678`| $2,500.00       |
| `Charlie`| `9876`| $10,000.00      |

---

## API Endpoint Documentation

The backend provides the following JSON API endpoints:

### `POST /authenticate`
Authenticates a user and returns their account details.

**Request Body:**
```json
{
  "name": "Alice",
  "pin": "1234"
}
```

**Success Response (200):**
```json
{
  "name": "Alice",
  "balance": 5000.00,
  "lastUpdated": 1679200000
}
```

**Error Response (401):**
```json
{
  "detail": "Invalid username or PIN"
}
```

### `POST /transfer`
Executes a money transfer between two users.

**Request Body:**
```json
{
  "sender": "Alice",
  "recipient": "Bob",
  "amount": 100.50
}
```

**Success Response (200):**
```json
{
    "message": "Transfer successful!",
    "sender": {
        "name": "Alice",
        "newBalance": 4899.50
    },
    "recipient": {
        "name": "Bob",
        "newBalance": 2600.50
    },
    "timestamp": 1679200100
}
```

**Error Responses (400, 404):**
```json
{ "detail": "Insufficient funds." }
{ "detail": "Recipient not found." }
```
