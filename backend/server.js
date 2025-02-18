const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// ✅ Allow CORS for Vercel frontend
const corsOptions = {
    origin: process.env.FRONTEND_URL || "*", // Allow Vercel domain
    methods: "GET,POST,PUT,DELETE",
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 5001;
console.log(`Starting server on port ${PORT}...`);

app.get("/", (req, res) => {
    res.send("Server is running!");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
