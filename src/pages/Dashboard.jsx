import react from 'react';
import { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
 const Dashboard=()=>{
    const navigate = useNavigate();
    useEffect(()=>{
        const token =localStorage.getItem('token');
        if(!token){
            navigate('/login');
        }
    },[navigate]
    );
     const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
            <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-lg text-center">
                <h1 className="text-4xl font-extrabold text-blue-500 mb-4">Welcome to DevFlow!</h1>
                <p className="text-slate-400 mb-8">This is your protected workspace dashboard.</p>
                
                <button 
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-500 active:scale-95 transition-all text-white font-medium py-2 px-6 rounded-xl shadow-lg shadow-red-500/20"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};
export default Dashboard;