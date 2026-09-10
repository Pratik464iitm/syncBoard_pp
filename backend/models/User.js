const mongoose=require("mongoose");

// 1. Define structure
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
});

// 2. Create Model
const User = mongoose.model("User", userSchema);

// 3. Export Model
module.exports = User;