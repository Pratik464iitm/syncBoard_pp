const express= require("express");
const router=express.Router();

const {registerUser,loginUser}=require("../controllers/authControllers.js");
const protect = require("../middleware/authMiddleware");

router.post("/register",registerUser);

router.post("/login", loginUser);

//after the Authentication Middleware part also the line 5 const protect
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "Protected route accessed successfully",
    user: req.user
  });
});

module.exports=router;