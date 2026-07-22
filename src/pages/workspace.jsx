import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

    // Modal forms states
    const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
    const [newBoardName, setNewBoardName] = useState('');

    const [isColModalOpen, setIsColModalOpen] = useState(false);
    const [newColTitle, setNewColTitle] = useState('');

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [selectedColId, setSelectedColId] = useState(null);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDesc, setTaskDesc] = useState('');
    const [taskPriority, setTaskPriority] = useState('Medium');
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);
    const [newDocTitle, setNewDocTitle] = useState('');
    const [editorTitle, setEditorTitle] = useState('');
    const [editorContent, setEditorContent] = useState('');
    const [isSavingDoc, setIsSavingDoc] = useState(false);

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
                        
                        // Fetch documents for this workspace
                        const docsResponse = await fetch(`${API_BASE_URL}/api/document/workspace/${id}`, {
                            method: 'GET',
                            headers: {
                                "Authorization": `Bearer ${token}`
                            }
                        });
                        const docsData = await docsResponse.json();
                        if (docsResponse.ok) {
                            setDocuments(docsData.documents);
                        }
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
                    setColumns(data.columns); 
                }
            } catch (error) {
                console.error("Error fetching columns:", error);
            }
        };

        fetchColumns();
    }, [activeBoard]);
   
   
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

    const handleCreateBoard = async (e) => {
        e.preventDefault();
        if (!newBoardName.trim()) return;
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/api/board`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: newBoardName, workspaceId: id })
            });
            const data = await response.json();
            if (response.ok) {
                setBoards([...boards, data.board]);
                setNewBoardName('');
                setIsBoardModalOpen(false);
                toast.success("Board created successfully! 📋");
            }
        } catch (error) {
            console.error("Error creating board:", error);
        }
    };

    const handleCreateColumn = async (e) => {
        e.preventDefault();
        if (!newColTitle.trim() || !activeBoard) return;
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/api/column`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title: newColTitle, boardId: activeBoard._id })
            });
            const data = await response.json();
            if (response.ok) {
                // Set default tasks list to empty array to prevent render crashes
                const newCol = { ...data.column, tasks: [] };
                setColumns([...columns, newCol]);
                setNewColTitle('');
                setIsColModalOpen(false);
                toast.success("Column added successfully! ⚡");
            }
        } catch (error) {
            console.error("Error creating column:", error);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!taskTitle.trim() || !selectedColId) return;
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/api/task`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: taskTitle,
                    description: taskDesc,
                    columnId: selectedColId,
                    priority: taskPriority
                })
            });
            const data = await response.json();
            if (response.ok) {
                setColumns(columns.map(col => {
                    if (col._id === selectedColId) {
                        return {
                            ...col,
                            tasks: [...(col.tasks || []), data.task]
                        };
                    }
                    return col;
                }));
                setTaskTitle('');
                setTaskDesc('');
                setTaskPriority('Medium');
                setIsTaskModalOpen(false);
                toast.success("Task created successfully! 🎯");
            }
        } catch (error) {
            console.error("Error creating task:", error);
        }
    };

    // 3A. Interactive Toast Confirmation Modal
    const confirmDeleteTask = (taskId, columnId) => {
        const DeleteToastMsg = ({ closeToast }) => (
            <div className="flex flex-col gap-2 p-1">
                <p className="text-xs font-bold text-slate-200">Are you sure you want to delete this task? </p>
                <div className="flex gap-2 justify-end mt-1">
                    <button 
                        type="button"
                        onClick={closeToast}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-300 text-[10px] font-bold rounded transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="button"
                        onClick={() => {
                            performDeleteTask(taskId, columnId);
                            closeToast();
                        }}
                        className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold rounded transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        );

        toast(<DeleteToastMsg />, {
            autoClose: false,
            closeOnClick: false,
            closeButton: false,
            draggable: false
        });
    };

    // 3B. Actual Delete API Fetch Request
    const performDeleteTask = async (taskId, columnId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/api/task/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setColumns(columns.map(col => {
                    if (col._id === columnId) {
                        return {
                            ...col,
                            tasks: col.tasks.filter(t => t._id !== taskId)
                        };
                    }
                    return col;
                }));
                toast.success("Task deleted successfully! 🗑️");
            }
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const handleCreateDocument = async (e) => {
        e.preventDefault();
        if (!newDocTitle.trim()) return;
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/api/document`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title: newDocTitle, workspaceId: id })
            });
            const data = await response.json();
            if (response.ok) {
                setDocuments([...documents, data.document]);
                setNewDocTitle('');
                setIsDocModalOpen(false);
                toast.success("Document created successfully! 📄");
            }
        } catch (error) {
            console.error("Error creating document:", error);
        }
    };

    const handleSelectDocument = async (doc) => {
        setActiveBoard(null); // Deselect board
        setActiveDoc(doc);
        setEditorTitle(doc.title);
        setEditorContent(''); // Clear text while loading
        
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/api/document/${doc._id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setEditorContent(data.document.content || '');
            }
        } catch (error) {
            console.error("Error loading document:", error);
        }
    };

    const handleSaveDocument = async () => {
        if (!activeDoc) return;
        setIsSavingDoc(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/api/document/${activeDoc._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: editorTitle,
                    content: editorContent
                })
            });
            const data = await response.json();
            if (response.ok) {
                // Update basic info in listing array
                setDocuments(documents.map(d => d._id === activeDoc._id ? { ...d, title: editorTitle } : d));
                setActiveDoc(data.document);
                toast.success("Document saved successfully!");
            }
        } catch (error) {
            console.error("Error saving document:", error);
        } finally {
            setIsSavingDoc(false);
        }
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
                            <button 
                                onClick={() => setIsBoardModalOpen(true)}
                                className="text-slate-400 hover:text-blue-500 transition-colors text-sm font-bold"
                            >
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
                                        {b.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* C. DOCUMENTS SECTION */}
                    <div>
                        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold tracking-wider mb-3">
                            <span>DOCUMENTS</span>
                            <button 
                                onClick={() => setIsDocModalOpen(true)}
                                className="text-slate-400 hover:text-blue-500 transition-colors text-sm font-bold"
                            >
                                +
                            </button>
                        </div>
                        {documents.length === 0 ? (
                            <p className="text-xs text-slate-600 italic px-2">No documents created</p>
                        ) : (
                            <div className="space-y-1">
                                {documents.map(doc => (
                                    <button 
                                        key={doc._id}
                                        onClick={() => handleSelectDocument(doc)}
                                        className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
                                            activeDoc?._id === doc._id 
                                                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' 
                                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                                        }`}
                                    >
                                         {doc.title}
                                    </button>
                                ))}
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
                        
                                              {/* Columns & Task Grid */}
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
                                        <button 
                                            onClick={() => {
                                                setSelectedColId(col._id);
                                                setIsTaskModalOpen(true);
                                            }}
                                            className="text-slate-500 hover:text-blue-400 transition-colors text-sm font-bold"
                                        >
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
                                                    className="bg-slate-950 hover:bg-slate-800/30 border border-slate-800 hover:border-slate-700/80 rounded-lg p-3 cursor-pointer transition-all relative group"
                                                >
                                                    {/* Priority Badge */}
                                                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mb-2 ${
                                                        task.priority === 'High' 
                                                            ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                                                            : task.priority === 'Medium'
                                                            ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                                            : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                                                    }`}>
                                                        {task.priority}
                                                    </span>

                                                    {/* Dynamic Trash icon button (only visible on hover) */}
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Stops details click trigger
                                                            confirmDeleteTask(task._id, col._id);
                                                        }}
                                                        className="absolute top-3 right-3 text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                                        title="Delete Task"
                                                    >
                                                        🗑️
                                                    </button>

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

                            {/* Add Column Button Card */}
                            <button 
                                onClick={() => setIsColModalOpen(true)}
                                className="w-72 shrink-0 bg-slate-900/20 hover:bg-slate-900/40 border border-dashed border-slate-800 hover:border-slate-700/80 rounded-xl p-4 flex items-center justify-center gap-2 text-slate-500 hover:text-slate-300 text-sm font-semibold transition-all h-[52px]"
                            >
                                + Add Column
                            </button>
                        </div>
                    </div>
                ) : activeDoc ? (
                    // Notion-style Document Editor
                    <div className="flex flex-col h-full">
                        {/* Editor Header */}
                        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                            <input 
                                type="text"
                                value={editorTitle}
                                onChange={(e) => setEditorTitle(e.target.value)}
                                className="bg-transparent text-2xl font-extrabold text-white focus:outline-none w-3/4"
                                placeholder="Untitled Document"
                            />
                            <button 
                                onClick={handleSaveDocument}
                                disabled={isSavingDoc}
                                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-700/60 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                            >
                                {isSavingDoc ? (
                                    <>Saving...</>
                                ) : (
                                    <> Save Document</>
                                )}
                            </button>
                        </div>
                        
                        {/* Editor Body */}
                        <textarea 
                            value={editorContent}
                            onChange={(e) => setEditorContent(e.target.value)}
                            className="flex-1 bg-transparent text-slate-300 text-sm focus:outline-none resize-none leading-relaxed font-mono"
                            placeholder="Start writing your thoughts, documentation, or specifications here..."
                        />
                    </div>
                ) : (
                    // Default Empty State
                    <div className="m-auto text-center text-slate-600">
                        <p className="text-lg font-medium mb-1">No Board Selected</p>
                        <p className="text-sm">Select or create a board/document from the sidebar to get started.</p>
                    </div>
                )}
            </main>

            {/* === MODAL OVERLAYS === */}

            {/* 1. Create Board Modal */}
            {isBoardModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <form 
                        onSubmit={handleCreateBoard}
                        className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-96 shadow-2xl flex flex-col gap-4"
                    >
                        <h3 className="text-lg font-bold text-slate-200">Create New Board</h3>
                        <div>
                            <label className="text-xs text-slate-400 block mb-1">Board Name</label>
                            <input 
                                type="text"
                                value={newBoardName}
                                onChange={(e) => setNewBoardName(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                                placeholder="e.g. 📋 Sprint 2 Board"
                                required
                            />
                        </div>
                        <div className="flex gap-2 justify-end mt-2">
                            <button 
                                type="button"
                                onClick={() => setIsBoardModalOpen(false)}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors"
                            >
                                Create Board
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* 2. Create Column Modal */}
            {isColModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <form 
                        onSubmit={handleCreateColumn}
                        className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-96 shadow-2xl flex flex-col gap-4"
                    >
                        <h3 className="text-lg font-bold text-slate-200">Add New Column</h3>
                        <div>
                            <label className="text-xs text-slate-400 block mb-1">Column Title</label>
                            <input 
                                type="text"
                                value={newColTitle}
                                onChange={(e) => setNewColTitle(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                                placeholder="e.g. 🎯 Testing"
                                required
                            />
                        </div>
                        <div className="flex gap-2 justify-end mt-2">
                            <button 
                                type="button"
                                onClick={() => setIsColModalOpen(false)}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors"
                            >
                                Add Column
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* 3. Create Task Modal */}
            {isTaskModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <form 
                        onSubmit={handleCreateTask}
                        className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-[450px] shadow-2xl flex flex-col gap-4"
                    >
                        <h3 className="text-lg font-bold text-slate-200">Create New Task</h3>
                        
                        <div>
                            <label className="text-xs text-slate-400 block mb-1">Task Title</label>
                            <input 
                                type="text"
                                value={taskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                                placeholder="What needs to be done?"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-xs text-slate-400 block mb-1">Description (Optional)</label>
                            <textarea 
                                value={taskDesc}
                                onChange={(e) => setTaskDesc(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors h-24 resize-none"
                                placeholder="Describe the task details..."
                            />
                        </div>

                        <div>
                            <label className="text-xs text-slate-400 block mb-1">Priority</label>
                            <select 
                                value={taskPriority}
                                onChange={(e) => setTaskPriority(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        <div className="flex gap-2 justify-end mt-2">
                            <button 
                                type="button"
                                onClick={() => setIsTaskModalOpen(false)}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors"
                            >
                                Create Task
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* 4. Create Document Modal */}
            {isDocModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <form 
                        onSubmit={handleCreateDocument}
                        className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-96 shadow-2xl flex flex-col gap-4"
                    >
                        <h3 className="text-lg font-bold text-slate-200">Create New Document</h3>
                        <div>
                            <label className="text-xs text-slate-400 block mb-1">Document Title</label>
                            <input 
                                type="text"
                                value={newDocTitle}
                                onChange={(e) => setNewDocTitle(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg px-3 py-2 text-sm text-white focus:outline-none transition-colors"
                                placeholder="e.g. 📄 Project Roadmap"
                                required
                            />
                        </div>
                        <div className="flex gap-2 justify-end mt-2">
                            <button 
                                type="button"
                                onClick={() => setIsDocModalOpen(false)}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors"
                            >
                                Create Document
                            </button>
                        </div>
                    </form>
                </div>
            )}
            
           
            <ToastContainer position="top-right" theme="dark" autoClose={3000} />
        </div>
    );
};

export default Workspace;