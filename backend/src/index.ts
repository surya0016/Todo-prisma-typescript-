import express,{ Application, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {authMiddleware} from "./middleware";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';
import cors from 'cors';
import {z} from 'zod';
import { decode, sign } from "jsonwebtoken";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors());

const PORT:number = parseInt(process.env.PORT as string, 10) || 4000 ; 
const SECRET = process.env.SECRET; 

const prisma = new PrismaClient();

const createUser = async (req:Request, res:Response) => {
    try {

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);

        const user = await prisma.user.create({
            data:{
                username:req.body.username,
                password:hash,
                email:req.body.email,
            }
        })
        
        const userId = user.id;
        //@ts-ignore
        const token = jwt.sign(userId, SECRET);
        // localStorage.setItem("token", token);
        console.log(user);
        res.json({
            message:"User Created Successfully",
            success:true,
            token:token,
            user:user
        })
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            error:error
        })
    }
}

app.post('/api/v1/signup',async(req:Request, res:Response)=>{


    const signupSchema = z.object({
        username:z.string().min(3),
        password:z.string().max(16),
        conPassword:z.string().max(16),
        email:z.string().email()
    }).superRefine(({conPassword, password},ctx)=>{
        if(conPassword !== password){
            ctx.addIssue({
                code:"custom",
                message:"The password must match"
            })
        }
    })

    const response = signupSchema.safeParse(req.body);

    if(!response.success){
        res.json({
            message:"Invalid Input",
            response:response
        })
        return;
    }

    const userExists = await prisma.user.findFirst({
        where:{
            email:req.body.email
        }
    })

    if(userExists){
        res.json({
            message:"User with this email already exists",
            response:response
        })
        return;
    }
    createUser(req,res);
})

app.post('/api/v1/signin',async(req:Request, res:Response)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;

        const signinSchema = z.object({
            email:z.string().email(),
            password:z.string().max(16)
        })

        const response = signinSchema.safeParse(req.body);

        if(!response.success){
            res.json({
                message:"Invalid Input",
                response:response
            })
            return;
        }

        const user = await prisma.user.findFirst({
            where:{
                email
            }
        })

        if(!user){
            res.json({
                message:"Email doesn't exists"
            })
            return;
        }

        const isMatch = await bcrypt.compare(password, user!.password);

        if(!isMatch){
            res.json({
                message:"Invalid Password"
            })
            return;
        }

        const userId = user!.id;
        //@ts-ignore
        const token = jwt.sign(userId, SECRET);
        // req.headers.authorization = token
        // localStorage.setItem("token", token);
        res.json({
            message:"Signin Successfull",
            success:true,
            token:token
    })
    } catch (e) {
        console.log(e);
        res.json({
            message:"Error",
            error:e
        })
    }
    
})



app.get('/api/v1/todo',authMiddleware, async(req:Request, res:Response)=>{
    const id = Number(res.getHeader("userId"));
    const todo = await prisma.todo.findMany({
        where:{
            userId:id
        }
    })
    res.json({
        todo:todo
    })
})

app.post('/api/v1/todo',authMiddleware,async(req:Request, res:Response)=>{
    const userId = Number(res.getHeader("userId"));
    const title = req.body.title;
    const description = req.body.description;

    const setTodo = async () => {
        try {
            const todo = await prisma.todo.create({
                data:{
                    title,
                    description,
                    userId,
                }
            })
            console.log(todo);
            res.json({
                message:"Todo created",
                todo:todo
            })
        } catch (error) {
            console.log(error);
            res.json({message:error})
        }
        
    }
    setTodo();
})

app.get('/api/v1/todo/:id',async(req:Request, res:Response)=>{

})

app.put('/api/v1/todo/:id',async(req:Request, res:Response)=>{

})

app.delete('/api/v1/todo/:id',async(req:Request, res:Response)=>{

})

app.listen(PORT, ()=>console.log(`Server listening on port ${PORT}`));