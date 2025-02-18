const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const { PrismaClient } = require("@prisma/client"); // Prisma for DB
const nodemailer = require("nodemailer"); // For emails

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();

const PORT = process.env.PORT || 5001;

app.get("/", (req, res) => {
    res.send("Server is running!");
});

// 🔹 Middleware to check if user is authenticated (Optional)
const authenticateUser = async (req, res, next) => {
    const user = req.body.user;
    if (!user) {
        return res.status(401).json({ error: "Unauthorized: User not logged in" });
    }
    next();
};

// 🔹 Generate AI-Powered Stand-Up Report and Store in DB
app.post("/generate-standup", authenticateUser, async (req, res) => {
    try {
        const { task_updates, user, client, project } = req.body;
        if (!task_updates) return res.status(400).json({ error: "Task updates required" });

        const aiResponse = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-4",
            messages: [
                { role: "system", content: `Summarize these tasks into a concise stand-up report for ${user.name} at ${client}, working on ${project}.` },
                { role: "user", content: task_updates }
            ]
        }, { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } });

        const reportContent = aiResponse.data.choices[0].message.content;

        // 🔹 Store report in database
        const report = await prisma.standupReport.create({
            data: {
                userEmail: user.email,
                userName: user.name,
                client,
                project,
                taskUpdates: task_updates,
                report: reportContent
            }
        });

        res.json({ report: reportContent });
    } catch (error) {
        console.error("Error generating stand-up:", error);
        res.status(500).json({ error: "Failed to generate stand-up report" });
    }
});

// 🔹 Fetch Past Reports
app.get("/past-reports", authenticateUser, async (req, res) => {
    try {
        const { user } = req.body;
        const reports = await prisma.standupReport.findMany({
            where: { userEmail: user.email },
            orderBy: { createdAt: "desc" }
        });

        res.json({ reports });
    } catch (error) {
        console.error("Error fetching past reports:", error);
        res.status(500).json({ error: "Failed to fetch past reports" });
    }
});

// 🔹 Send Report via Email
app.post("/send-email", authenticateUser, async (req, res) => {
    try {
        const { user, reportContent } = req.body;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Your Daily Stand-Up Report",
            text: `Hello ${user.name},\n\nHere is your stand-up report:\n\n${reportContent}\n\nBest,\nAI Toolkit`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "Email sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
