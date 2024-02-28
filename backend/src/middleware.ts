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
        const SECRET = process.env.SECRET;
        const decoded = jwt.verify(token, SECRET!);
        if(!decoded){
            res.json({
                message:"You are not authenticated"
            })
            return;
        }else{
            //@ts-ignore
            req.id = Number(decoded);
            console.log("Authentication Successfull",decoded);
            next();
        }
    }
    } catch (e) {
        console.log(e);
        
    }
    
}
