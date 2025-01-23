require('dotenv').config();
const PORT = process.env.PORT || 5000;
const express = require("express");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/DBconnect");
const authRoutes = require("./routes/authRoutes");
const testsRoutes = require('./routes/tests');

const app = express();

connectDB();
// Middleware
app.use(express.json());
app.use(cors(corsOptions));

app.use("/auth", authRoutes);
app.use("/tests", testsRoutes);

// Start the Server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
