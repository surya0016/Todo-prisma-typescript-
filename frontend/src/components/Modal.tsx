import axios from 'axios';
import {useState, useRef, useEffect} from 'react'
import { useMyContext } from '../context/Context';


function Modal(props:any) {
    const [todo, setTodo] = useState("");
    const { updateValue} = useMyContext();

    const inref = useRef(null);
    async function editTodo(e:any){
        e.preventDefault();
        const response = await axios({
            url:"http://localhost:4000/api/v1/updatetodo/"+props.id,
            method:"PUT",
            headers:{
                'Authorization' : `Bearer ${localStorage.getItem("token")}`,
                'Content-Type':'application/json'
            },
            data:{
                title:todo,
            }
        })

        console.log(response.data);
        props.onclose();
        updateValue(Math.random())
    }
    async function getTodo(){
        const response = await axios({
            url:"http://localhost:4000/api/v1/todo/"+props.id,
            method:"GET",
            headers:{
                'Authorization' : `Bearer ${localStorage.getItem("token")}`,
                'Content-Type':'application/json'
            }
        });
        setTodo(response.data.todo.title);
    }
    const close = (e:any) => {
        if(inref.current === e.target){
            props.onclose();
        }
    }
    
    useEffect(()=>{
        getTodo();
    },[])
    
  return (
    <div ref={inref} onClick={(e)=>close(e)} className="fixed inset-0 backdrop-blur bg-opacity-30 bg-black flex justify-center items-center h-screen ">
        <div className="p-3 pt-0 bg-slate-100 rounded-md">
            <div className='flex justify-between p-2 font-bold'>
                <span className='text-lg'>Edit Todo</span>
                <span  onClick={()=>props.onclose()}><i className="fa-solid fa-xmark cursor-pointer rounded-full p-1 px-1.5 hover:bg-slate-300"></i></span>
            </div>
            <form>
                <input type="text" onChange={(e)=>{setTodo(e.target.value)}} value={todo} className='rounded-md py-1.5 w-80 outline-none border hover:border-slate-900 px-2'/>
                <button onClick={(e)=>editTodo(e)} className='px-4 py-1.5 ml-3 bg-slate-900 text-white font-semibold rounded-md'>Edit</button>
            </form>
        </div>
    </div>
  )
}

export default Modal;