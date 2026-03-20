// Main App Logic

// Simple Navigation Router
let currentClaimId = 'RW-88291';
let isCurrentClaimSpoof = true;

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
            map.invalidateSize(); // Fix leafet rendering issues if any
        }
    }, 150);

    // Apply active styles
    const activeTab = document.getElementById(`tab-${tabId}`);
    activeTab.className = "w-full text-left px-4 py-3 rounded-lg bg-slate-800 text-neonBlue font-medium transition-all hover:bg-slate-700 flex items-center gap-3 shadow-[0_0_10px_rgba(56,189,248,0.2)]";

    if (tabId === 'claim') {
        animateTrustScore();
    }
}

// Open Claim dynamically from the Dashboard Feed
function openClaim(id, isSpoof) {
    currentClaimId = id;
    isCurrentClaimSpoof = isSpoof;

    // Update Header
    document.getElementById('claim-id-display').innerText = `Claim #${id}`;

    const badge = document.getElementById('claim-status-badge');
    if (isSpoof) {
        badge.innerHTML = `<span class="text-slate-400">Status:</span> <span class="text-yellow-400 font-semibold ml-2">Pending Adjudication</span>`;
    } else {
        badge.innerHTML = `<span class="text-slate-400">Status:</span> <span class="text-green-400 font-semibold ml-2">Auto-Verified</span>`;
    }

    // Update Trust Score Visuals
    const targetScore = isSpoof ? 35 : 98;
    document.getElementById('trust-score-text').innerText = `${targetScore}%`;
    const scoreLabel = document.getElementById('trust-score-label');
    const path = document.getElementById('trust-progress');

    if (isSpoof) {
        scoreLabel.className = "text-center text-red-400 text-sm font-medium";
        scoreLabel.innerText = "Critical Threshold Not Met";
        path.className.baseVal = "text-red-500 transition-all duration-1000 ease-out";
    } else {
        scoreLabel.className = "text-center text-green-400 text-sm font-medium";
        scoreLabel.innerText = "High Confidence Verification";
        path.className.baseVal = "text-green-500 transition-all duration-1000 ease-out";
    }

    // Update Spoof Console
    const consoleBadge = document.getElementById('spoof-alert-badge');
    const logList = document.getElementById('spoof-log-list');
    const finalVerdict = document.getElementById('spoof-final-verdict');
    const actionBtn = document.getElementById('spoof-action-btn');

    if (isSpoof) {
        consoleBadge.className = "bg-red-500/20 text-red-500 text-xs px-2 py-1 rounded font-bold border border-red-500/50";
        consoleBadge.innerText = "ALERT";
        logList.innerHTML = `
            <li class="flex items-start gap-3 bg-red-500/10 p-3 rounded border border-red-500/20">
                <svg class="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <div>
                    <p class="text-sm font-semibold text-red-400">Synthetic Movement Detected</p>
                    <p class="text-xs text-slate-400 mt-1">IMU patterns are anomalously flat. Potential device on desk.</p>
                </div>
            </li>
            <li class="flex items-start gap-3 bg-green-500/5 p-3 rounded border border-green-500/20">
                <svg class="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <div>
                    <p class="text-sm font-semibold text-green-400">Network Match</p>
                    <p class="text-xs text-slate-400 mt-1">Cellular Tower ID matches reported GPS vicinity.</p>
                </div>
            </li>
            <li class="flex items-start gap-3 bg-yellow-500/5 p-3 rounded border border-yellow-500/20">
                <svg class="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <div>
                    <p class="text-sm font-semibold text-yellow-400">Visual Mismatch</p>
                    <p class="text-xs text-slate-400 mt-1">Submitted image metadata suggests origin outside time window.</p>
                </div>
            </li>`;
        finalVerdict.innerHTML = `<span class="bg-red-500 px-4 py-2 rounded font-bold tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-400">SPOOF DETECTED</span>`;
        actionBtn.innerHTML = `
            <button class="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded border border-slate-600 transition-colors">
                Deny Payout
            </button>`;
    } else {
        consoleBadge.className = "bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded font-bold border border-green-500/50";
        consoleBadge.innerText = "PASSED";
        logList.innerHTML = `
            <li class="flex items-start gap-3 bg-green-500/5 p-3 rounded border border-green-500/20">
                <svg class="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <div>
                    <p class="text-sm font-semibold text-green-400">Organic Movement</p>
                    <p class="text-xs text-slate-400 mt-1">IMU shows expected chaotic vibration matching bad weather conditions.</p>
                </div>
            </li>
            <li class="flex items-start gap-3 bg-green-500/5 p-3 rounded border border-green-500/20">
                <svg class="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <div>
                    <p class="text-sm font-semibold text-green-400">Visual Verification Confirmed</p>
                    <p class="text-xs text-slate-400 mt-1">YOLOv8 detected elements match environmental weather API.</p>
                </div>
            </li>`;
        finalVerdict.innerHTML = `<span class="bg-green-500/20 px-4 py-2 text-green-400 rounded font-bold tracking-wider shadow-[0_0_15px_rgba(34,197,94,0.1)] border border-green-500/30">CLAIM VERIFIED</span>`;
        actionBtn.innerHTML = `
            <button class="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-2 rounded border border-green-400 transition-colors">
                Execute Payout
            </button>`;
    }

    updateChart(isSpoof);
    switchTab('claim');
}

