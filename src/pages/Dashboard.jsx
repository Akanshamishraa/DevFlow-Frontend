import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: 'Developer', email: '' });

  
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            // Fake user data for display (later we will fetch it from backend!)
            setUser({ username: 'Akansha', email: 'ak.akanshamishra@gmail.com' });
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Dummy workspaces to show the UI grid
    const dummyWorkspaces = [
        { id: 1, name: "🚀 Personal Portfolio", description: "Tasks and boards for my personal projects and coding roadmap.", cardsCount: 8 },
        { id: 2, name: "🎓 College Capstone", description: "Collaborative workspace for final semester group project.", cardsCount: 12 },
        { id: 3, name: "💡 Startup Idea", description: "Product roadmap, market research, and design drafts.", cardsCount: 4 }
    ];

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
                    <button className="bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white font-semibold py-2.5 px-5 rounded-xl shadow-lg shadow-blue-500/20 text-sm">
                        + New Workspace
                    </button>
                </div>

                {/* Grid Layout for Workspaces */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dummyWorkspaces.map(ws => (
                        <div 
                            key={ws.id}
                            className="bg-slate-900 border border-slate-800/80 p-6 rounded-2xl hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all group cursor-pointer"
                        >
                            <h3 className="text-lg font-bold group-hover:text-blue-400 transition-colors mb-2">
                                {ws.name}
                            </h3>
                            <p className="text-slate-400 text-xs leading-relaxed mb-6 line-clamp-2">
                                {ws.description}
                            </p>
                            
                            <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/50 pt-4">
                                <span>📋 {ws.cardsCount} cards</span>
                                <span className="text-blue-500 font-semibold group-hover:translate-x-1 transition-transform">
                                    Open Workspace →
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

        </div>
    );
};

export default Dashboard;