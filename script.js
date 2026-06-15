// Initialize data from localStorage
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let savingsTarget = JSON.parse(localStorage.getItem('savingsTarget')) || 0;

// Load data on page load
window.addEventListener('DOMContentLoaded', () => {
    displayTransactions();
    updateSummary();
    updateProgress();
    if (savingsTarget > 0) {
        document.getElementById('targetDisplay').textContent = `Target: $${savingsTarget.toFixed(2)}`;
    }
});

// Set Savings Target
function setSavingsTarget() {
    const targetAmount = parseFloat(document.getElementById('targetAmount').value);
    
    if (isNaN(targetAmount) || targetAmount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    savingsTarget = targetAmount;
    localStorage.setItem('savingsTarget', JSON.stringify(savingsTarget));
    document.getElementById('targetAmount').value = '';
    document.getElementById('targetDisplay').textContent = `Target: $${savingsTarget.toFixed(2)}`;
    updateProgress();
    alert('✅ Savings target set successfully!');
}

// Add Transaction
function addTransaction() {
    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;
    
    if (!description || isNaN(amount) || amount <= 0) {
        alert('❌ Please fill in all fields correctly');
        return;
    }
    
    const transaction = {
        id: Date.now(),
        description,
        amount,
        type,
        category,
        date: new Date().toLocaleDateString()
    };
    
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    // Clear inputs
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('type').value = 'expense';
    document.getElementById('category').value = 'food';
    
    displayTransactions();
    updateSummary();
    updateProgress();
}

// Display Transactions
function displayTransactions() {
    const transactionsList = document.getElementById('transactionsList');
    
    if (transactions.length === 0) {
        transactionsList.innerHTML = '<p style="text-align: center; color: #999;">No transactions yet</p>';
        return;
    }
    
    transactionsList.innerHTML = transactions
        .slice()
        .reverse()
        .map(t => {
            const categoryEmoji = {
                'food': '🍔',
                'travel': '🚗',
                'entertainment': '🎬',
                'utilities': '💡',
                'other': '📌'
            };
            
            return `
                <div class="transaction-item ${t.type}">
                    <div class="transaction-info">
                        <div class="transaction-desc">${categoryEmoji[t.category]} ${t.description}</div>
                        <div class="transaction-meta">${t.date}</div>
                    </div>
                    <div class="transaction-amount ${t.type}">
                        ${t.type === 'expense' ? '-' : '+'}$${t.amount.toFixed(2)}
                    </div>
                    <button class="btn-delete" onclick="deleteTransaction(${t.id})">🗑️</button>
                </div>
            `;
        })
        .join('');
}

// Delete Transaction
function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(t => t.id !== id);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        displayTransactions();
        updateSummary();
        updateProgress();
    }
}

// Update Summary
function updateSummary() {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpense;
    
    document.getElementById('totalIncome').textContent = `$${totalIncome.toFixed(2)}`;
    document.getElementById('totalExpense').textContent = `$${totalExpense.toFixed(2)}`;
    document.getElementById('balance').textContent = `$${balance.toFixed(2)}`;
}

// Update Progress Bar
function updateProgress() {
    if (savingsTarget === 0) {
        document.getElementById('progressFill').style.width = '0%';
        document.getElementById('progressText').textContent = 'Set a savings target first!';
        return;
    }
    
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const saved = totalIncome - totalExpense;
    const percentage = Math.min((saved / savingsTarget) * 100, 100);
    
    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('progressText').textContent = `Saved: $${saved.toFixed(2)} / Target: $${savingsTarget.toFixed(2)}`;
}

// Clear All Transactions
function clearAllTransactions() {
    if (confirm('Are you sure you want to clear all transactions? This cannot be undone.')) {
        transactions = [];
        localStorage.setItem('transactions', JSON.stringify(transactions));
        displayTransactions();
        updateSummary();
        updateProgress();
    }
}