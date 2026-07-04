import react from 'react';
import { useState, useEffect } from 'react';
const Login = () => {
    const [email, Setemail] = useState('');
    const [password, Setpassword] = useState('');
    const handlesubmit = async(e) => {
        e.preventDefault();
        try{
           const response = await fetch ('http://localhost:5000/api/auth/login',{
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
         alert("login succesfull");
        }else{
            alert(data.message|| "login failed");

        }
     } catch(error){
            console.error("Error during login:", error);
        }
        };
    return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
            {/* 2. Main Login Card Body */}
            <div className="bg-slate-800 p-8  rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-indigo-400 mb-2">DevFlow</h2>
                <p className="text-slate-400 text-center text-sm mb-8">sign in to continue your workspace</p>
                <form onSubmit={handlesubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => Setemail(e.target.value)}
                           className="w-full bg-slate-900 text-slate-200 placeholder:text-slate-500 border border-slate-700 rounded-xl px-4 py-2.5 focus:border-indigo-500 focus:outline-none transition-colors"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => Setpassword(e.target.value)}
                           className="w-full bg-slate-900 text-slate-200 placeholder:text-slate-500 border border-slate-700 rounded-xl px-4 py-2.5 focus:border-indigo-500 focus:outline-none transition-colors"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all text-white font-medium py-2.5 px-4 rounded-xl mt-4 shadow-lg shadow-indigo-500/20"
                    >
                        Sign In
                    </button>
                </form>

            </div>
        </div>

    );


}
export default Login;