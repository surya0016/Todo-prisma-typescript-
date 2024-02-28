import express,{ Application, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {authMiddleware} from "./middleware";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';
import cors from 'cors';
import {number, z} from 'zod';

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
        const token = jwt.sign(`${userId}`, SECRET!);
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
        const token = jwt.sign(`${userId}`, SECRET!);
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
    try {
        //@ts-ignore
        const id = req.id;
        const todo = await prisma.todo.findMany({
            where:{
                userId:id
            }
        })
        res.json({
            todo:todo
        })
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            error:error
        })
    }
    
})

app.post('/api/v1/todo',authMiddleware,async(req:Request, res:Response)=>{
    //@ts-ignore
    const userId = req.id;
    const title = req.body.title;

    const setTodo = async () => {
        try {
            const todo = await prisma.todo.create({
                data:{
                    title,
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

app.get('/api/v1/todo/:id',authMiddleware,async(req:Request, res:Response)=>{
    try {
        //@ts-ignore
        const userId = req.id;
        const id = Number(req.params.id);
        const todo = await prisma.todo.findFirst({
            where:{
                userId,
                id
            }
        })
        console.log(id,userId,todo);
        res.json({
            todo
        })
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            error:error
        })
    }  
})

app.put('/api/v1/updatetodo/:id',async(req:Request, res:Response)=>{
    try {
        const id = Number(req.params.id);
        const title = req.body.title;
        const updateTodo = await prisma.todo.update({
            where:{
                id:id
            },
            data:{
                title,
            }
        })
        console.log(updateTodo);
        res.json({
            message:"Todo updated",
            todo:updateTodo
        })
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            error:error
        })
    }    
})

app.put('/api/v1/marktodo/:id', async (req:Request, res:Response)=>{
    try {
        const todoId = Number(req.params.id);
        const checkDone = await prisma.todo.findFirst({
            where:{
                id:todoId
            }
        });
        const updateDone = await prisma.todo.update({
            where:{
                id:todoId,
            },
            data:{
                done:!checkDone!.done,
            }
        })
    res.json({done:checkDone?.done, todo:updateDone})
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            error:error
        })
    }
})

app.delete('/api/v1/todo/:id',async(req:Request, res:Response)=>{
    try {
        const todoId = Number(req.params.id);
        const deleteTodo = await prisma.todo.delete({
            where:{
                id:todoId
            }
        });
        res.json({
            message:"Todo deleted"
        })
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            error:error
        })
    }
})

app.listen(PORT, ()=>console.log(`Server listening on port ${PORT}`));