const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.get("/", (req, res) => {
    res.send("Server is running!");
});

app.post("/generate-standup", async (req, res) => {
    try {
        const { role, clientName, projectName, taskUpdates } = req.body;
        if (!taskUpdates) {
            return res.status(400).json({ error: "Task updates required" });
        }

        // Build a context prompt that includes role, client, and project
        const prompt = `
      You work for Accion as a ${role}.
      You're currently working on the project "${projectName}" for client "${clientName}".
      Summarize these tasks into a concise stand-up report:
      ${taskUpdates}
    `;

        const aiResponse = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4",
                messages: [
                    { role: "system", content: "You are a helpful assistant that creates concise stand-up reports." },
                    { role: "user", content: prompt }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
                }
            }
        );

        // Return the AI-generated content
        res.json({ report: aiResponse.data.choices[0].message.content });
    } catch (error) {
        console.error("Error generating stand-up report:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to generate stand-up report" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
