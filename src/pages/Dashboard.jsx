import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import UserList from '../components/UserList'

export default function Dashboard({ session }) {
  const navigate = useNavigate()
  const userEmail = session?.user?.email

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const users = useMemo(
    () => [
      { id: '1', name: 'Alice', status: 'En ligne' },
      { id: '2', name: 'Bob', status: 'Disponible' },
    ],
    []
  )

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Tableau de bord</p>
            <h1 className="mt-2 text-3xl font-semibold">Bonjour {userEmail ?? 'utilisateur'}</h1>
            <p className="mt-2 text-slate-400">Démarrez un appel vidéo 1v1 ou explorez les fonctionnalités.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/call')}
              className="rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Rejoindre une salle
            </button>
            <button
              onClick={handleSignOut}
              className="rounded-2xl border border-slate-700 px-5 py-3 text-slate-200 transition hover:border-slate-500"
            >
              Se déconnecter
            </button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold text-white">Résumé</h2>
            <p className="mt-3 text-slate-400">Cette application utilise Supabase pour l’authentification et le signalement WebRTC.</p>
            <div className="mt-6 space-y-4 text-slate-300">
              <div>
                <h3 className="font-semibold text-white">Auth</h3>
                <p>Inscription / connexion avec Supabase.</p>
              </div>
              <div>
                <h3 className="font-semibold text-white">Vidéo</h3>
                <p>Accès caméra / micro et préparation de la salle.</p>
              </div>
              <div>
                <h3 className="font-semibold text-white">Signal</h3>
                <p>Messages temps réel via Supabase Realtime.</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold text-white">Liste des utilisateurs</h2>
            <p className="mt-3 text-slate-400">Cliquez sur un utilisateur pour simuler un appel 1v1.</p>
            <UserList users={users} />
          </div>
        </section>
      </div>
    </div>
  )
}
