import axios from 'axios';
import React, { ReactNode, useContext, useEffect, useState } from 'react'
import Modal from '../components/Modal';
import { Context, useMyContext } from '../context/Context';

function Todo() {
    const [done, setDone] = useState<boolean>(false)
    const [todo, setTodo] = useState<string>();
    const [todos, setTodos] = useState ([]);
    const [modal, setModal] = useState<boolean>(false);
    const [id,setId]=useState<number>();
    const { value, updateValue } = useMyContext();

    async function getData() {
        const response = await axios({
            url:"http://localhost:4000/api/v1/todo",
            method:"GET",
            headers:{
                'Authorization' : `Bearer ${localStorage.getItem("token")}`,
                'Content-Type':'application/json'
            }
        });
        setTodos(response.data.todo);
        console.log(response.data.todo, " From getData");
    }

    async function markDone(id:number){
        const response = await axios({
            url:"http://localhost:4000/api/v1/marktodo/"+id,
            method:"PUT",
            headers:{
                'Authorization' : `Bearer ${localStorage.getItem("token")}`,
                'Content-Type':'application/json'
            }
        });
        return response.data.done;
    }
    
    
    async function sendTodo(e:any){
        e.preventDefault();
        const response = await axios({
            url:"http://localhost:4000/api/v1/todo",
            method:"POST",
            data:{
                title:todo,
            },
            headers:{
                'Authorization' : `Bearer ${localStorage.getItem("token")}`,
                'Content-Type':'application/json'
            }
        });
        console.log(response);
        updateValue(Math.random());
    }

    async function deleteTodo(id:number){
        const response = await axios({
            url:"http://localhost:4000/api/v1/todo/"+id,
            method:"DELETE",
            headers:{
                "Authorization":`Bearere ${localStorage.getItem("token")}`,
                "Content-Type":"application/json"
            }
        })
        console.log(response.data);
        updateValue(Math.random());
    }

    useEffect(()=>{
        getData();
        console.log(todos,"from useeffect");
    },[value])
  return (
    <div className='flex justify-center items-center flex-col h-screen '>
        <div></div>
        <div className='font-bold text-4xl m-4 text-slate-700 '>TODO LIST</div>
        <div className='shadow-lg'>
        <div>
            <form>
                <div className="border rounded-t-md p-4 w-full bg-slate-100 ">
                <input type="text" onChange={(e)=>{setTodo(e.target.value)}} placeholder='Add Todo...' className='outline-none border hover:border-slate-900 w-96 rounded-md py-2 px-3 '/>
                <button onClick={(e)=>sendTodo(e)} className='px-4 py-2 bg-slate-900 text-white rounded-md font-semibold ml-3 border hover:bg-slate-800'>Add Task</button>
                </div>
            </form>
        </div>
        {todos.map((todo:any, index:number):any=>{
            return(
                <div key={index} className='border  w-full px-4 py-3 bg-slate-100 '>
                    <div className='flex justify-between'>
                        <span className='flex justify-center items-center'>
                            {/* @ts-ignore */}
                            <input type="checkbox" onChange={()=>{markDone(todo.id); setDone(!done)}} className='bg-slate-500 text-slate-900  rounded-full p-2.5 cursor-pointer'/>
                            <span className='text-xl px-3 font-semibold w-full cursor-default'>{todo.title}</span>
                        </span>
                        <span>
                            <button onClick={()=>{setModal(!modal); setId(todo.id)}}><i className="fa-solid fa-pen border mr-3  p-2 rounded-md bg-slate-50 shadow-sm hover:bg-slate-200 hover:border-slate-900"></i></button>
                            <button onClick={()=>{deleteTodo(todo.id)}}><i className="fa-solid fa-trash p-2 border rounded-md bg-slate-50 shadow-sm hover:bg-slate-200 hover:border-slate-900"></i></button>
                        </span>
                    </div>  
                    {modal && <Modal id={id} onclose={()=>setModal(!modal)}/>}
                </div>
                
                
            )
        })}
        </div>
        
    </div>
  )
}

export default Todo