import react from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.js';
import 'react-toastify/dist/ReactToastify.css';
const Login = () => {
    const navigate = useNavigate();
    const [email, Setemail] = useState('');
    const [password, Setpassword] = useState('');
    const handlesubmit = async(e) => {
        e.preventDefault();
        try{
           const response = await fetch (`${API_BASE_URL}/api/auth/login`,{
            method:'POST',
            headers:{
                'Content-Type':"application/json",
            },
            body:JSON.stringify({email,password}) ,
        
        });
        const data =await response.json();
        if(response.ok){
            console.log("login successful:", data);
            localStorage.setItem('token', data.token);
            toast.success("Login successful!");
               navigate('/dashboard'); 
        }else{
            toast.error(data.message || "Login failed");
        }
     } catch(error){
            console.error("Error during login:", error);
        }
        };
    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
            {/* 2. Main Login Card Body */}
            <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-md">
                <h2 className="text-3xl font-extrabold text-center text-blue-500 mb-2">DevFlow</h2>
                <p className="text-slate-400 text-center text-sm mb-8">Sign in to continue your workspace</p>
                <form onSubmit={handlesubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => Setemail(e.target.value)}
                           className="w-full bg-slate-950 text-slate-100 placeholder:text-slate-600 border border-slate-800 rounded-xl px-4 py-2.5 focus:border-blue-500 focus:outline-none transition-colors"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => Setpassword(e.target.value)}
                           className="w-full bg-slate-950 text-slate-100 placeholder:text-slate-600 border border-slate-800 rounded-xl px-4 py-2.5 focus:border-blue-500 focus:outline-none transition-colors"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white font-medium py-2.5 px-4 rounded-xl mt-4 shadow-lg shadow-blue-500/20"
                    >
                        Sign In
                    </button>
                </form>
                
                <p className="text-slate-400 text-center text-sm mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-500 hover:underline font-medium">
                        Sign Up
                    </Link>
                </p>
            </div>
            <ToastContainer theme="dark" />
        </div>


    );


}
export default Login;