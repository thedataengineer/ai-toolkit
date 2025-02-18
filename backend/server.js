const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios"); // For API call

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.get("/", (req, res) => {
    res.send("Server is running!");
});

// New AI-powered stand-up report API
app.post("/generate-standup", async (req, res) => {
    try {
        const { task_updates } = req.body;
        if (!task_updates) return res.status(400).json({ error: "Task updates required" });

        const aiResponse = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-4",
            messages: [{ role: "system", content: "Summarize these tasks into a concise stand-up report" },
            { role: "user", content: task_updates }]
        }, { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } });

        res.json({ report: aiResponse.data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: "Failed to generate stand-up report" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
