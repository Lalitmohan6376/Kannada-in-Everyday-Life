
import { useState } from 'react'
import VoiceAssistant from './VoiceAssistant.jsx'

const API = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000'

const categories = [
  { name: 'Travel', icon: '✈️', detail: 'Stations, buses and directions' },
  { name: 'Shopping', icon: '🛍️', detail: 'Prices, products and bargaining' },
  { name: 'Restaurant', icon: '🍽️', detail: 'Food, water and ordering' },
  { name: 'Healthcare', icon: '🩺', detail: 'Hospitals and basic help' },
]

export default function App() {
  const [tab, setTab] = useState('translate')
  const [sentence, setSentence] = useState('')
  const [situation, setSituation] = useState('')
  const [result, setResult] = useState('')
  const [resultType, setResultType] = useState('text')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submitRequest(endpoint, body, type = 'text') {
    setLoading(true)
    setError('')
    setResult('')
    setResultType(type)

    try {
      const response = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.')
      }

      setResult(data.result)
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Backend connect nahi ho raha. Check karo ki Flask server chal raha hai.'
          : err.message
      )
    } finally {
      setLoading(false)
    }
  }

  async function copyResult(text) {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      setError('Copy nahi ho paya. Text ko select karke copy karo.')
    }
  }

  function openTab(name) {
    setTab(name)
    setResult('')
    setError('')
  }

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-100 text-slate-800">
      <div className="pointer-events-none fixed -left-32 top-24 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl" />
      <div className="pointer-events-none fixed -right-24 top-64 h-96 w-96 rounded-full bg-blue-300/25 blur-3xl" />

      <header className="relative border-b border-white/70 bg-white/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <button onClick={() => openTab('translate')} className="flex items-center gap-3 text-left">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-2xl text-white shadow-lg shadow-blue-200">
              ಕ
            </span>
            <span>
              <span className="block text-xl font-extrabold tracking-tight text-slate-800">
                Kannada Saathi
              </span>
              <span className="block text-xs font-medium text-slate-500">
                Your everyday Kannada companion
              </span>
            </span>
          </button>

          <span className="hidden items-center gap-2 rounded-full border border-sky-100 bg-white/80 px-4 py-2 text-sm font-semibold text-sky-700 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Learn by living
          </span>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 sm:pt-16">
        <section className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/70 px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm backdrop-blur-lg">
              <span>ನಮಸ್ಕಾರ</span>
              Kannada starts here
            </span>

            <h1 className="mt-6 max-w-2xl text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Kannada for your
              <span className="block bg-gradient-to-r from-sky-500 to-blue-700 bg-clip-text text-transparent">
                everyday life.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Translate your sentences, learn useful local phrases and find the
              right words for real-life situations in Karnataka.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <span className="rounded-xl border border-white bg-white/70 px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
                🌐 Hindi & English
              </span>
              <span className="rounded-xl border border-white bg-white/70 px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
                🔤 Easy pronunciation
              </span>
              <span className="rounded-xl border border-white bg-white/70 px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
                💬 Everyday phrases
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-5 rounded-[2rem] bg-sky-300/30 blur-2xl" />
            <div className="relative rounded-[2rem] border border-white/90 bg-white/60 p-5 shadow-2xl shadow-blue-200/40 backdrop-blur-2xl sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-sky-700">A little Kannada</p>
                  <p className="mt-1 text-xs text-slate-500">A friendly word to begin with</p>
                </div>
                <span className="rounded-2xl bg-sky-100 p-3 text-2xl">💙</span>
              </div>

              <div className="mt-6 rounded-2xl border border-sky-100 bg-gradient-to-br from-white to-sky-50 p-6">
                <p className="text-sm font-medium text-slate-500">Kannada</p>
                <p className="mt-2 text-3xl font-bold text-slate-800">ನಮಸ್ಕಾರ</p>
                <div className="my-5 h-px bg-sky-100" />
                <p className="text-sm font-medium text-slate-500">Pronunciation</p>
                <p className="mt-1 text-lg font-semibold text-sky-700">Namaskara</p>
                <p className="mt-3 text-sm text-slate-600">Meaning: Hello / Greetings</p>
              </div>

              <p className="mt-4 text-center text-xs text-slate-500">
                Small phrases. Real conversations. More confidence.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-14 sm:mt-20">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-600">
              Your language toolkit
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              What would you like to do?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              Choose a tool and get the Kannada you need, right when you need it.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { id: 'translate', number: '01', icon: '🌐', title: 'Everyday Translator', desc: 'Translate a sentence into natural Kannada.' },
              { id: 'situations', number: '02', icon: '🧭', title: 'Real-Life Situations', desc: 'Find useful phrases for daily activities.' },
              { id: 'ask', number: '03', icon: '💬', title: 'Ask Kannada Saathi', desc: 'Describe a situation and get the right words.' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => openTab(item.id)}
                className={`group rounded-3xl border p-6 text-left transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  tab === item.id
                    ? 'border-sky-300 bg-white/90 shadow-lg shadow-sky-100'
                    : 'border-white/90 bg-white/55 shadow-md shadow-blue-100/50 backdrop-blur-xl'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-2xl transition group-hover:bg-sky-200">
                    {item.icon}
                  </span>
                  <span className="text-sm font-bold text-sky-500">{item.number}</span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-800">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.desc}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-sky-700">
                  Open tool <span>→</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-white/90 bg-white/60 p-5 shadow-xl shadow-blue-100/60 backdrop-blur-2xl sm:p-8 lg:p-10">
          <div className="flex flex-wrap gap-2 border-b border-sky-100 pb-5">
            {[
              { id: 'translate', label: '🌐 Translate' },
              { id: 'situations', label: '🧭 Situations' },
              { id: 'ask', label: '💬 Ask Saathi' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => openTab(item.id)}
                className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                  tab === item.id
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-blue-200'
                    : 'bg-white/80 text-slate-600 hover:bg-sky-50 hover:text-sky-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {tab === 'translate' && (
            <div className="mt-7 grid gap-8 lg:grid-cols-2">
              <div>
                <span className="text-sm font-bold text-sky-700">01 / TRANSLATOR</span>
                <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
                  Say it in Kannada
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Type a sentence in English or Hindi. Get the Kannada script,
                  pronunciation and meaning.
                </p>

                <form
                  className="mt-6"
                  onSubmit={(event) => {
                    event.preventDefault()
                    if (sentence.trim()) {
                      submitRequest('/translate', { sentence: sentence.trim() })
                    }
                  }}
                >
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Your sentence
                  </label>
                  <textarea
                    value={sentence}
                    onChange={(event) => setSentence(event.target.value)}
                    placeholder="Example: I want to go to the railway station."
                    rows={5}
                    className="w-full resize-y rounded-2xl border border-sky-100 bg-white/80 p-4 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  />
                  <button
                    disabled={loading || !sentence.trim()}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-4 font-bold text-white shadow-lg shadow-blue-200 transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    {loading ? 'Translating...' : 'Translate to Kannada'} <span>→</span>
                  </button>
                </form>
              </div>

              <div className="flex min-h-64 flex-col rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50/90 to-white/90 p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">Your translation</h3>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-sky-700">
                    Kannada
                  </span>
                </div>
                {result && (
                  <div className="mt-5 flex-1">
                    <p className="whitespace-pre-wrap break-words text-base leading-8 text-slate-700">
                      {result.replace(/\*\*/g, '')}
                    </p>
                    <button
                      onClick={() => copyResult(result.replace(/\*\*/g, ''))}
                      className="mt-5 rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-bold text-sky-700 hover:bg-sky-50"
                    >
                      Copy result
                    </button>
                  </div>
                )}
                {!result && !loading && !error && (
                  <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
                    <span className="text-4xl">✨</span>
                    <p className="mt-3 font-semibold text-slate-600">Your Kannada result will appear here.</p>
                    <p className="mt-1 text-sm text-slate-400">Enter a sentence to get started.</p>
                  </div>
                )}
                {loading && <p className="mt-8 animate-pulse text-sky-700">Finding the right words...</p>}
              </div>
            </div>
          )}

          {tab === 'situations' && (
            <div className="mt-7">
              <span className="text-sm font-bold text-sky-700">02 / PHRASE FINDER</span>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
                Kannada for real life
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Choose a situation to explore practical Kannada phrases.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setSituation(item.name)
                      submitRequest('/situations', { situation: item.name }, 'phrases')
                    }}
                    className={`rounded-2xl border p-4 text-left transition hover:-translate-y-1 hover:shadow-lg ${
                      situation === item.name
                        ? 'border-sky-300 bg-sky-50 shadow-md'
                        : 'border-white bg-white/80 hover:border-sky-200'
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <h3 className="mt-3 font-bold text-slate-800">{item.name}</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{item.detail}</p>
                  </button>
                ))}
              </div>

              {loading && <p className="mt-6 animate-pulse text-sky-700">Loading useful phrases...</p>}
            </div>
          )}

          {tab === 'ask' && (
            <div className="mt-7 max-w-3xl">
              <span className="text-sm font-bold text-sky-700">03 / PERSONAL LANGUAGE HELP</span>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
                Tell us what you need
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Describe a real situation in English or Hindi. Saathi will suggest
                a useful Kannada sentence.
              </p>

              <form
                className="mt-6"
                onSubmit={(event) => {
                  event.preventDefault()
                  if (situation.trim()) {
                    submitRequest('/ask', { situation: situation.trim() })
                  }
                }}
              >
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Describe your situation
                </label>
                <textarea
                  value={situation}
                  onChange={(event) => setSituation(event.target.value)}
                  placeholder="Example: I want to ask a shopkeeper whether they sell shoes."
                  rows={4}
                  className="w-full resize-y rounded-2xl border border-sky-100 bg-white/80 p-4 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
                <button
                  disabled={loading || !situation.trim()}
                  className="mt-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-4 font-bold text-white shadow-lg shadow-blue-200 transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? 'Finding a phrase...' : 'Find my Kannada phrase →'}
                </button>
              </form>
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-700">
              {error}
            </div>
          )}

          {result && tab !== 'translate' && (
            <div className="mt-7 rounded-3xl border border-sky-100 bg-gradient-to-br from-white to-sky-50/80 p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-sky-700">YOUR KANNADA PHRASES</p>
                  <h3 className="mt-1 text-xl font-extrabold text-slate-900">
                    {resultType === 'phrases' ? `${situation} phrases` : 'Your suggested phrase'}
                  </h3>
                </div>
                <button
                  onClick={() => copyResult(result.replace(/\*\*/g, ''))}
                  className="rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-bold text-sky-700 hover:bg-sky-50"
                >
                  Copy all
                </button>
              </div>

              <div className="mt-5 grid gap-3">
                {result.split(/\n\s*\n/).map((phrase, index) => (
                  <div key={index} className="rounded-2xl border border-sky-100 bg-white/90 p-4 sm:p-5">
                    <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
                      {phrase.replace(/\s*\|\s*/g, '\n').replace(/\*\*/g, '')}
                    </p>
                    <button
                      onClick={() => copyResult(phrase.replace(/\s*\|\s*/g, '\n').replace(/\*\*/g, ''))}
                      className="mt-3 text-xs font-bold text-sky-700 hover:text-blue-800"
                    >
                      Copy phrase
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
                <section className="mt-8">
          <VoiceAssistant />
        </section>
        <footer className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/80 pt-6 text-center sm:flex-row sm:text-left">
          <div>
            <p className="font-bold text-slate-700">Kannada Saathi</p>
            <p className="mt-1 text-sm text-slate-500">A little Kannada goes a long way.</p>
          </div>
          <p className="text-xs text-slate-400">Made for everyday conversations in Karnataka.</p>
        </footer>
      </main>
    </div>
  )
}
