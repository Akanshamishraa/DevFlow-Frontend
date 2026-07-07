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
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
            <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-md">
                <h2 className="text-3xl font-extrabold text-center text-blue-500 mb-2">DevFlow</h2>
                <p className="text-slate-400 text-center text-sm mb-8">Create your account</p>
                <form onSubmit={handlesubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                        <input 
                            type="text"
                            value={username}
                            onChange={(e) => SetUsername(e.target.value)}
                            className="w-full bg-slate-950 text-slate-100 placeholder:text-slate-600 border border-slate-800 rounded-xl px-4 py-2.5 focus:border-blue-500 focus:outline-none transition-colors"
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                            className="w-full bg-slate-950 text-slate-100 placeholder:text-slate-600 border border-slate-800 rounded-xl px-4 py-2.5 focus:border-blue-500 focus:outline-none transition-colors"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                            className="w-full bg-slate-950 text-slate-100 placeholder:text-slate-600 border border-slate-800 rounded-xl px-4 py-2.5 focus:border-blue-500 focus:outline-none transition-colors"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                     <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white font-medium py-2.5 px-4 rounded-xl shadow-lg shadow-blue-500/20"
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