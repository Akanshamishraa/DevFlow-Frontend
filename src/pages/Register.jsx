import react from "react";
import{useState,useEffect} from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
const Register =()=>{
    const [username,SetUsername]=useState('');
    const[email,setemail]=useState('');
    const[password,setpassword]=useState('');
    const handlesubmit = async(e)=>{
        e.preventDefault();
        try{
            const response = await fetch("http://localhost:5000/api/auth/register",{
                method:'POST',
                headers:{
                    "content-Type":"application/json",
                },
                body:JSON.stringify({ username, email, password }),
                
            });
            const data = await response.json();
            if(response.ok){
                console.log("registration is successfull:", data);
            
            toast.success("registration is successfull");
            }else{
                console.error('Error during registration:', data.message);
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error during registration:', error);
            toast.error("Error during registration");
        }
    };
    return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
            <div className ="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-indigo-400 mb-2">DevFlow</h2>
                <p className="text-slate-400 text-center text-sm mb-8">create your account</p>
                <form onSubmit={handlesubmit}>
                    <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                    <input 
                    type ="username"
                    value={username}
                    onChange={(e)=>SetUsername(e.target.value)}
                    className="w-full bg-slate-900 text-slate-200 placeholder:text-slate-500 border border-slate-700 rounded-xl px-4 py-2.5 focus:border-indigo-500 focus:outline-none transition-colors"
                    placeholder="Enter your username"
                    />
                    </div>
                    <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                    <input 
                    type ="email"
                    value={email}
                    onChange={(e)=>setemail(e.target.value)}
                    className="w-full bg-slate-900 text-slate-200 placeholder:text-slate-500 border border-slate-700 rounded-xl px-4 py-2.5 focus:border-indigo-500 focus:outline-none transition-colors"
                    placeholder="Enter your email"
                    />
                    </div>
                    <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                    <input 
                    type ="password"
                    value={password}
                    onChange={(e)=>setpassword(e.target.value)}
                    className="w-full bg-slate-900 text-slate-200 placeholder:text-slate-500 border border-slate-700 rounded-xl px-4 py-2.5 focus:border-indigo-500 focus:outline-none transition-colors"
                    placeholder="Enter your password"
                    />
                    </div>
                     <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white font-medium py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-500/20"
                    >
                        Sign Up
                    </button>
                </form>
            </div> 
              <ToastContainer theme="dark" /> 

        </div>
    )

}
export default Register;