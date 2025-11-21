# Banking System Development Prompt

## Project Overview
Create a complete banking application with authentication and transfer functionality using HTML, CSS, JavaScript (frontend) and Python FastAPI (backend). No database - use in-memory data structures.

---

## Backend Requirements (FastAPI)

### 1. Data Structure
- Create an in-memory dictionary to store user accounts
- Each account should have: `name`, `pin_number`, `bank_balance`
- Pre-populate with at least 3-4 sample users for testing
- Example structure:
  ```python
  accounts = {
      "john_doe": {"pin_number": "1234", "bank_balance": 5000.00},
      "jane_smith": {"pin_number": "5678", "bank_balance": 3000.00}
  }
  ```

### 2. API Endpoints

#### POST `/authenticate`
**Purpose:** Validate user credentials and return account information

**Request Body:**
```json
{
  "name": "string",
  "pin_number": "string"
}
```

**Response (Success - 200):**
```json
{
  "status": "success",
  "message": "Authentication successful",
  "data": {
    "name": "string",
    "bank_balance": float
  }
}
```

**Response (Failure - 401):**
```json
{
  "status": "error",
  "message": "Invalid name or PIN"
}
```

**Implementation Notes:**
- Validate that name exists in accounts
- Check if PIN matches
- Return current balance on success
- Use proper HTTP status codes

#### POST `/bank-transfer`
**Purpose:** Transfer money from authenticated user to recipient

**Request Body:**
```json
{
  "sender_name": "string",
  "sender_pin": "string",
  "recipient_name": "string",
  "amount": float
}
```

**Response (Success - 200):**
```json
{
  "status": "success",
  "message": "Transfer successful",
  "data": {
    "sender_balance": float,
    "recipient_balance": float,
    "amount_transferred": float
  }
}
```

**Response (Failure - 400/401/404):**
```json
{
  "status": "error",
  "message": "Specific error message"
}
```

**Validation Rules:**
- Authenticate sender (name + PIN)
- Check if recipient exists
- Verify sender has sufficient balance
- Amount must be positive
- Deduct from sender, add to recipient atomically
- Return updated balances

#### GET `/accounts` (Optional - for testing)
Return list of all account names and balances (without PINs)

---

## Frontend Requirements (HTML/CSS/JavaScript)

### 3. User Interface Design

#### Page Structure
Create a **single-page application** with three main views:
1. **Login/Authentication View**
2. **Dashboard View** (after successful login)
3. **Transfer View**

#### UI/UX Best Practices

**Color Scheme & Branding:**
- Use professional banking colors (blues, whites, grays)
- Add subtle gradients for modern feel
- Ensure high contrast for accessibility
- Use a clean, trustworthy aesthetic

**Typography:**
- Clear, readable fonts (e.g., Inter, Roboto, System UI)
- Proper hierarchy (h1, h2, body text)
- Adequate spacing and line height

**Layout:**
- Centered, card-based design
- Responsive (works on mobile and desktop)
- Maximum width of 500-600px for forms
- Proper padding and margins

### 4. Authentication View

**Elements:**
- App logo/title
- Welcome message
- Name input field (with icon)
- PIN input field (masked, with toggle visibility icon)
- "Login" button (full width, prominent)
- Loading state during API call
- Error message display area

**UX Features:**
- Auto-focus on name field
- Enter key submits form
- Show loading spinner on button during request
- Shake animation on failed login
- Clear error messages in red
- Success feedback before transitioning

**Validation:**
- Client-side: Check for empty fields
- Show inline validation errors
- Disable button while loading

### 5. Dashboard View

**Elements:**
- Header with user name and logout button
- "Welcome back, [Name]!" greeting
- Balance card showing:
  - "Current Balance" label
  - Large, formatted balance (e.g., $5,000.00)
  - Last updated timestamp
- "Transfer Money" button (prominent CTA)
- Recent transactions section (if time permits)

**UX Features:**
- Smooth fade-in animation on load
- Balance displayed prominently with currency symbol
- Refresh button to re-authenticate and get latest balance
- Visual feedback on all interactions

### 6. Transfer View

