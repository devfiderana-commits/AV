import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import VideoPlayer from '../components/VideoPlayer'
import CallControls from '../components/CallControls'

const ICE_CONFIG = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
  ],
}

export default function CallRoom({ session }) {
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const peerRef = useRef(null)
  const localStreamRef = useRef(null)
  const [status, setStatus] = useState('Initialisation...')
  const [callActive, setCallActive] = useState(false)

  useEffect(() => {
    let subscription

    async function initMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        localStreamRef.current = stream
        localVideoRef.current.srcObject = stream
        setStatus('Caméra et micro prêts')
      } catch (error) {
        setStatus('Erreur d’accès à la caméra / micro')
        console.error(error)
      }
    }

    const setupRealtime = async () => {
      subscription = supabase
        .channel('signals-channel')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'signals' },
          async (payload) => {
            const signal = payload.new?.data
            if (!signal || signal.from === session.user.id) {
              return
            }
            await handleIncomingSignal(signal)
          }
        )
        .subscribe()

      if (subscription?.status !== 'SUBSCRIBED') {
        setStatus('Connexion realtime en cours...')
      }
    }

    initMedia()
    setupRealtime()

    return () => {
      subscription?.unsubscribe()
      peerRef.current?.close()
      localStreamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [session.user.id])

  const createPeerConnection = () => {
    const peerConnection = new RTCPeerConnection(ICE_CONFIG)
    peerRef.current = peerConnection

    peerConnection.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0]
    }

    peerConnection.onicecandidate = async (event) => {
      if (!event.candidate) return
      await supabase.from('signals').insert({
        type: 'candidate',
        data: { from: session.user.id, candidate: event.candidate },
      })
    }

    localStreamRef.current.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStreamRef.current)
    })

    return peerConnection
  }

  const handleIncomingSignal = async (signal) => {
    if (signal.type === 'offer') {
      const peerConnection = createPeerConnection()
      await peerConnection.setRemoteDescription(signal.offer)

      const answer = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(answer)

      await supabase.from('signals').insert({
        type: 'answer',
        data: { from: session.user.id, answer },
      })
      setCallActive(true)
      setStatus('Réponse envoyée')
    }

    if (signal.type === 'answer' && peerRef.current) {
      await peerRef.current.setRemoteDescription(signal.answer)
      setCallActive(true)
      setStatus('Appel établi')
    }

    if (signal.type === 'candidate' && peerRef.current) {
      try {
        await peerRef.current.addIceCandidate(signal.candidate)
      } catch (error) {
        console.warn('Impossible d’ajouter le candidat ICE', error)
      }
    }
  }

  const startCall = async () => {
    setStatus('Création de l’offre...')
    const peerConnection = createPeerConnection()
    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    await supabase.from('signals').insert({
      type: 'offer',
      data: { from: session.user.id, offer },
    })

    setStatus('Offre envoyée, en attente de réponse...')
  }

  const endCall = () => {
    peerRef.current?.close()
    peerRef.current = null
    setCallActive(false)
    setStatus('Appel terminé')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Salle d’appel</h1>
            <p className="mt-2 text-slate-400">Utilisez le bouton ci-dessous pour créer une offre WebRTC via Supabase.</p>
          </div>
          <div className="text-slate-300">Statut : {status}</div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <VideoPlayer title="Local" videoRef={localVideoRef} muted />
            <VideoPlayer title="Distant" videoRef={remoteVideoRef} />
          </div>

          <CallControls
            onStart={startCall}
            onEnd={endCall}
            callActive={callActive}
          />
        </div>
      </div>
    </div>
  )
}
