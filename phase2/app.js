// Main App Logic - Parametric Insurance

let currentClaimId = 'PR-88291';
let claimReason = 'Heavy Rain';

function switchTab(tabId) {
    // Hide all views
    document.getElementById('view-dashboard').classList.add('opacity-0', 'pointer-events-none');
    document.getElementById('view-claim').classList.add('opacity-0', 'pointer-events-none');
    document.getElementById('view-mobile').classList.add('opacity-0', 'pointer-events-none');

    // Remove active styles from tabs
    document.getElementById('tab-dashboard').className = "w-full text-left px-4 py-3 rounded-lg text-slate-400 font-medium transition-all hover:bg-slate-800 hover:text-slate-200 flex items-center gap-3";
    document.getElementById('tab-claim').className = "w-full text-left px-4 py-3 rounded-lg text-slate-400 font-medium transition-all hover:bg-slate-800 hover:text-slate-200 flex items-center gap-3";
    document.getElementById('tab-mobile').className = "w-full text-left px-4 py-3 rounded-lg text-slate-400 font-medium transition-all hover:bg-slate-800 hover:text-slate-200 flex items-center gap-3";

    // Show active view
    setTimeout(() => {
        document.getElementById(`view-${tabId}`).classList.remove('opacity-0', 'pointer-events-none');
        if (tabId === 'dashboard') {
            map.invalidateSize();
        }
    }, 150);

    // Apply active styles
    const activeTab = document.getElementById(`tab-${tabId}`);
    activeTab.className = "w-full text-left px-4 py-3 rounded-lg bg-slate-800 text-neonBlue font-medium transition-all hover:bg-slate-700 flex items-center gap-3 shadow-[0_0_10px_rgba(56,189,248,0.2)]";
}

// Open Claim dynamically from the Dashboard Feed
function openClaim(id, payload) {
    currentClaimId = id;
    
    document.getElementById('claim-id-display').innerText = `Trigger Event #${id}`;
    
    // Switch tab
    switchTab('claim');

    // Update Oracle Console
    const consoleBadge = document.getElementById('oracle-alert-badge');
    const logList = document.getElementById('oracle-log-list');
    const finalVerdict = document.getElementById('oracle-final-verdict');
    
    consoleBadge.className = "bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded font-bold border border-green-500/50";
    consoleBadge.innerText = "TRIGGER MET";
    logList.innerHTML = `
        <li class="flex items-start gap-3 bg-blue-500/10 p-3 rounded border border-blue-500/20">
            <svg class="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            <div>
                <p class="text-sm font-semibold text-blue-400">Oracle Data Pulled</p>
                <p class="text-xs text-slate-400 mt-1">Verified ${payload.trigger} in ${payload.loc} via Public API.</p>
            </div>
        </li>
        <li class="flex items-start gap-3 bg-green-500/5 p-3 rounded border border-green-500/20">
            <svg class="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <div>
                <p class="text-sm font-semibold text-green-400">Policy Match Database</p>
                <p class="text-xs text-slate-400 mt-1">Found 1,420 Active Weekly Coverage policies in ${payload.loc}.</p>
            </div>
        </li>`;
    finalVerdict.innerHTML = `<span class="bg-green-500/20 px-4 py-2 text-green-400 rounded font-bold tracking-wider shadow-[0_0_15px_rgba(34,197,94,0.1)] border border-green-500/30">PAYOUT APPROVED</span>`;
    
    updateLossChart();
}

// --------------------------------------------------------
// 1. Dashboard: Leaflet Map Setup
// --------------------------------------------------------
const map = L.map('map', {
    zoomControl: false,
}).setView([12.9716, 77.5946], 13); // Centered on Bengaluru

L.control.zoom({ position: 'bottomright' }).addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

const clusterIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="bg-blue-500/20 p-2 rounded-full animate-pulse-fast"><div class="bg-neonBlue w-4 h-4 rounded-full border-2 border-white/50 shadow-[0_0_15px_rgba(56,189,248,1)]"></div></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});

L.marker([12.9716, 77.5946], { icon: clusterIcon }).addTo(map);
L.marker([12.9515, 77.6322], { icon: clusterIcon }).addTo(map);

let heatmapLayer = L.layerGroup();
// Heatmap of Weather Risk Areas
const heatPoints = [
    [12.9716, 77.5946, 500, '#38bdf8'],
    [12.9616, 77.5846, 900, '#38bdf8'],
    [12.9515, 77.6322, 600, '#ef4444'], // High risk Curfew/Rain
    [12.9315, 77.6022, 400, '#38bdf8'],
    [12.9234, 77.5855, 700, '#38bdf8'],
];

heatPoints.forEach(p => {
    L.circle([p[0], p[1]], {
        color: 'transparent',
        fillColor: p[3],
        fillOpacity: 0.2,
        radius: p[2]
    }).addTo(heatmapLayer);
});

