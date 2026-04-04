# RoadWatch: Continuous Earnings Protection (Phase 2)

RoadWatch is a smart, futuristic web application designed as the ultimate Parametric Insurance platform for gig workers and delivery partners. It replaces the traditional manual insurance model with a Zero-Touch, data-driven approach to protect against **Loss of Income** due to external disruptions like extreme weather, severe pollution, and sudden city curfews.

## 🖥️ Platform Workflow & Functionality
1. **Dynamic Weekly Premiums:** Calculates policy costs based on AI predictive weather and zone risk modeling, matching the gig worker's weekly payout cycle.
2. **Oracle Integration:** Continually syncs with external data sources (Weather APIs, AQI monitors, City Admin alerts) to form "Ground Truth".
3. **Parametric Triggers:** Auto-initiates claims exactly when conditions cross strict thresholds (e.g., Rain > 10mm/hr), without human verification.
4. **Zero-Touch Payouts:** Funds are disbursed instantly to all active policyholders in affected zones to supplement lost wages.

## Running the Platform

Since this frontend is built with purely HTML, Tailwind CSS, and Vanilla JavaScript, there's no complex build step required.

1. Open `index.html` in any modern web browser.
2. Navigate between the **"Authority Dash"**, **"Zero-Touch Claims"**, and **"Partner App"** using the left sidebar to explore the platform tools.
3. Observe real-time Parametric Triggers and Loss Ratio visualizations automatically.

## Technologies Used
- HTML5
- Tailwind CSS (via CDN)
- Vanilla JavaScript
- Leaflet Maps (Mapbox GL alternative for dark-mode rendering without an API key)
- Chart.js (for Loss Ratio visualizations)
