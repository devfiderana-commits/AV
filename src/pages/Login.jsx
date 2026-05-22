import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('login')
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage(null)

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMessage(error.message)
        return
      }
      setMessage('Vérifiez votre email pour confirmer votre compte.')
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setMessage(error.message)
      return
    }

    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-xl">
        <h1 className="text-3xl font-semibold text-white mb-3">Appel Vidéo</h1>
        <p className="text-slate-400 mb-6">Connectez-vous ou créez un compte pour démarrer.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-slate-300">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-500"
            />
          </label>
          <label className="block text-slate-300">
            <span>Mot de passe</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-500"
            />
          </label>

          {message && <div className="rounded-2xl bg-slate-800 p-3 text-sm text-amber-200">{message}</div>}

          <button
            type="submit"
            className="w-full rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            {mode === 'login' ? 'Se connecter' : 'Créer un compte'}
          </button>
        </form>

        <div className="mt-6 text-center text-slate-400">
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="font-medium text-cyan-400 hover:text-cyan-200"
          >
            {mode === 'login' ? 'Pas de compte ? Inscrivez-vous' : 'Déjà un compte ? Connectez-vous'}
          </button>
        </div>
      </div>
    </div>
  )
}
