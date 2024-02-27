import express,{ Application, Request, Response } from "express";
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors());

const PORT:number = parseInt(process.env.PORT as string, 10) || 4000 ; 

app.get('/',async(req:Request, res:Response)=>{
    res.send("Project initialized")
})

app.listen(PORT, ()=>console.log(`Server listening on port ${PORT}`);
)