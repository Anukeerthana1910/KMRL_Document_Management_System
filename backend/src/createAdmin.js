const bcrypt = require("bcrypt");
const User = require("./models/User");

async function createAdmin(){

    const hashedPassword = await bcrypt.hash("12345678",10);

    await User.create({
        name:"Administrator",
        email:"admin@kmrl.com",
        password:hashedPassword,
        role:"ADMIN"
    });

    console.log("Admin created");
    process.exit();
}

createAdmin();