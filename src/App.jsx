import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CallRoom from './pages/CallRoom'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    const currentSession = supabase.auth.getSession()
    currentSession.then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((_, authSession) => {
      setSession(authSession)
    })

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 text-white">
        <div className="max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl">
          <h1 className="text-3xl font-semibold text-white">Configuration manquante</h1>
          <p className="mt-4 text-slate-400">
            Le projet n’a pas pu démarrer car les variables d’environnement Supabase sont absentes.
          </p>
          <p className="mt-4 rounded-2xl bg-slate-800 p-4 text-left text-sm text-slate-300">
            Copiez <code className="rounded bg-slate-950 px-1 py-0.5">.env.example</code> en <code className="rounded bg-slate-950 px-1 py-0.5">.env</code>, puis ajoutez :
            <br />
            <span className="font-mono text-cyan-300">VITE_SUPABASE_URL</span> et <span className="font-mono text-cyan-300">VITE_SUPABASE_ANON_KEY</span>
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={session ? <Dashboard session={session} /> : <Navigate to="/login" replace />} />
        <Route path="/call" element={session ? <CallRoom session={session} /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to={session ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
