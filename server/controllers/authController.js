const validator = require("validator");
const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()




const SignUp = async (req,res)=>{

    try{
            const { name , email , password} = req.body

            if(!name || !email || !password)
            {
                return res.status(400).json({ message: "All fields are required" });

            }

            if(!validator.isEmail(email))
            {
                return res.status(400).json({ message: "Invalid email format" });
            }

                    if (
            !validator.isStrongPassword(password, {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
        ) {
            return res.status(400).json({
                message: "Password must contain eight characters ,uppercase, lowercase, number, and symbol",
            });
        }

            const result = await userModel.getUserByEmail(email);

            if(result)
            {

                 return res.status(400).json({ message: "Email already exists" });

            }
          
            const saltRounds = 10;

           const hashedPassword =  await bcrypt.hash(password,saltRounds)

           const user = await userModel.createUser(name,email,hashedPassword)


           
           
           return res.status(201).json({
            
            message : "signup successfull",
            


           })







    }
    catch(error){
        console.error(error.message);
        res.status(500).json({
            message : "Internal Server Error"
        })
    }




}




const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const user = await userModel.getUserByEmail(email);

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        if (user.is_blocked) {
            return res.status(403).json({
                message: "Blocked by admin"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userid: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};






const logout = async (req, res) => {
    try {

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};





module.exports= {SignUp,Login,logout}