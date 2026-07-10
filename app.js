// Application Controller orchestrating UI and Events
document.addEventListener('DOMContentLoaded', () => {
    const scanBtn = document.getElementById('scan-btn');
    const urlInput = document.getElementById('url-input');
    const resultDisplay = document.getElementById('result-display');
    const riskBadge = document.getElementById('risk-badge');
    const riskScoreText = document.getElementById('risk-score');
    const alertsList = document.getElementById('alerts-list');

    scanBtn.addEventListener('click', () => {
        const urlToScan = urlInput.value;
        if (!urlToScan) return alert('Please enter a URL first!');

        // Run Analysis Engine
        const report = analyzeURL(urlToScan);

        // Update UI Elements
        riskScoreText.textContent = `${report.score} (${report.rating})`;
        
        // Remove old dynamic color classes
        riskBadge.className = 'badge'; 
        riskBadge.classList.add(`risk-${report.rating.toLowerCase()}`);

        // Populate Alerts
        alertsList.innerHTML = '';
        if (report.alerts.length === 0) {
            alertsList.innerHTML = '<li>✅ Clean URL. No obvious phishing indicators detected.</li>';
        } else {
            report.alerts.forEach(alertText => {
                const li = document.createElement('li');
                li.textContent = `⚠️ ${alertText}`;
                alertsList.appendChild(li);
            });
        }

        // Show Results Area
        resultDisplay.classList.remove('hidden');
    });
});
