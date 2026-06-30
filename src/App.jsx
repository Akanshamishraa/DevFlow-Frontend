import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 text-center max-w-md w-full">
        <h1 className="text-4xl font-extrabold mb-2 text-sky-400 tracking-tight">DevFlow Workspace</h1>
        <p className="text-slate-400 mb-6">
         
        </p>
        <button 
          onClick={() => setCount(count + 1)}
          className="bg-indigo-500 hover:bg-indigo-300 active:scale-95 transition-all text-white font-medium py-2.5 px-6 rounded-xl shadow-lg shadow-sky-500/25"
        >
          Click count: {count}
        </button>
      </div>
    </div>
  )
}

export default App