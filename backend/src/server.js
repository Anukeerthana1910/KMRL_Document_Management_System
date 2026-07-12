const express=require("express");
const cors=require("cors");
require("dotenv").config();

const sequelize=require("./config/database");

const authRoutes=require("./routes/authRoutes");
const userRoutes=require("./routes/userRoutes");


const app=express();


app.use(cors());
app.use(express.json());


app.use("/api/auth",authRoutes);

app.use("/api/user",userRoutes);



sequelize.sync()
.then(()=>{

console.log("Database connected");

app.listen(5000,()=>{

console.log(
"Server running on 5000"
);

});

});