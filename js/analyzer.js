// URL Phishing Analysis Engine
function analyzeURL(urlString) {
    let score = 0;
    let alerts = [];

    // 1. Basic cleaning
    let cleanUrl = urlString.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) {
        cleanUrl = 'http://' + cleanUrl; // Default fallback for parsing
    }

    try {
        const parsedUrl = new URL(cleanUrl);
        const hostname = parsedUrl.hostname;
        const protocol = parsedUrl.protocol;

        // 2. SSL/Protocol Check
        if (protocol === 'http:') {
            score += 30;
            alerts.push("Insecure Protocol: Connection uses HTTP instead of HTTPS.");
        }

        // 3. IP-URL Detection via Regex
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (ipRegex.test(hostname)) {
            score += 40;
            alerts.push("IP-Based URL: Using raw IP addresses instead of a verified domain name.");
        }

        // 4. Typosquatting & Lookalike Characters (Suspicious keywords/dashes)
        const suspiciousKeywords = ['login', 'verify', 'secure', 'bank', 'update', 'signin', 'free'];
        suspiciousKeywords.forEach(keyword => {
            if (hostname.includes(keyword) && !hostname.includes('google') && !hostname.includes('microsoft')) {
                score += 15;
                alerts.push(`Suspicious Keyword: Contains lookalike phishing keyword "${keyword}".`);
            }
        });

        // High count of dashes often indicates typosquatting
        const dashCount = (hostname.match(/-/g) || []).length;
        if (dashCount > 2) {
            score += 20;
            alerts.push("Excessive Hyphens: Domain uses multiple dashes, a common typosquatting tactic.");
        }

    } catch (e) {
        return { score: 100, alerts: ["Invalid URL structure. Cannot safely analyze."], rating: "High" };
    }

    // Cap maximum score at 100
    score = Math.min(score, 100);

    // Determine Risk Tier Rating
    let rating = "Low";
    if (score >= 40 && score < 70) rating = "Med";
    if (score >= 70) rating = "High";

    return { score, alerts, rating };
}
