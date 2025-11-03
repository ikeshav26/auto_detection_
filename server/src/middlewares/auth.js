import jwt, { decode } from 'jsonwebtoken'


export const auth=async(req,res,next)=>{
    try{
        const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    req.userId=decoded.id;
    req.role=decoded.role;
    next();
    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}