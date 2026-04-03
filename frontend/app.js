const BASE_URL = 'http://localhost:5000/api';
let currentUser = null;
let categoryChartInstance = null;

const loginView = document.getElementById('loginView');
const dashboardView = document.getElementById('dashboardView');
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');

function init() {
    document.getElementById('dateDisplay').textContent = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const storedUser = localStorage.getItem('finance_user');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showDashboard();
    }
}

function showDashboard() {
    loginView.classList.remove('active');
    dashboardView.classList.add('active');
    document.getElementById('userNameDisplay').textContent = currentUser.name.split(' ')[0];
    fetchDashboardData();
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value;
    try {
        const res = await fetch(`${BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        if (res.ok) {
            currentUser = await res.json();
            localStorage.setItem('finance_user', JSON.stringify(currentUser));
            showDashboard();
        } else {
            // Demo fallback: create the user
            const resCreate = await fetch(`${BASE_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: email.split('@')[0], email, role: 'Admin' })
            });
            if (resCreate.ok) {
                currentUser = await resCreate.json();
                localStorage.setItem('finance_user', JSON.stringify(currentUser));
                showDashboard();
            } else {
                alert("Login Error: " + (await resCreate.json()).message);
            }
        }
    } catch (err) {
        alert("Server is offline. Start the backend with 'node backend/server.js'");
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('finance_user');
    currentUser = null;
    dashboardView.classList.remove('active');
    loginView.classList.add('active');
});

// Modal Logic
const modal = document.getElementById('recordModal');
document.getElementById('openAddModal').addEventListener('click', () => modal.classList.add('active'));
document.getElementById('closeModal').addEventListener('click', () => modal.classList.remove('active'));

document.getElementById('recordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const amount = document.getElementById('recordAmount').value;
    const type = document.getElementById('recordType').value;
    const category = document.getElementById('recordCategory').value;

    try {
        const res = await fetch(`${BASE_URL}/records`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': currentUser._id
            },
            body: JSON.stringify({ amount: Number(amount), type, category })
        });
        
        if (res.ok) {
            modal.classList.remove('active');
            document.getElementById('recordForm').reset();
            fetchDashboardData();
        } else {
            const data = await res.json();
            alert("Error adding record: " + (data.message || "Invalid data"));
        }
    } catch (err) {
        console.error(err);
    }
});

async function fetchDashboardData() {
    try {
        const res = await fetch(`${BASE_URL}/summary`, {
            headers: { 'x-user-id': currentUser._id }
        });
        if (!res.ok) throw new Error('Failed to fetch data');
        
        const data = await res.json();
        
        document.getElementById('totalIncome').textContent = `$${data.totals.totalIncome.toLocaleString()}`;
        document.getElementById('totalExpenses').textContent = `$${data.totals.totalExpenses.toLocaleString()}`;
        document.getElementById('netBalance').textContent = `$${data.totals.netBalance.toLocaleString()}`;
        
        renderRecent(data.recentActivity);
        renderChart(data.categoryBreakdown);
    } catch (err) {
        console.error(err);
    }
}

function renderRecent(activities) {
    const list = document.getElementById('recentActivityList');
    list.innerHTML = '';
    
    if (activities.length === 0) {
        list.innerHTML = '<p style="color:var(--text-gray);text-align:center;margin-top:2rem;">No recent activity</p>';
        return;
    }

    activities.forEach(item => {
        const div = document.createElement('div');
        div.className = 'recent-item';
        div.innerHTML = `
            <div class="item-left">
                <div class="item-icon">${item.type === 'income' ? '↓' : '↑'}</div>
                <div class="item-details">
                    <h4>${item.category}</h4>
                    <p>${new Date(item.date).toLocaleDateString()}</p>
                </div>
            </div>
            <div class="item-right">
                <h4 class="${item.type}">$${item.amount.toLocaleString()}</h4>
            </div>
        `;
        list.appendChild(div);
    });
}

function renderChart(categories) {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    if (categoryChartInstance) categoryChartInstance.destroy();
    
    if(Object.keys(categories).length === 0) {
        categories = { "No Data": 0 };
    }
    
    categoryChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                label: 'Amount ($)',
                data: Object.values(categories),
                backgroundColor: '#8c82fc',
                borderRadius: 8,
                barPercentage: 0.6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: '#38383e' }, ticks: { color: '#a0a0a5' } },
                x: { grid: { display: false }, ticks: { color: '#a0a0a5' } }
            }
        }
    });
}

init();
