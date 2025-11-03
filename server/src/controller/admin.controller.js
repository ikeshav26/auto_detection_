import User from "../models/user.model.js";
import bcrypt from "bcryptjs";



export const userRegisterbyAdmin = async (req, res) => {
  try {
    const role = req.role;
    if (role != "admin") {
      return res.status(400).json({ message: "You are not allowed to this" });
    }

    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "staff",
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully by admin", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const terminateUser=async(req,res)=>{
    try{
        const role=req.role;
        if(role!="admin"){
            return res.status(400).json({message:"You are not allowed to this"});
        }
        const {userId}=req.params;
        const user=await User.findById(userId)
        if(user.role=="admin"){
            return res.status(400).json({message:"Cannot terminate another admin"});
        }
        const deletedUser=await User.findByIdAndDelete(userId);
        if(!deletedUser){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json({message:"Staff terminated successfully"});
    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}