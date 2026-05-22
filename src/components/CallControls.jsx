export default function CallControls({ onStart, onEnd, callActive }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
      <h2 className="text-xl font-semibold text-white">Contrôles d’appel</h2>
      <p className="mt-3 text-slate-400">Créez ou terminez un appel WebRTC avec Supabase comme signalisation.</p>
      <div className="mt-6 flex flex-col gap-4">
        <button
          type="button"
          onClick={onStart}
          className="rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          Démarrer l’appel
        </button>
        <button
          type="button"
          onClick={onEnd}
          disabled={!callActive}
          className="rounded-2xl border border-slate-700 px-5 py-3 text-slate-200 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Terminer l’appel
        </button>
      </div>
    </div>
  )
}
