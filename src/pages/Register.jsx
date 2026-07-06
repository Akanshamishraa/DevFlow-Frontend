import react from "react";
import{useState,useEffect} from "react";
const Register =()=>{
    const [username,SetUsername]=useState('');
    const[email,setemail]=useState('');
    const[password,setpassword]=useState('');
    const handlesubmit = async(e)=>{
        e.preventDefault();
        try{
            
        } catch (error) {
            console.error('Error during registrationm:', error);
        }
    };
    return (
        <div className="min-h-screen bg-slate-900 text-white flex itmens-center justify-centre p-4">
            <div className ="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-indigo-400 mb-2">DevFlow</h2>
                <p className="text-slate-400 text-center text-sm mb-8">create your account</p>
                <form onsubmit={handlesubmit}>
                    <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                    <input 
                    type ="username"
                    value={username}
                    onchange={(e)=>setUsername(e.target.value)}
                    className="w-full bg-slate-900 text-slate-200 placeholder:text-slate-500 border border-slate-700 rounded-xl px-4 py-2.5 focus:border-indigo-500 focus:outline-none transition-colors"
                    placeholder="Enter your username"
                    />
                    </div>
                </form>
            </div> 

        </div>
    )

}
export default Register;