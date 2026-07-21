import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: 'Developer', email: '' });
    const[workspaces, setWorkspaces] = useState([]);
    const[isModalOpen,setIsModalOpen]=useState(false);
     const [newWorkspaceName, setNewWorkspaceName] = useState('');
       const [newWorkspaceDesc, setNewWorkspaceDesc] = useState('');


  
    useEffect(() => {
         const fetchUserProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        } 
        try{
            const response = await fetch (`${API_BASE_URL}/api/auth/profile`,{
                method:'GET',
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if(response.ok){
                setUser({username:data.username,email:data.email})
            }else{
                localStorage.removeItem('token');
                navigate('/login');
            }
        }catch (error){
            console.error("Error fetching user profile:", error);
        }
    }; 
    fetchUserProfile()

        } ,[navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };
     const handleCreateWorkspace=async (e)=>{
        e.preventDefault();
        const token= localStorage.getItem('token');
        try{
            const response = await fetch(`${API_BASE_URL}/api/workspace`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`
                },
                body:JSON.stringify({
                       name: newWorkspaceName,
                    description: newWorkspaceDesc
                })
            });
       const data = await response.json();
            if (response.ok) {
                setWorkspaces([data.workspace, ...workspaces]);
                setNewWorkspaceName('');
                setNewWorkspaceDesc('');
                setIsModalOpen(false);
                toast.success("Workspace created successfully!");
            } else {
                toast.error(data.message || "Failed to create workspace");
            }
        } catch (error) {
            console.error("Error creating workspace:", error);
            toast.error("Error connecting to server");
        }
    };
    useEffect(()=>{
        const fetchWorkspace = async()=>{
            const token = localStorage.getItem('token');
            if(!token){
                   navigate('/login');
            return;
        } 
        try{
            const response = await  fetch (`${API_BASE_URL}/api/workspace`,{
                method :'GET',
                    headers:{
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if(response.ok){
                  setWorkspaces(data.workspaces); 

            }
        }
        catch  (error) {
            console.error("Error fetching user profile:", error);

        }
    };
    
          fetchWorkspace(); 
    }, [navigate]);

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-6">
                <div>
                    {/* Header Logo */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-lg">D</div>
                        <span className="text-xl font-extrabold text-blue-500 tracking-wide">DevFlow</span>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="space-y-1.5">
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-slate-800 text-blue-400 font-medium rounded-xl text-sm transition-colors text-left">
                            📁 Workspaces
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:text-slate-200 font-medium rounded-xl text-sm transition-colors text-left">
                            ⚙️ Settings
                        </button>
                    </nav>
                </div>

                {/* Profile & Logout Section at bottom */}
                <div className="border-t border-slate-800 pt-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400">
                            {user.username[0].toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold truncate">{user.username}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="w-full py-2 bg-red-950/40 hover:bg-red-900/40 border border-red-900/30 text-red-400 text-xs font-semibold rounded-lg transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* ================= MAIN CONTENT AREA ================= */}
            <main className="flex-1 p-10 overflow-y-auto">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {user.username}!</h1>
                        <p className="text-sm text-slate-400 mt-1">Here is what's happening on your workspaces today.</p>
                    </div>
                    
                    {/* Create Workspace Button */}
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white font-semibold py-2.5 px-5 rounded-xl shadow-lg shadow-blue-500/20 text-sm"
                    >
                        + New Workspace
                    </button>
              {isModalOpen && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    
                    {/* B. Modal Form Card */}
                    <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
                        
                        <h3 className="text-2xl font-bold text-white mb-2">Create New Workspace</h3>
                        <p className="text-sm text-slate-400 mb-6">Create a shared space for your boards and notes.</p>
                        
                        <form onSubmit={handleCreateWorkspace}>
                            {/* Input: Name */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Workspace Name
                                </label>
                                <input 
                                    type="text"
                                    value={newWorkspaceName}
                                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                                    className="w-full bg-slate-950 text-slate-100 placeholder:text-slate-600 border border-slate-800 rounded-xl px-4 py-2.5 focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="e.g. Marketing Team"
                                    required
                                />
                            </div>
                            {/* Input: Description */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Description (Optional)
                                </label>
                                <textarea 
                                    value={newWorkspaceDesc}
                                    onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                                    className="w-full bg-slate-950 text-slate-100 placeholder:text-slate-600 border border-slate-800 rounded-xl px-4 py-2.5 focus:border-blue-500 focus:outline-none transition-colors h-24 resize-none"
                                    placeholder="What is this workspace about?"
                                />
                            </div>
                            {/* Buttons footer */}
                            <div className="flex gap-3 justify-end">
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setNewWorkspaceName('');
                                        setNewWorkspaceDesc('');
                                    }}
                                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all text-slate-300 text-sm font-medium rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-500/20"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

                </div>

                {/* Grid Layout for Workspaces */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workspaces.length===0?(
                                                <div className="col-span-full py-16 px-6 text-center bg-slate-900/40 rounded-2xl border border-dashed border-slate-800/80">
                            <p className="text-slate-400 text-lg font-medium mb-1">No workspaces found</p>
                            <p className="text-slate-500 text-xs">Create a new workspace to start collaboration</p>
                        </div>

                    ):
                    (workspaces.map(ws => (
                        <div 
                            key={ws._id}
                             onClick={() => navigate(`/workspace/${ws._id}`)} 
                            className="bg-slate-900 border border-slate-800/80 p-6 rounded-2xl hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all group cursor-pointer"
                        >
                            <h3 className="text-lg font-bold group-hover:text-blue-400 transition-colors mb-2">
                                {ws.name}
                            </h3>
                            <p className="text-slate-400 text-xs leading-relaxed mb-6 line-clamp-2">
                                {ws.description || "No description provided"}
                            </p>
                            
                            <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/50 pt-4">
                                <span>📋 {ws.members?.length || 1} members</span>
                                <span className="text-blue-500 font-semibold group-hover:translate-x-1 transition-transform">
                                    Open Workspace →
                                </span>
                            </div>
                        </div>
                    )))}
                </div>
            </main>

            <ToastContainer theme="dark" />
        </div>
    );
};

export default Dashboard;