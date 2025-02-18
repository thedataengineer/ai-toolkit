const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;
console.log(`Starting server on port ${PORT}...`);

app.get("/", (req, res) => {
    res.send("Server is running!");
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
