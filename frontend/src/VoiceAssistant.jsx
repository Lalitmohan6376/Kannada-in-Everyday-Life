
import { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000'

function VoiceAssistant() {
  const [language, setLanguage] = useState('hi-IN')
  const [spokenText, setSpokenText] = useState('')
  const [answer, setAnswer] = useState('')
  const [listening, setListening] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('Ready to listen')

  function startListening() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser. Please try Google Chrome.')
      return
    }

    setError('')
    setAnswer('')
    setSpokenText('')
    setStatus('Listening to your voice...')
    
    const recognition = new SpeechRecognition()
    recognition.lang = language
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setListening(true)
      setStatus('Listening to your voice...')
    }

    recognition.onresult = async (event) => {
      const text = event.results[0][0].transcript

      setSpokenText(text)
      setListening(false)
      setLoading(true)
      setStatus('Kannada Saathi is thinking...')

      try {
       const response = await fetch(`${API_BASE}/voice`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: text }),
})

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'The agent could not process your request.')
        }

        setAnswer(data.result)
        setStatus('Your response is ready')
      } catch (err) {
        setError(
          err.message === 'Failed to fetch'
            ? 'Backend connection failed. Make sure Flask is running.'
            : err.message
        )
        setStatus('Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    recognition.onerror = (event) => {
      const messages = {
        'not-allowed': 'Microphone permission is blocked. Allow microphone access in your browser.',
        'service-not-allowed': 'The browser speech recognition service is unavailable.',
        network: 'Speech recognition network failed. Check your internet connection and try again.',
        'no-speech': 'No voice detected. Move closer to your microphone and try again.',
        'audio-capture': 'No microphone was detected. Check your microphone connection.',
        aborted: 'Recording was interrupted. Please try again.',
      }

      setError(messages[event.error] || `Voice recognition error: ${event.error}`)
      setStatus('Voice recognition stopped')
      setListening(false)
    }

    recognition.onend = () => {
      setListening(false)
    }

    try {
      recognition.start()
    } catch {
      setListening(false)
      setError('Could not start the microphone. Please try again.')
      setStatus('Ready to listen')
    }
  }

  function speakAnswer() {
    if (!answer || !window.speechSynthesis) {
      setError('Speech playback is not available in this browser.')
      return
    }

    const match = answer.match(/Kannada:\s*([^\n]+)/i)
    const kannadaText = match ? match[1].replace(/\*\*/g, '').trim() : ''

    if (!kannadaText) {
      setError('No Kannada sentence was found in the response to read aloud.')
      return
    }

    const voices = window.speechSynthesis.getVoices()
    const kannadaVoice = voices.find((voice) =>
      voice.lang.toLowerCase().startsWith('kn')
    )

    if (!kannadaVoice) {
      setError('Your browser has no Kannada voice available. You can still read and copy the Kannada text.')
      return
    }

    setError('')
    window.speechSynthesis.cancel()

    const speech = new SpeechSynthesisUtterance(kannadaText)
    speech.lang = 'kn-IN'
    speech.voice = kannadaVoice
    speech.rate = 0.9

    window.speechSynthesis.speak(speech)
  }

  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] border border-white/90 bg-gradient-to-br from-white via-sky-50 to-blue-100 p-5 shadow-2xl shadow-sky-200/40 sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-sky-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-12 h-64 w-64 rounded-full bg-blue-300/25 blur-3xl" />

      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-2 text-xs font-bold uppercase tracking-wider text-sky-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Voice experience
          </span>

          <span className="rounded-full border border-white bg-white/70 px-3 py-2 text-xs font-medium text-slate-500">
            Kannada Saathi AI
          </span>
        </div>

        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="text-center lg:text-left">
            <p className="text-sm font-bold tracking-wide text-sky-700">
              SPEAK NATURALLY
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Your voice.
              <span className="block bg-gradient-to-r from-sky-500 to-blue-700 bg-clip-text text-transparent">
                Kannada made easy.
              </span>
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-600 lg:mx-0">
              Speak in Hindi or English. Your words become text,
              and Kannada Saathi helps you communicate in Kannada.
            </p>

            <div className="mt-6">
              <p className="mb-3 text-left text-sm font-bold text-slate-700">
                Choose your speaking language
              </p>

              <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white bg-white/70 p-1.5 shadow-sm">
                <button
                  type="button"
                  disabled={listening || loading}
                  onClick={() => setLanguage('hi-IN')}
                  className={`rounded-xl px-3 py-3 text-sm font-bold transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed ${
                    language === 'hi-IN'
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-200'
                      : 'text-slate-600 hover:bg-sky-50'
                  }`}
                >
                  🇮🇳 Hindi
                </button>

                <button
                  type="button"
                  disabled={listening || loading}
                  onClick={() => setLanguage('en-IN')}
                  className={`rounded-xl px-3 py-3 text-sm font-bold transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed ${
                    language === 'en-IN'
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-200'
                      : 'text-slate-600 hover:bg-sky-50'
                  }`}
                >
                  🌐 English
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white bg-white/65 p-5 shadow-xl shadow-blue-200/30 backdrop-blur-xl sm:p-7">
            <div className="flex flex-col items-center text-center">
              <div className="relative flex h-44 w-44 items-center justify-center">
                {listening && (
                  <>
                    <span className="absolute inset-2 animate-ping rounded-full bg-sky-300/30" />
                    <span className="absolute inset-5 animate-pulse rounded-full border border-sky-300/60" />
                  </>
                )}

                <div className={`relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 via-sky-500 to-blue-700 shadow-xl transition-all duration-500 ${
                  listening
                    ? 'scale-110 shadow-sky-400/50'
                    : 'shadow-blue-300/50 hover:scale-105 hover:shadow-sky-300/70'
                }`}>
                  <div className="absolute inset-2 rounded-full border border-white/30" />

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-12 w-12 text-white"
                  >
                    <rect x="9" y="2" width="6" height="13" rx="3" />
                    <path d="M5 10v2a7 7 0 0 0 14 0v-2" />
                    <path d="M12 19v3M8 22h8" />
                  </svg>
                </div>
              </div>

              <p className={`text-lg font-extrabold ${
                error ? 'text-rose-600' : 'text-slate-800'
              }`}>
                {listening
                  ? 'I’m listening...'
                  : loading
                    ? 'Thinking...'
                    : error
                      ? 'Let’s try again'
                      : 'Ready when you are'}
              </p>

              <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                {listening
                  ? 'Speak clearly. The microphone will stop when you finish.'
                  : loading
                    ? 'Your words are being sent to Kannada Saathi.'
                    : 'Tap the microphone and tell me what you need.'}
              </p>

              <button
                type="button"
                onClick={startListening}
                disabled={listening || loading}
                className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 px-6 py-4 font-bold text-white shadow-lg shadow-blue-300/50 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-300/60 active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:scale-100"
              >
                <span className="text-xl">
                  {listening ? '◉' : '🎙️'}
                </span>
                {listening
                  ? 'Listening...'
                  : loading
                    ? 'Processing your request...'
                    : 'Start speaking'}
              </button>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <span className={`h-2 w-2 rounded-full ${
                  error
                    ? 'bg-rose-500'
                    : listening
                      ? 'animate-pulse bg-sky-500'
                      : loading
                        ? 'animate-pulse bg-amber-400'
                        : 'bg-emerald-400'
                }`} />
                {error || status}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-sm leading-6 text-rose-700">
            <span className="text-lg">ⓘ</span>
            <div>
              <p className="font-bold">We couldn’t complete that step</p>
              <p className="mt-1 break-words">{error}</p>
              <button
                type="button"
                onClick={() => setError('')}
                className="mt-2 font-bold underline underline-offset-4 hover:text-rose-900"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {spokenText && (
          <div className="mt-6 rounded-2xl border border-sky-100 bg-white/80 p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100">
                💬
              </span>
              <div>
                <p className="font-bold text-slate-800">What you said</p>
                <p className="text-xs text-slate-500">Recognized speech</p>
              </div>
            </div>

            <p className="mt-4 break-words text-base leading-7 text-slate-700">
              {spokenText}
            </p>
          </div>
        )}

        {answer && (
          <div className="mt-5 rounded-2xl border border-sky-200/80 bg-gradient-to-br from-white to-sky-50 p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-xl text-white shadow-md">
                  ಕ
                </span>
                <div>
                  <p className="font-extrabold text-slate-800">Kannada Saathi</p>
                  <p className="text-xs text-emerald-600">Response ready</p>
                </div>
              </div>

              <button
                type="button"
                onClick={speakAnswer}
                className="rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-sm font-bold text-sky-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-400 hover:bg-sky-50 hover:shadow-md active:translate-y-0"
              >
                🔊 Listen in Kannada
              </button>
            </div>

            <div className="mt-5 whitespace-pre-wrap break-words rounded-xl border border-white bg-white/80 p-4 text-sm leading-7 text-slate-700">
              {answer}
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-xs leading-5 text-slate-400">
          Voice recognition depends on your browser, microphone permission and internet connection.
        </p>
      </div>
    </section>
  )
}

export default VoiceAssistant
