export default function UserList({ users }) {
  return (
    <div className="mt-6 space-y-3">
      {users.map((user) => (
        <div key={user.id} className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-white">{user.name}</p>
              <p className="text-sm text-slate-400">{user.status}</p>
            </div>
            <button className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
              Appeler
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