**Elements:**
- Back button/link to dashboard
- "Transfer Money" heading
- Recipient name input (with search/autocomplete if possible)
- Amount input (with currency symbol)
- Transfer button
- Confirmation dialog before executing transfer
- Success/error message display

**UX Features:**
- Real-time validation:
  - Check if amount exceeds balance
  - Ensure recipient exists
  - Amount must be positive
- Format currency as user types
- Confirmation modal: "Transfer $X to [Name]?"
- Success animation (checkmark, confetti)
- Show updated balances for both sender and recipient
- Option to "Make Another Transfer" or "Return to Dashboard"

**Post-Transfer Flow:**
- After successful transfer, briefly show success message
- Display: "Sent $X to [Recipient]"
- Show your new balance
- Show recipient's new balance (to verify transfer worked)
- Automatically transition to dashboard after 3-4 seconds

### 7. JavaScript Implementation

**Required Functionality:**
- Fetch API for all backend calls
- Proper error handling with try-catch
- Store authenticated user in memory (or sessionStorage if absolutely needed)
- Form validation before API calls
- Dynamic DOM manipulation to switch views
- Loading states for all async operations
- Format numbers as currency (Intl.NumberFormat)

**Code Structure:**
```javascript
// API base URL
const API_BASE = 'http://localhost:8000';

// State management
let currentUser = null;

// API functions
async function authenticate(name, pin) { }
async function transferMoney(sender, recipient, amount) { }

// UI functions
function showLogin() { }
function showDashboard(userData) { }
function showTransfer() { }
function showError(message) { }
function showSuccess(message) { }

// Event listeners
// Form submissions, button clicks, etc.
```

**Advanced Features (Optional):**
- Transaction history (store in memory)
- Input autocomplete for recipient names
- Dark mode toggle
- Animations using CSS transitions
- Toast notifications instead of alert()

### 8. CSS Styling

**Must-Have Styles:**
- CSS Reset/Normalize
- Flexbox/Grid for layouts
- Card components with shadows
- Button hover states and active states
- Input focus styles
- Smooth transitions (0.3s ease)
- Loading spinner animation
- Error/success message styles
- Responsive media queries

**Suggested CSS Structure:**
```css
/* Variables */
:root {
  --primary-color: #2563eb;
  --success-color: #10b981;
  --error-color: #ef4444;
  --text-primary: #1f2937;
  --background: #f9fafb;
}

/* Components */
.card { }
.button { }
.input { }
.error-message { }
.success-message { }
.loading-spinner { }
```

---

## Testing Requirements

### Test Scenarios to Verify:

1. **Authentication:**
   - ✅ Login with correct credentials
   - ✅ Login with wrong PIN
   - ✅ Login with non-existent user
   - ✅ Balance displays correctly

2. **Transfer:**
   - ✅ Successful transfer between two users
   - ✅ Transfer amount exceeds balance (should fail)
   - ✅ Transfer to non-existent recipient (should fail)
   - ✅ Transfer negative amount (should fail)
   - ✅ Balances update correctly for both users

3. **Post-Transfer Authentication:**
   - ✅ Login as recipient after transfer
   - ✅ Verify recipient's balance increased
   - ✅ Login as sender again
   - ✅ Verify sender's balance decreased

4. **UI/UX:**
   - ✅ All buttons have hover effects
   - ✅ Forms validate before submission
   - ✅ Loading states show during API calls
   - ✅ Error messages are clear and helpful
   - ✅ Success messages are encouraging
   - ✅ Responsive on mobile and desktop

---

## Deliverables

1. **Backend:** `main.py` with FastAPI server
2. **Frontend:** 
   - `index.html` (structure)
   - `styles.css` (styling)
   - `app.js` (functionality)
3. **README.md** with:
   - Setup instructions
   - How to run the server
   - Test user credentials
   - API endpoint documentation

---

## Bonus Enhancements (If Time Permits)

- Add CORS properly configured
- Input sanitization and validation
- Rate limiting on authentication attempts
- Transaction ID generation
- Email-style notifications on successful transfers
- Print/Download transaction receipt
- Multiple currency support
- Account lockout after failed attempts
- Password strength indicator (if adding registration)