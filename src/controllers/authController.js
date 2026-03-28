const userModel=require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt=require("bcryptjs")
async function registerUser(req,res){
    const {username,email,password,role="user"}=req.body;
    const isUserAlreadyExists=await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    if(isUserAlreadyExists){
        return res.status(409).json({message:"User Already Exists"})
    }
    const hash=await bcrypt.hash(password,10)
    const user=await userModel.create({
        username,
        email,
        password:hash,
        role
    })
    const token=jwt.sign({
        id:user._id,
        role:user.role,
    },process.env.JWT_SECRET)
    res.cookie("token",token)
    res.status(201).json({
        message:"User Registered Successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            role:user.role,
        }
    })
}
async function loginUser(req, res) {
    const { username, email, password } = req.body;

    const user = await userModel.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) {
        return res.status(401).json({ message: "Invalid Credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
        {
            id: user._id,
            role: user.role,
        },
        process.env.JWT_SECRET
    );
    res.cookie("token", token, {
        httpOnly: true,
        secure: false, // true in production (HTTPS)
        sameSite: "lax", // important for local dev
    });

    res.status(200).json({
        message: "User Logged in Successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    });
}
async function logoutUser(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: false, // true in production
    });

    res.status(200).json({
        message: "Logged out successfully"
    });
}
async function checkAuth(req, res) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        res.status(200).json(user);

    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}
module.exports={registerUser,loginUser,logoutUser,checkAuth}