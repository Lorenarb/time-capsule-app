// Estrutura base do site cápsula do tempo para casamento
// Frontend em React com TailwindCSS e integração com Cloudinary para upload

import { useState } from "react"
import { CameraIcon, ImageIcon } from 'lucide-react'

export default function Home() {
  const [step, setStep] = useState(1)
  const [recording, setRecording] = useState(false)
  const [mediaBlobUrl, setMediaBlobUrl] = useState<string | null>(null)

  interface CloudinaryUploadResponse {
    secure_url: string
  }

  interface UploadToCloudinary {
    (file: File | Blob): Promise<void>
  }

  const uploadToCloudinary: UploadToCloudinary = async (file) => {
    const data = new FormData()
    data.append("file", file)
    data.append("upload_preset", "capsula_do_tempo")
    data.append("cloud_name", "darqo8wva")

    const res = await fetch("https://api.cloudinary.com/v1_1/darqo8wva/upload", {
      method: "POST",
      body: data,
    })
    const json: CloudinaryUploadResponse = await res.json()
    alert("Upload realizado com sucesso! Link: " + json.secure_url)
  }

  interface FileUploadEvent extends React.ChangeEvent<HTMLInputElement> {}

const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
  const file: File | undefined = e.target.files?.[0]
  if (file) await uploadToCloudinary(file)
}

  const handleMediaRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    const mediaRecorder = new MediaRecorder(stream)
    const chunks: BlobPart[] = []

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'video/webm' })
      setMediaBlobUrl(URL.createObjectURL(blob))
      await uploadToCloudinary(blob)
    }

    mediaRecorder.start()
    setRecording(true)
    setTimeout(() => {
      mediaRecorder.stop()
      setRecording(false)
    }, 5000) // grava 5 segundos
  }

  // const romanticFontStyle = { fontFamily: "'Great Vibes', cursive" }
  // const elegantFontStyle = { fontFamily: "'DM Sans', sans-serif" }

  if (step === 1) {
    return (
      <div
        className="relative flex flex-col items-center justify-center h-screen text-center bg-cover bg-center bg-no-repeat animate-fade-in font-sans"
        style={{ backgroundImage: "url('https://res.cloudinary.com/darqo8wva/image/upload/v1751208682/WhatsApp_Image_2025-06-25_at_21.27.27_1_eeygbv.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-0" />
        <div className="relative z-10 flex flex-col items-center animate-slide-up">
          <h1 className="text-6xl text-white mb-8 transition-opacity duration-1000 drop-shadow-lg font-great-vibes">
            Andressa & Matheus
          </h1>
          <div className="bg-white bg-opacity-70 border-4 border-[#b25663] rounded-xl shadow-lg p-6 w-full max-w-md transition-transform duration-700 hover:scale-105">
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
      style={{ backgroundImage: "url('https://res.cloudinary.com/darqo8wva/image/upload/v1750732988/background_2_fx5hsj.jpg')" }}
    >
      <div className="absolute inset-0 bg-white opacity-50 z-0" />
      <div className="relative z-10 flex flex-col items-center w-full animate-slide-up">
        <h2 className="text-xl font-semibold mb-6 font-sans">Deixe sua mensagem para os noivos! 💌</h2>

        <div className="flex flex-col gap-6 w-full max-w-xs">
          <div className="bg-white bg-opacity-70 border-4 border-[#b25663] rounded-xl shadow-lg p-4 flex flex-col items-center justify-center aspect-square transition-transform duration-700 hover:scale-105">
            <h3 className="text-md font-semibold mb-2 font-sans">Gravar mensagem</h3>
            <CameraIcon size={40} className="text-[#b25663] mb-2" />
            <button onClick={handleMediaRecording} disabled={recording} className="bg-[#b25663] text-white px-4 py-2 rounded-full hover:bg-[#993f4d] transition w-full font-sans">
              {recording ? 'Gravando...' : 'Gravar vídeo/áudio'}
            </button>
          </div>

          <div className="bg-white bg-opacity-70 border-4 border-[#b25663] rounded-xl shadow-lg p-4 flex flex-col items-center justify-center aspect-square transition-transform duration-700 hover:scale-105">
            <h3 className="text-md font-semibold mb-2 font-sans">Enviar fotos/vídeos</h3>
            <ImageIcon size={40} className="text-[#b25663] mb-2" />
            <label className="cursor-pointer bg-[#b25663] text-white px-4 py-2 rounded-full hover:bg-[#993f4d] transition w-full text-center font-sans">
              Escolher arquivos
              <input type="file" hidden onChange={handleFileUpload} />
            </label>
          </div>
        </div>

        {mediaBlobUrl && (
          <video src={mediaBlobUrl} controls className="w-full max-w-md mt-6 animate-fade-in" />
        )}
      </div>
    </div>
  )
}
