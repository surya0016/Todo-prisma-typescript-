import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express";
export function authMiddleware(req:Request,res:Response,next:NextFunction){
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(404).json({
                message:"Authorization header not found"
            });
        }else{
        
        const token = authHeader.split(' ')[1];    

        const decoded = jwt.decode(token);
        if(!decoded){
            res.json({
                message:"You are not authenticated"
            })
            return;
        }else{
            //@ts-ignore
            res.setHeader("userId", decoded);
            console.log("Authentication Successfull");
            next();
        }
    }
    } catch (e) {
        console.log(e);
        
    }
    
}
