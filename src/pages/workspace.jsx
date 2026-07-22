import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.js';

const Workspace = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [workspace, setWorkspace] = useState(null); 
    const [loading, setLoading] = useState(true); 
    const [boards, setBoards] = useState([]); 
    const [documents, setDocuments] = useState([]);
    const [activeBoard, setActiveBoard] = useState(null); // Currently selected board to display
    const [activeDoc, setActiveDoc] = useState(null); // Currently selected doc to display
    const [columns, setColumns] = useState([]); // List of columns for the active board

    useEffect(() => {
        const fetchWorkspaceDetails = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/workspace/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setWorkspace(data.workspace); 
                    const boardsResponse =await fetch(`${API_BASE_URL}/api/board/workspace/${id}`,{
                        method:'GET',
                        headers:{
                            "Authorization":`Bearer ${token}`
                        }
                    });
                    const boardData = await boardsResponse.json();
                    if(boardsResponse.ok){
                        setBoards(boardData.boards);
                    }else{
                       
                    navigate('/dashboard');
                    }
                }
            } catch (error) {
                console.error("Error fetching workspace details:", error);
                navigate('/dashboard');
            } finally {
                setLoading(false); 
            }
        };

        fetchWorkspaceDetails();
    }, [id, navigate]);

    // === NEW CODE: Fetch columns when activeBoard changes ===
    useEffect(() => {
        const fetchColumns = async () => {
            if (!activeBoard) return;
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${API_BASE_URL}/api/column/board/${activeBoard._id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setColumns(data.columns); // Save columns array in state
                }
            } catch (error) {
                console.error("Error fetching columns:", error);
            }
        };

        fetchColumns();
    }, [activeBoard]);
    // ========================================================

   
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                <div className="text-slate-400 text-lg animate-pulse">Loading workspace...</div>
            </div>
        );
    }
        const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

      return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            {/* 1. LEFT SIDEBAR PANEL */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-6">
                <div>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors mb-6"
                    >
                        ← Back to Workspaces
                    </button>

                    <div className="border-t border-slate-800/80 pt-4 mb-6">
                        <h2 className="text-lg font-bold text-blue-500 truncate">{workspace?.name}</h2>
                        <p className="text-xs text-slate-500 truncate">{workspace?.description || "No description"}</p>
                    </div>

                    {/* B. BOARDS SECTION */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold tracking-wider mb-3">
                            <span>BOARDS</span>
                            <button className="text-slate-400 hover:text-blue-500 transition-colors text-sm font-bold">
                                +
                            </button>
                        </div>
                        {boards.length === 0 ? (
                            <p className="text-xs text-slate-600 italic px-2">No boards created</p>
                        ) : (
                            <div className="space-y-1">
                                {boards.map(b => (
                                    <button 
                                        key={b._id}
                                        onClick={() => {
                                            setActiveBoard(b);
                                            setActiveDoc(null); // Close document view if open
                                        }}
                                        className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
                                            activeBoard?._id === b._id 
                                                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' 
                                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                                        }`}
                                    >
                                        📋 {b.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* C. DOCUMENTS SECTION */}
                    <div>
                        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold tracking-wider mb-3">
                            <span>DOCUMENTS</span>
                            <button className="text-slate-400 hover:text-blue-500 transition-colors text-sm font-bold">
                                +
                            </button>
                        </div>
                        {documents.length === 0 ? (
                            <p className="text-xs text-slate-600 italic px-2">No documents created</p>
                        ) : (
                            <div className="space-y-1">
                                {/* Dynamic Doc links list */}
                            </div>
                        )}
                    </div>
                </div>

                {/* D. Bottom Profile Widget*/}
                <div className="border-t border-slate-800 pt-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400">
                            A
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold truncate">Akansha</p>
                            <p className="text-xs text-slate-500 truncate">ak.akanshamishra@gmail.com</p>
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

            {/* 2. RIGHT MAIN CONTENT PANE */}
            <main className="flex-1 bg-slate-950 p-10 flex flex-col">
                {activeBoard ? (
                    <div>
                        {/* Selected Board Header */}
                        <div className="border-b border-slate-800 pb-4 mb-6">
                            <h1 className="text-2xl font-extrabold text-white">{activeBoard.name}</h1>
                            <p className="text-xs text-slate-500 mt-1">Kanban Board for tracking workflow</p>
                        </div>
                        
                        {/* Columns & Task Grid (Will build next) */}
                        <div className="flex gap-6 overflow-x-auto pb-4 items-start">
                            {columns.map(col => (
                                <div 
                                    key={col._id} 
                                    className="w-72 shrink-0 bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 flex flex-col"
                                >
                                    {/* Column Header */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm text-slate-200">{col.title}</span>
                                            <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full font-bold">
                                                {col.tasks?.length || 0}
                                            </span>
                                        </div>
                                        <button className="text-slate-500 hover:text-blue-400 transition-colors text-sm font-bold">
                                            +
                                        </button>
                                    </div>

                                    {/* Tasks List */}
                                    <div className="space-y-2 overflow-y-auto max-h-[60vh] min-h-[50px]">
                                        {!col.tasks || col.tasks.length === 0 ? (
                                            <p className="text-xs text-slate-600 italic py-4 text-center">No tasks</p>
                                        ) : (
                                            col.tasks.map(task => (
                                                <div 
                                                    key={task._id}
                                                    className="bg-slate-950 hover:bg-slate-800/30 border border-slate-800 hover:border-slate-700/80 rounded-lg p-3 cursor-pointer transition-all"
                                                >
                                                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mb-2 ${
                                                        task.priority === 'High' 
                                                            ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                                                            : task.priority === 'Medium'
                                                            ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                                            : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                                    }`}>
                                                        {task.priority}
                                                    </span>
                                                    <h4 className="text-xs font-bold text-slate-200 truncate">{task.title}</h4>
                                                    {task.description && (
                                                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{task.description}</p>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    // Default Empty State
                    <div className="m-auto text-center text-slate-600">
                        <p className="text-lg font-medium mb-1">No Board Selected</p>
                        <p className="text-sm">Select or create a board from the sidebar to start tracking tasks.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Workspace;