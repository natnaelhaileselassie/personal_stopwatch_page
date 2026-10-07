import { useEffect, useRef, useState } from 'react'
import './App.css'

const POMODORO_PRESETS = {
  focus: 25 * 60 * 1000,
  shortBreak: 5 * 60 * 1000,
  longBreak: 15 * 60 * 1000,
} as const

type PomodoroMode = keyof typeof POMODORO_PRESETS

function formatStopwatch(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const hundredths = Math.floor((ms % 1000) / 10)
  const pad = (n: number, len = 2) => n.toString().padStart(len, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(hundredths)}`
}

function formatTitle(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (n: number) => n.toString().padStart(2, '0')
  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`
}

function formatCountdown(ms: number): string {
  const clamped = Math.max(0, ms)
  const totalSeconds = Math.ceil(clamped / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(minutes)}:${pad(seconds)}`
}

function toDecimalMinutes(ms: number): string {
  return (ms / 60000).toFixed(2)
}

function Stopwatch() {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const startRef = useRef<number>(0)
  const baseRef = useRef<number>(0)

  useEffect(() => {
    if (!running) return
    startRef.current = performance.now()
    const id = window.setInterval(() => {
      setElapsed(baseRef.current + (performance.now() - startRef.current))
    }, 50)
    return () => window.clearInterval(id)
  }, [running])

  const title = formatTitle(elapsed)
  useEffect(() => {
    document.title = `${title} — Stopwatch`
  }, [title])

  const toggle = () => {
    if (running) {
      baseRef.current = baseRef.current + (performance.now() - startRef.current)
      setElapsed(baseRef.current)
      setRunning(false)
    } else {
      setRunning(true)
    }
  }

  const reset = () => {
    setRunning(false)
    baseRef.current = 0
    setElapsed(0)
  }

  return (
    <div className="card">
      <h2>Stopwatch</h2>
      <div className="display">{formatStopwatch(elapsed)}</div>
      <div className="decimal">
        <span className="decimal-label">Decimal minutes</span>
        <span className="decimal-value">{toDecimalMinutes(elapsed)}</span>
      </div>
      <div className="controls">
        <button type="button" className="primary" onClick={toggle}>
          {running ? 'Pause' : elapsed === 0 ? 'Start' : 'Resume'}
        </button>
        <button type="button" onClick={reset} disabled={elapsed === 0 && !running}>
          Reset
        </button>
      </div>
    </div>
  )
}

function Pomodoro() {
  const [mode, setMode] = useState<PomodoroMode>('focus')
  const [remaining, setRemaining] = useState(POMODORO_PRESETS.focus)
  const [running, setRunning] = useState(false)
  const endRef = useRef<number>(0)

  useEffect(() => {
    if (!running) return
    endRef.current = performance.now() + remaining
    const id = window.setInterval(() => {
      const left = endRef.current - performance.now()
      if (left <= 0) {
        setRemaining(0)
        setRunning(false)
        window.clearInterval(id)
        return
      }
      setRemaining(left)
    }, 100)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  const switchMode = (next: PomodoroMode) => {
    setMode(next)
    setRunning(false)
    setRemaining(POMODORO_PRESETS[next])
  }

  const toggle = () => {
    if (remaining <= 0) {
      setRemaining(POMODORO_PRESETS[mode])
      setRunning(true)
      return
    }
    setRunning((r) => !r)
  }

  const reset = () => {
    setRunning(false)
    setRemaining(POMODORO_PRESETS[mode])
  }

  const done = remaining <= 0

  return (
    <div className="card">
      <h2>Pomodoro</h2>
      <div className="tabs">
        {(Object.keys(POMODORO_PRESETS) as PomodoroMode[]).map((m) => (
          <button
            key={m}
            type="button"
            className={m === mode ? 'tab active' : 'tab'}
            onClick={() => switchMode(m)}
          >
            {m === 'focus' ? 'Focus' : m === 'shortBreak' ? 'Short break' : 'Long break'}
          </button>
        ))}
      </div>
      <div className={done ? 'display done' : 'display'}>
        {done ? 'Time!' : formatCountdown(remaining)}
      </div>
      <div className="controls">
        <button type="button" className="primary" onClick={toggle}>
          {running ? 'Pause' : done ? 'Restart' : 'Start'}
        </button>
        <button type="button" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  )
}

function App() {
  return (
    <main className="app">
      <header className="header">
        <h1>Stopwatch & Pomodoro</h1>
        <p>Track elapsed time with decimal minutes while a pomodoro runs alongside.</p>
      </header>
      <div className="grid">
        <Stopwatch />
        <Pomodoro />
      </div>
    </main>
  )
}

export default App
