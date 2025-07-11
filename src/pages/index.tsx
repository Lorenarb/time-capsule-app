// Estrutura base do site cápsula do tempo para casamento
// Frontend em React com TailwindCSS e integração com Cloudinary para upload

import { useState, useRef, useEffect } from "react"
import { CameraIcon, ImageIcon } from 'lucide-react'

// Função utilitária para detectar suporte a webm com áudio (Safari/iOS não suporta)
function isWebMSupported() {
  const video = document.createElement('video')
  return video.canPlayType('video/webm; codecs="vp8, vorbis"') !== ''
}

export default function Home() {
  const [step, setStep] = useState(1)
  const [recording, setRecording] = useState(false)
  const [mediaBlobUrl, setMediaBlobUrl] = useState<string | null>(null)
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [webmSupported, setWebmSupported] = useState(true)
  const previewRef = useRef<HTMLDivElement | null>(null)

  interface UploadToCloudinary {
    (file: File | Blob): Promise<void>
  }

  const uploadToCloudinary: UploadToCloudinary = async (file) => {
    const data = new FormData()
    data.append("file", file)
    data.append("upload_preset", "capsula_do_tempo")
    data.append("cloud_name", "darqo8wva")

    await fetch("https://api.cloudinary.com/v1_1/darqo8wva/upload", {
      method: "POST",
      body: data,
    })
    alert("Arquivo enviado com sucesso!")
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file: File | undefined = e.target.files?.[0]
    if (file) await uploadToCloudinary(file)
  }

  const handleStartRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    setPreviewStream(stream)
    // Tenta gravar em mp4 se suportado, senão cai para webm
    let options: MediaRecorderOptions = {}
    if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1.42E01E,mp4a.40.2')) {
      options = { mimeType: 'video/mp4;codecs=avc1.42E01E,mp4a.40.2' }
    } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) {
      options = { mimeType: 'video/webm;codecs=vp8,opus' }
    }
    let recorder: MediaRecorder
    try {
      recorder = new MediaRecorder(stream, options)
    } catch {
      alert('Seu navegador não suporta gravação de vídeo neste formato. Por favor, utilize o upload manual.')
      stream.getTracks().forEach(track => track.stop())
      return
    }
    setMediaRecorder(recorder)
    const chunks: BlobPart[] = []

    recorder.ondataavailable = (e) => chunks.push(e.data)
    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: recorder.mimeType })
      setMediaBlobUrl(URL.createObjectURL(blob))
      setPreviewStream(null)
      stream.getTracks().forEach(track => track.stop())
      await uploadToCloudinary(blob)
    }

    recorder.start()
    setRecording(true)
    // setStep(2) // Removido para não mudar de página automaticamente ao iniciar gravação
  }

  const handleStopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop()
      setRecording(false)
      setMediaRecorder(null)
    }
  }

  useEffect(() => {
    setWebmSupported(isWebMSupported())
  }, [])

  useEffect(() => {
    if (previewStream && previewRef.current) {
      previewRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [previewStream])

  // const romanticFontStyle = { fontFamily: "'Great Vibes', cursive" }
  // const elegantFontStyle = { fontFamily: "'DM Sans', sans-serif" }

  if (step === 1) {
    return (
      <div
        className="relative flex flex-col items-center justify-center h-screen text-center bg-cover bg-center bg-no-repeat animate-fade-in font-sans"
        style={{ backgroundImage: "url('https://res.cloudinary.com/darqo8wva/image/upload/v1751208682/WhatsApp_Image_2025-06-25_at_21.27.27_1_eeygbv.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-0" />
        <h1 className="absolute top-8 left-0 w-full text-7xl md:text-8xl text-white mt-0 mb-8 md:mt-0 md:mb-12 ml-0 md:ml-0 transition-opacity duration-1000 drop-shadow-2xl font-great-vibes z-20 text-center pointer-events-none select-none">
          Andressa & Matheus
        </h1>
        <div className="relative z-10 flex flex-col items-center animate-slide-up">
          <div className="bg-white bg-opacity-70 border-4 border-[#eab1b7] rounded-xl shadow-lg p-6 w-full max-w-md mx-1 transition-transform duration-700 hover:scale-105">
            <p className="text-lg mb-4 font-sans">Que tal compartilhar conosco seus momentos favoritos da festa? 🥰</p>
            <button onClick={() => setStep(2)} className="bg-[#b25663] text-white px-6 py-2 rounded-full hover:bg-[#993f4d] transition font-sans">
              Compartilhar agora
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen p-4 text-center bg-cover bg-center animate-fade-in font-sans"
      style={{ backgroundImage: "url('https://res.cloudinary.com/darqo8wva/image/upload/v1751208678/WhatsApp_Image_2025-06-25_at_21.27.27_igzqjo.jpg')" }}
    >
      <div className="absolute inset-0 bg-white/70 z-0" />
      <div className="relative z-10 flex flex-col items-center w-full animate-slide-up">
        <h2 className="text-xl font-semibold mb-6 font-sans">Deixe sua mensagem para os noivos! 💌</h2>

        <div className="flex flex-col gap-6 w-full max-w-xs">
          <div className="bg-white bg-opacity-70 border-4 border-[#eab1b7] rounded-xl shadow-lg p-4 flex flex-col items-center justify-center aspect-square transition-transform duration-700 hover:scale-105">
            <h3 className="text-md font-semibold mb-2 font-sans">Gravar mensagem</h3>
            <CameraIcon size={40} className="text-[#b25663] mb-2" />
            {!recording ? (
              <button onClick={handleStartRecording} className="bg-[#b25663] text-white px-4 py-2 rounded-full hover:bg-[#993f4d] transition w-full font-sans">
                Iniciar gravação
              </button>
            ) : (
              <button onClick={handleStopRecording} className="bg-[#b25663] text-white px-4 py-2 rounded-full hover:bg-[#993f4d] transition w-full font-sans">
                Parar gravação
              </button>
            )}
          </div>

          <div className="bg-white bg-opacity-70 border-4 border-[#eab1b7] rounded-xl shadow-lg p-4 flex flex-col items-center justify-center aspect-square transition-transform duration-700 hover:scale-105">
            <h3 className="text-md font-semibold mb-2 font-sans">Enviar fotos/vídeos</h3>
            <ImageIcon size={40} className="text-[#b25663] mb-2" />
            <label className="cursor-pointer bg-[#b25663] text-white px-4 py-2 rounded-full hover:bg-[#993f4d] transition w-full text-center font-sans">
              Escolher arquivos
              <input type="file" hidden onChange={handleFileUpload} />
            </label>
          </div>
        </div>

        {previewStream && !mediaBlobUrl && (
          <div ref={previewRef} className="w-full max-w-md mt-6 animate-fade-in flex flex-col items-center gap-2">
            <video
              className="w-full border-2 border-[#b25663]"
              autoPlay
              muted
              playsInline
              ref={videoEl => {
                if (videoEl && previewStream) {
                  videoEl.srcObject = previewStream
                }
              }}
            />
            <button
              onClick={handleStopRecording}
              className="bg-[#b25663] text-white px-4 py-2 rounded-full hover:bg-[#993f4d] transition font-sans mt-2"
            >
              Parar gravação
            </button>
          </div>
        )}
        {mediaBlobUrl && (
          <>
            {/* Detecta o tipo do blob para saber se é mp4 ou webm */}
            {(() => {
              const isMp4 = mediaBlobUrl && mediaRecorder && mediaRecorder.mimeType.includes('mp4')
              if (isMp4) {
                return (
                  <video
                    src={mediaBlobUrl}
                    controls
                    className="w-full max-w-md mt-6 animate-fade-in border-2 border-[#b25663]"
                    onError={e => {
                      const video = e.currentTarget;
                      video.style.display = 'none';
                      const msg = document.createElement('div');
                      msg.textContent = 'Não foi possível exibir o vídeo gravado. Tente novamente ou utilize outro navegador.';
                      msg.className = 'text-red-600 text-center mt-6';
                      video.parentElement?.appendChild(msg);
                    }}
                  />
                )
              } else if (webmSupported) {
                return (
                  <video
                    src={mediaBlobUrl}
                    controls
                    className="w-full max-w-md mt-6 animate-fade-in border-2 border-[#b25663]"
                    onError={e => {
                      const video = e.currentTarget;
                      video.style.display = 'none';
                      const msg = document.createElement('div');
                      msg.textContent = 'Não foi possível exibir o vídeo gravado. Tente novamente ou utilize outro navegador.';
                      msg.className = 'text-red-600 text-center mt-6';
                      video.parentElement?.appendChild(msg);
                    }}
                  />
                )
              } else {
                return (
                  <div className="w-full max-w-md mt-6 animate-fade-in border-2 border-[#b25663] bg-white/80 p-4 rounded-xl text-center text-red-600">
                    <p>Seu navegador não suporta a reprodução do vídeo gravado neste formato.<br />
                    Por favor, utilize o Google Chrome ou outro navegador compatível.<br />
                    Se preferir, envie seu vídeo diretamente pelo botão de upload abaixo.</p>
                  </div>
                )
              }
            })()}
          </>
        )}
      </div>
    </div>
  )
}