// --------------------------------------------------------
// 1. Dashboard: Leaflet Map Setup
// --------------------------------------------------------
const map = L.map('map', {
    zoomControl: false,
}).setView([12.9716, 77.5946], 13); // Centered on Bengaluru

L.control.zoom({
    position: 'bottomright'
}).addTo(map);

// Using OpenStreetMap tiles, with CSS invert to make it dark mode!
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

const clusterIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="bg-red-500/20 p-2 rounded-full animate-pulse-fast"><div class="bg-red-500 w-4 h-4 rounded-full border-2 border-white/50 shadow-[0_0_15px_rgba(239,68,68,1)]"></div></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});

const marker1 = L.marker([12.9716, 77.5946], { icon: clusterIcon }).addTo(map);
const marker2 = L.marker([12.9515, 77.6322], { icon: clusterIcon }).addTo(map);

// Mock Heatmap functionality
let heatmapLayer = L.layerGroup();
const heatPoints = [
    [12.9716, 77.5946, 500],
    [12.9616, 77.5846, 900],
    [12.9515, 77.6322, 600],
    [12.9315, 77.6022, 400],
    [12.9234, 77.5855, 700],
];

heatPoints.forEach(p => {
    L.circle([p[0], p[1]], {
        color: 'transparent',
        fillColor: '#ef4444',
        fillOpacity: 0.2,
        radius: p[2]
    }).addTo(heatmapLayer);

    L.circle([p[0], p[1]], {
        color: 'transparent',
        fillColor: '#f97316',
        fillOpacity: 0.3,
        radius: p[2] * 0.5
    }).addTo(heatmapLayer);
});

heatmapLayer.addTo(map);

function toggleHeatmap() {
    const isChecked = document.getElementById('heatmap-toggle').checked;
    if (isChecked) {
        map.addLayer(heatmapLayer);
        document.querySelector('.dot').classList.add('translate-x-4', 'bg-neonBlue');
    } else {
        map.removeLayer(heatmapLayer);
        document.querySelector('.dot').classList.remove('translate-x-4', 'bg-neonBlue');
        document.querySelector('.dot').classList.add('bg-white');
    }
}

// --------------------------------------------------------
// Dashboard: Real-time Alerts Feed
// --------------------------------------------------------
const feedList = document.getElementById('alerts-feed');

const initialAlerts = [
    { id: 'RW-88291', loc: 'MG Road', type: 'Severe Ground Impact', time: 'Just now', spoof: true, syndicate: true },
    { id: 'RW-11002', loc: 'Koramangala', type: 'Flood Area Encounter', time: '2 mins ago', spoof: false, syndicate: false },
    { id: 'RW-88289', loc: 'Indiranagar', type: 'Vibration Anomaly', time: '5 mins ago', spoof: true, syndicate: false },
    { id: 'RW-11003', loc: 'HSR Layout', type: 'Sudden Braking', time: '11 mins ago', spoof: false, syndicate: false },
    { id: 'RW-88287', loc: 'Whitefield', type: 'Hardware Disconnect', time: '20 mins ago', spoof: true, syndicate: false },
];

