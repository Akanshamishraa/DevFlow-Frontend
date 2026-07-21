import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.js';

const Workspace = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // States
    const [workspace, setWorkspace] = useState(null); // Saved database workspace details
    const [loading, setLoading] = useState(true); // Loading spinner controller
        // Workspace content states
    const [boards, setBoards] = useState([]); // List of boards
    const [documents, setDocuments] = useState([]); // List of documents
    const [activeBoard, setActiveBoard] = useState(null); // Currently selected board to display
    const [activeDoc, setActiveDoc] = useState(null); // Currently selected doc to display

    useEffect(() => {
        const fetchWorkspaceDetails = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                // Backend GET single workspace API hit kiya
                const response = await fetch(`${API_BASE_URL}/api/workspace/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    setWorkspace(data.workspace); // State mein workspace details saved ki
                } else {
                    // Agar wrong ID ho ya access na ho, toh user ko dashboard par bhej do
                    navigate('/dashboard');
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
                    {/* A. Back Navigation link */}
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
                                {/* Dynamic Board links list */}
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

                {/* D. Bottom Profile Widget (Same as dashboard) */}
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
            <main className="flex-1 bg-slate-950 p-10 flex items-center justify-center">
                <div className="text-center text-slate-600">
                    <p className="text-lg font-medium mb-1">No Board Selected</p>
                    <p className="text-sm">Select or create a board from the sidebar to start tracking tasks.</p>
                </div>
            </main>
        </div>
    );
};

export default Workspace;