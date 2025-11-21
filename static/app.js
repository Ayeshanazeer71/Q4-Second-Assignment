document.addEventListener("DOMContentLoaded", () => {
    // --- Constants and State ---
    const API_BASE = 'http://127.0.0.1:8000';
    let currentUser = null;

    // --- DOM Element Selectors ---
    const views = {
        login: document.getElementById('login-view'),
        dashboard: document.getElementById('dashboard-view'),
        transfer: document.getElementById('transfer-view'),
    };

    const forms = {
        login: document.getElementById('login-form'),
        transfer: document.getElementById('transfer-form'),
    };

    const inputs = {
        name: document.getElementById('name'),
        pin: document.getElementById('pin'),
        recipient: document.getElementById('recipient'),
        amount: document.getElementById('amount'),
    };

    const display = {
        greeting: document.getElementById('greeting'),
        balance: document.getElementById('balance'),
        lastUpdated: document.getElementById('last-updated'),
    };

    const buttons = {
        logout: document.getElementById('logout-button'),
        showTransfer: document.getElementById('show-transfer-button'),
        backToDashboard: document.getElementById('back-to-dashboard-button'),
    };
    
    const notificationArea = document.getElementById('notification-area');
    const loader = document.getElementById('loader');

    // --- UI Manipulation Functions ---
    const showView = (viewId) => {
        Object.values(views).forEach(view => view.classList.add('hidden'));
        views[viewId].classList.remove('hidden');
    };

    const showLoader = () => loader.classList.remove('hidden');
    const hideLoader = () => loader.classList.add('hidden');

    const showNotification = (message, type = 'error') => {
        notificationArea.textContent = message;
        notificationArea.className = type === 'success' ? 'success-message' : 'error-message';
        notificationArea.classList.remove('hidden');
        setTimeout(() => notificationArea.classList.add('hidden'), 5000);
    };
    
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };
    
    const formatTimestamp = (unixTimestamp) => {
        const date = new Date(unixTimestamp * 1000);
        return `Today at ${date.toLocaleTimeString()}`;
    };

    const updateDashboard = () => {
        if (!currentUser) return;
        display.greeting.textContent = `Hello, ${currentUser.name}!`;
        display.balance.textContent = formatCurrency(currentUser.balance);
        display.lastUpdated.textContent = `Last updated: ${formatTimestamp(currentUser.lastUpdated)}`;
    };

    // --- API Request Function ---
    const apiRequest = async (endpoint, method, body) => {
        try {
            const response = await fetch(`${API_BASE}${endpoint}`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.detail || 'An unknown error occurred.');
            }
            return data;
        } catch (error) {
            console.error(`API Request Error: ${error.message}`);
            throw error;
        }
    };

    // --- Event Handlers ---
    const handleLogin = async (event) => {
        event.preventDefault();
        showLoader();
        
        const name = inputs.name.value.trim();
        const pin = inputs.pin.value;

        if (!name || !pin) {
            showNotification('Name and PIN are required.');
            hideLoader();
            return;
        }

        try {
            const data = await apiRequest('/authenticate', 'POST', { name, pin });
            currentUser = data;
            updateDashboard();
            showView('dashboard');
            forms.login.reset();
        } catch (error) {
            showNotification(error.message);
        } finally {
            hideLoader();
        }
    };

    const handleTransfer = async (event) => {
        event.preventDefault();
        showLoader();

        const recipient = inputs.recipient.value.trim();
        const amount = parseFloat(inputs.amount.value);
        
        if (!recipient || !amount) {
            showNotification('Recipient and amount are required.');
            hideLoader();
            return;
        }
        if (amount <= 0) {
            showNotification('Transfer amount must be positive.');
            hideLoader();
            return;
        }
         if (currentUser.balance < amount) {
            showNotification('Insufficient funds.');
            hideLoader();
            return;
        }


        try {
            const data = await apiRequest('/transfer', 'POST', {
                sender: currentUser.name,
                recipient,
                amount,
            });
            // Update current user's balance from response
            currentUser.balance = data.sender.newBalance;
            currentUser.lastUpdated = data.timestamp;
            
            showNotification(data.message, 'success');
            updateDashboard();
            showView('dashboard');
            forms.transfer.reset();
        } catch (error) {
            showNotification(error.message);
        } finally {
            hideLoader();
        }
    };

    const handleLogout = () => {
        currentUser = null;
        showView('login');
        forms.login.reset();
        forms.transfer.reset();
    };

    // --- Event Listeners ---
    forms.login.addEventListener('submit', handleLogin);
    forms.transfer.addEventListener('submit', handleTransfer);
    buttons.logout.addEventListener('click', handleLogout);
    buttons.showTransfer.addEventListener('click', () => showView('transfer'));
    buttons.backToDashboard.addEventListener('click', () => showView('dashboard'));

    // --- Initial Setup ---
    showView('login'); // Start on the login page
});
