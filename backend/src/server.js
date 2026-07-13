const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/database");


// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const documentRoutes = require("./routes/documentRoutes");
const managerRoutes = require("./routes/managerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const auditRoutes = require("./routes/auditRoutes");


const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Test MySQL Connection
sequelize.authenticate()
.then(() => {
    console.log("MySQL Database Connected");
})
.catch((error) => {
    console.log("Database Connection Failed:", error);
});


// Sync Models
sequelize.sync()
.then(() => {
    console.log("Database Tables Created");
})
.catch((error)=>{
    console.log("Table Sync Error:",error);
});

// API Routes

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/documents", documentRoutes);

app.use("/api/manager", managerRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/audit", auditRoutes);



// Default Route

app.get("/",(req,res)=>{

    res.send("KMRL Document Management System API Running");

});



// Start Server

const PORT = process.env.PORT || 5000;


app.listen(PORT,()=>{

console.log(`Server running on port ${PORT}`);

});