function renderAlerts() {
    feedList.innerHTML = initialAlerts.map(alert => `
        <div class="bg-slate-800/80 rounded-lg p-3 border ${alert.spoof ? 'border-red-500/30 hover:border-red-400' : 'border-slate-700 hover:border-green-400'} cursor-pointer transition-colors" onclick="openClaim('${alert.id}', ${alert.spoof})">
            <div class="flex justify-between items-start mb-1">
                <span class="text-xs font-mono ${alert.spoof ? 'text-red-400' : 'text-neonBlue'}">${alert.id}</span>
                <span class="text-[10px] text-slate-500">${alert.time}</span>
            </div>
            <p class="text-sm font-semibold text-white truncate">${alert.type}</p>
            <p class="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                ${alert.loc}
            </p>
            ${alert.syndicate ? '<div class="mt-2 text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded uppercase font-bold inline-block border border-purple-500/30 animate-pulse">High Correlation Alert: Coordinated Syndicate Pattern</div>' : ''}
            ${!alert.syndicate && alert.spoof ? '<div class="mt-2 text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded uppercase font-bold inline-block border border-red-500/20">Review Required</div>' : ''}
        </div>
    `).join('');
}
renderAlerts();

// --------------------------------------------------------
// 2. Claim Verification: Chart.js Setup
// --------------------------------------------------------
const ctx = document.getElementById('imuChart').getContext('2d');

const fakeData = [0.1, 0.12, 0.1, 0.09, 0.11, 0.1, 0.1, 0.08, 0.1, 0.11, 0.1, 0.09, 0.09, 0.1, 0.12, 0.1, 0.11, 0.1, 0.1, 0.08];
const realData = Array.from({ length: 20 }, () => Math.random() * 4 - 2); // Chaotic valid data

let imuChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: Array.from({ length: 20 }, (_, i) => i),
        datasets: [{
            label: 'Device Vibration (Z-Axis)',
            data: fakeData, // Flat line = SPOOF
            borderColor: '#ef4444',
            borderWidth: 2,
            fill: false,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { display: false, min: -3, max: 3 },
            x: { display: false }
        }
    }
});

function updateChart(isSpoof) {
    if (isSpoof) {
        imuChart.data.datasets[0].data = fakeData;
        imuChart.data.datasets[0].borderColor = '#ef4444'; // Red for fake
    } else {
        // Regenerate random chaotic data for visual effect
        imuChart.data.datasets[0].data = Array.from({ length: 20 }, () => Math.random() * 4 - 2);
        imuChart.data.datasets[0].borderColor = '#22c55e'; // Green for real
    }
    imuChart.update();
}

// Trust Score Animation
function animateTrustScore() {
    const progressPath = document.getElementById('trust-progress');
    const targetScore = isCurrentClaimSpoof ? 35 : 98;

    // SVG Dasharray circumference is 100 for this path
    progressPath.style.strokeDasharray = `100, 100`;
    setTimeout(() => {
        progressPath.style.strokeDasharray = `${targetScore}, 100`;
    }, 100);
}

// --------------------------------------------------------
// 3. PWA Deliver Partner App
// --------------------------------------------------------
function triggerVerification() {
    const normalUI = document.getElementById('mobile-normal');
    const cameraUI = document.getElementById('camera-ui');

    normalUI.classList.add('opacity-0');
    setTimeout(() => {
        cameraUI.classList.remove('opacity-0', 'pointer-events-none');
    }, 300);
}

function closeVerification() {
    const normalUI = document.getElementById('mobile-normal');
    const cameraUI = document.getElementById('camera-ui');

    cameraUI.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => {
        normalUI.classList.remove('opacity-0');
    }, 300);
}

// Initialize tooltips / default states
document.addEventListener('DOMContentLoaded', () => {
    switchTab('dashboard'); // Start on dashboard
});
