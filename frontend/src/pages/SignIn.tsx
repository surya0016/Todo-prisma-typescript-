import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignIn() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function sendData(e:any) {
        e.preventDefault();
        const response = await axios({
            url:"http://localhost:4000/api/v1/signup",
            method:"POST",
            data:{
                email:email,
                password:password,
            }
        })
        localStorage.setItem("token", response.data.token)
        console.log(response.data);
    }
  return (
    <div>
        <div className="flex justify-center items-center h-screen ">
        <div className='border p-6 rounded-md shadow-lg bg-slate-100'> 
            <div className='text-3xl text-center font-bold mb-4'>Sign In</div>
            <form>
                <div className="text-xl font-semibold ">Email</div>
                <input type="email" onChange={(e)=>setEmail(e.target.value)} className='rounded-md py-1.5 w-80 outline-none border hover:border-slate-900 px-2 mb-3'/>

                <div className="text-xl font-semibold ">Password</div>
                <input type="password" onChange={(e)=>setPassword(e.target.value)} className='rounded-md py-1.5 w-80 outline-none border hover:border-slate-900 px-2 '/>
                <div className='mb-3 text-blue-900 font-semibold cursor-pointer'>Forgot Password ?</div>

                <div className="">
                    <button onClick={(e)=>sendData(e)} className='px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-lg text-white rounded-md w-full my-1'>Sign In</button>
                </div>
                <div className='text-center text-lg'>Don't have an account? <span  onClick={()=>navigate('/signup')} className='hover:cursor-pointer decoration hover:underline text-blue-900 font-semibold'>Sign Up</span></div>
            </form>            
        </div>
    </div>
    </div>
  )
}

export default SignIn