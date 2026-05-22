export default function VideoPlayer({ title, videoRef, muted = false }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        className="h-[360px] w-full rounded-3xl bg-black object-cover"
      />
    </div>
  )
}
