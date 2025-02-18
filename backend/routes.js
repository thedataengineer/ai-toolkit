const express = require("express");
const router = express.Router();
const axios = require("axios");

// Stand-Up Report Generation Route
router.post("/generate-standup", async (req, res) => {
    try {
        const { role, client, project, task_updates } = req.body;
        if (!task_updates) return res.status(400).json({ error: "Task updates required" });

        const aiResponse = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-4",
            messages: [
                { role: "system", content: `You are generating a professional stand-up report for a ${role} at Accion working on the ${project} project for ${client}.` },
                { role: "user", content: task_updates }
            ]
        }, { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } });

        res.json({ report: aiResponse.data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: "Failed to generate stand-up report" });
    }
});

// Export the router
module.exports = router;
