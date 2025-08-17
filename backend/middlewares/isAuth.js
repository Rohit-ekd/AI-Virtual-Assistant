import jwt from "jsonwebtoken";

const isAuth = (req, res, next)=>{
    try{
        const token = req.cookies.token
        if(!token){
            return res.status(401).json({message: "Unauthorized access"});
        }
        const verifiedToken =  jwt.verify(token,process.env.JWT_SECRET)
        req.userId = verifiedToken.id;
        next();
        console.log("✅ User authenticated:", req.userId);
    }
    catch(err){
        console.error(err);
        return res.status(500).json({message: "Is Auth Error"});
    }
}

export default isAuth;