heatmapLayer.addTo(map);

function toggleHeatmap() {
    const isChecked = document.getElementById('heatmap-toggle').checked;
    if (isChecked) {
        map.addLayer(heatmapLayer);
        document.querySelector('.dot').classList.add('translate-x-4', 'bg-neonBlue');
        document.querySelector('.dot').classList.remove('bg-white');
    } else {
        map.removeLayer(heatmapLayer);
        document.querySelector('.dot').classList.remove('translate-x-4', 'bg-neonBlue');
        document.querySelector('.dot').classList.add('bg-white');
    }
}

// --------------------------------------------------------
// Dashboard: Real-time Alerts Feed (Parametric Triggers)
// --------------------------------------------------------
const feedList = document.getElementById('alerts-feed');

const initialAlerts = [
    { id: 'PR-88291', loc: 'Bengaluru Central', trigger: 'Rainfall > 15mm/hr', time: 'Just now', type: 'Weather', metric: '16.2 mm' },
    { id: 'PR-11002', loc: 'Indiranagar', trigger: 'AQI > 300', time: '2 mins ago', type: 'Pollution', metric: '315 AQI' },
    { id: 'PR-88289', loc: 'Shivajinagar', trigger: 'City Curfew Active', time: '11 mins ago', type: 'Admin', metric: 'Sec 144' },
    { id: 'PR-11003', loc: 'HSR Layout', trigger: 'Rainfall > 10mm/hr', time: '20 mins ago', type: 'Weather', metric: '10.5 mm' },
    { id: 'PR-88287', loc: 'Whitefield', trigger: 'AQI > 300', time: '45 mins ago', type: 'Pollution', metric: '342 AQI' }
];

function renderAlerts() {
    feedList.innerHTML = initialAlerts.map(alert => `
        <div class="bg-slate-800/80 rounded-lg p-3 border border-slate-700 hover:border-neonBlue cursor-pointer transition-colors" onclick="openClaim('${alert.id}', ${JSON.stringify(alert).replace(/"/g, '&quot;')})">
            <div class="flex justify-between items-start mb-1">
                <span class="text-xs font-mono text-neonBlue">${alert.id}</span>
                <span class="text-[10px] text-slate-500">${alert.time}</span>
            </div>
            <p class="text-sm font-semibold text-white truncate">${alert.trigger}</p>
            <p class="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                ${alert.loc}
            </p>
            <div class="mt-2 text-[10px] bg-slate-900/50 text-slate-300 px-2 py-0.5 rounded uppercase font-bold inline-block border border-slate-700">Oracle: ${alert.metric}</div>
        </div>
    `).join('');
}
renderAlerts();

// --------------------------------------------------------
// 2. Claim Verification: Chart.js Setup (Loss Ratios)
// --------------------------------------------------------
const ctx = document.getElementById('lossChart').getContext('2d');

let lossChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Predicted Premium Inflow (INR)',
            data: [50000, 52000, 51000, 49000, 55000, 60000, 58000],
            backgroundColor: 'rgba(56, 189, 248, 0.2)',
            borderColor: '#38bdf8',
            borderWidth: 1,
            borderRadius: 4
        },
        {
            label: 'Triggered Payouts (INR)',
            data: [2000, 1500, 48000, 1000, 5000, 2000, 4000], 
            backgroundColor: 'rgba(239, 68, 68, 0.5)',
            borderColor: '#ef4444',
            borderWidth: 1,
            borderRadius: 4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#94a3b8' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#94a3b8' }
            }
        },
        plugins: {
            legend: { labels: { color: '#e2e8f0' } }
        }
    }
});

function updateLossChart() {
    lossChart.update();
}

// --------------------------------------------------------
// 3. PWA Delivery Partner App (Weekly Premium Engine)
// --------------------------------------------------------
let currentPremium = 50;
let coverageActive = true;

function calculateDynamicPremium(zone) {
    const BASE = 40;
    // Simulate AI Prediction Risk Modification
    const weatherRisk = Math.random() > 0.5 ? 15 : 0; 
    currentPremium = BASE + weatherRisk;
    
    document.getElementById('weekly-premium-display').innerText = `₹${currentPremium}/wk`;
    
    if(weatherRisk > 0) {
        document.getElementById('premium-reason').innerText = "Increased due to severe weather forecast";
        document.getElementById('premium-reason').className = "text-[10px] text-yellow-400 mt-1 block";
    } else {
        document.getElementById('premium-reason').innerText = "Based on standard safe-zone rate";
        document.getElementById('premium-reason').className = "text-[10px] text-green-400 mt-1 block";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    calculateDynamicPremium('Bengaluru');
    switchTab('dashboard'); // Start on dashboard
});
