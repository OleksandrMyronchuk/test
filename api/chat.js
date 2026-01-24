// api/chat.js
const puter = require('puter');

module.exports = async (req, res) => {
    // 1. Allow your Python script to talk to this
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // 2. Get the prompt
    const { prompt, model } = req.body;

    try {
        // --- NO LOGIN, NO TOKENS, JUST LIKE THE DOCS ---
        console.log("Attempting anonymous chat...");

        const response = await puter.ai.chat(prompt, {
            model: model || 'gemini-2.0-flash'
        });

        // 3. Send back the result
        res.status(200).json({ result: response });

    } catch (error) {
        // If this fails, it means Puter has blocked Vercel's IP address
        // because it thinks it's a bot.
        console.error("Puter Error:", error);
        res.status(500).json({ 
            error: error.message,
            hint: "If this says 'Unauthorized' or 'Limit', it is because Vercel servers are not trusted like Browsers."
        });
    }
};