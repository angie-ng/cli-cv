import { useMemo, useState } from 'react'
import './App.css'

const HELP_LINES = [
  'Available commands:',
  '  help  Show this help message',
]

function App() {
  const [currentInput, setCurrentInput] = useState('')
  const [history, setHistory] = useState([])

  const promptLabel = useMemo(() => 'angelika@cv:~$', [])

  const runCommand = (rawInput) => {
    const command = rawInput.trim()
    if (!command) return null

    if (command === 'help') {
      return {
        output: HELP_LINES,
        isError: false,
      }
    }

    return {
      output: [`command not found: ${command}`],
      isError: true,
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const typed = currentInput.trim()
    setCurrentInput('')
    if (!typed) return

    const result = runCommand(typed)
    setHistory((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        command: typed,
        output: result?.output ?? [],
        isError: result?.isError ?? false,
      },
    ])
  }

  return (
    <main className="terminal-page">
      <section className="terminal-window" aria-label="Interactive CV terminal">
        <header className="terminal-header">
          <span className="terminal-title">Terminal - angelika@cv</span>
          <span className="terminal-chrome" aria-hidden="true">
            _ [] X
          </span>
        </header>

        <div className="terminal-body">
          <p className="terminal-line">Welcome to Angelika&apos;s interactive CV terminal.</p>
          <p className="terminal-line">Type a command and press Enter.</p>

          <div className="terminal-history" aria-live="polite">
            {history.map((entry) => (
              <div className="history-entry" key={entry.id}>
                <p className="terminal-prompt-line">
                  <span className="prompt-label">{promptLabel}</span>{' '}
                  <span>{entry.command}</span>
                </p>
                {entry.output.map((line) => (
                  <p
                    key={`${entry.id}-${line}`}
                    className={entry.isError ? 'terminal-output error' : 'terminal-output'}
                  >
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <form className="terminal-prompt" onSubmit={handleSubmit}>
            <label className="prompt-label" htmlFor="terminal-input">
              {promptLabel}
            </label>
            <input
              id="terminal-input"
              className="terminal-input"
              type="text"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
              value={currentInput}
              onChange={(event) => setCurrentInput(event.target.value)}
              aria-label="Terminal command input"
            />
          </form>
        </div>
      </section>
    </main>
  )
}

export default App
