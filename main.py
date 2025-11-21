import time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Dict, Any

# --- Application Setup ---
app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

# --- CORS Middleware ---
# Allows the frontend to communicate with this backend
origins = [
    "https://q4-second-assignment-1v75.vercel.app/",
    "http://localhost",
    "http://localhost:8080",
    "http://127.0.0.1:5500", # Common for Live Server
    "null" # For local file access
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all origins for simplicity
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- In-Memory Database ---
# Using a simple dictionary to store user data
db: Dict[str, Dict[str, Any]] = {
    "Ayesha": {"pin": "9876", "balance": 100000.00},
    "Ahsan": {"pin": "1234", "balance": 5000.00},
    "Shan": {"pin": "5678", "balance": 2500.00},
}

# --- Pydantic Models (for Request Bodies) ---
class AuthRequest(BaseModel):
    name: str
    pin: str

class TransferRequest(BaseModel):
    sender: str
    recipient: str
    amount: float

# --- API Endpoints ---
@app.get("/")
def read_root():
    """Serve the index.html file."""
    return FileResponse('index.html')

@app.post("/authenticate")
def authenticate(auth_request: AuthRequest):
    """Authenticates a user based on name and PIN."""
    user = db.get(auth_request.name)
    if user and user["pin"] == auth_request.pin:
        return {
            "name": auth_request.name,
            "balance": user["balance"],
            "lastUpdated": time.time()
        }
    # Simulate a delay to prevent timing attacks
    time.sleep(0.5)
    raise HTTPException(status_code=401, detail="Invalid username or PIN")

@app.post("/transfer")
def transfer_money(transfer_request: TransferRequest):
    """Handles the transfer of money between two users."""
    sender_name = transfer_request.sender
    recipient_name = transfer_request.recipient
    amount = transfer_request.amount

    # --- Validation ---
    if sender_name not in db:
        raise HTTPException(status_code=404, detail="Sender not found.")
    if recipient_name not in db:
        raise HTTPException(status_code=404, detail="Recipient not found.")
    if sender_name == recipient_name:
        raise HTTPException(status_code=400, detail="Cannot transfer money to yourself.")
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Transfer amount must be positive.")
    if db[sender_name]["balance"] < amount:
        raise HTTPException(status_code=400, detail="Insufficient funds.")

    # --- Perform Transaction ---
    try:
        db[sender_name]["balance"] -= amount
        db[recipient_name]["balance"] += amount

        return {
            "message": "Transfer successful!",
            "sender": {
                "name": sender_name,
                "newBalance": db[sender_name]["balance"]
            },
            "recipient": {
                "name": recipient_name,
                "newBalance": db[recipient_name]["balance"]
            },
            "timestamp": time.time()
        }
    except Exception as e:
        # Basic rollback in case of an unexpected error
        # (less likely in this simple case, but good practice)
        if db[sender_name]["balance"] + amount == db[recipient_name]["balance"]:
             db[sender_name]["balance"] += amount
             db[recipient_name]["balance"] -= amount
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")

# --- To run this app: `uvicorn main:app --reload` ---
