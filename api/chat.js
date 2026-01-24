// api/chat.js
export default async function handler(req, res) {
    // 1. Set CORS headers so your local script can call this
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { prompt, model } = req.body;
    const authHeader = req.headers.authorization; // Bearer YOUR_PUTER_TOKEN

    if (!authHeader) return res.status(401).json({ error: "Missing Token" });
    const token = authHeader.replace('Bearer ', '');

    try {
        // We use standard fetch to call Puter's internal API relay
        // or we could use the @heyputer/puter-js npm package.
        // For simplicity in a single file, we call Puter's AI endpoint:
        const response = await fetch('https://api.puter.com/v2/ai/chat', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [{ role: 'user', content: prompt }],
                model: model || 'gemini-2.0-flash-lite'
            })
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}