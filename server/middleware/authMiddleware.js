const jwt = require('jsonwebtoken')
require('dotenv').config()


const protect = async (req,res,next)=>{

    try{

        const authHeader = req.headers.authorization

        if(!authHeader || !authHeader.startsWith("Bearer"))
        {

            return res.status(401).json({
                message : "no token found"
            })
        }

        const token = authHeader.split(" ")[1]


        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        

        

        const user = await userModel.getuserbyid(decoded.userid)

        if(!user)
        {

            return res.status(401).json({
                message : "user doesnt exists"

            })
            
        }

            if (user.is_blocked) {
            return res.status(403).json({
                message: "Blocked by admin",
            });
        }

        req.user = user; // Attach the user object to the request for further use

        next();



    }
    catch(error){

         console.error(error.message);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
         console.log("error in middleware")
    }















}

module.exports= protect