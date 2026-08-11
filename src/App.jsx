import { useMemo, useRef, useState } from 'react'
import { COMMAND_NAMES, executeCommand } from './commands'
import { completeInputLine } from './commands/shared/complete'
import { HOME_PATH } from './commands/shared/vfs'
import './App.css'

const URL_IN_TEXT = /https?:\/\/[^\s]+/gi

function formatPrompt(cwd) {
  // "~" means the reader home directory, just like a real shell.
  const pathPart = cwd === HOME_PATH ? '~' : cwd
  return `reader@angelika-cv:${pathPart}$`
}

/** Split a line into text and clickable http(s) link segments. */
function renderOutputLine(line) {
  const parts = []
  let lastIndex = 0
  const pattern = new RegExp(URL_IN_TEXT.source, URL_IN_TEXT.flags)
  let match = pattern.exec(line)

  while (match) {
    if (match.index > lastIndex) {
      parts.push(line.slice(lastIndex, match.index))
    }
    const url = match[0]
    parts.push(
      <a
        key={`${match.index}-${url}`}
        className="terminal-link"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {url}
      </a>,
    )
    lastIndex = match.index + url.length
    match = pattern.exec(line)
  }

  if (lastIndex < line.length) {
    parts.push(line.slice(lastIndex))
  }

  return parts.length > 0 ? parts : line
}

function App() {
  const [currentInput, setCurrentInput] = useState('')
  const [history, setHistory] = useState([])
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(null)
  // Start inside the read-only reader home.
  const [cwd, setCwd] = useState(HOME_PATH)
  const inputRef = useRef(null)

  const promptLabel = useMemo(() => formatPrompt(cwd), [cwd])

  const handleSubmit = (event) => {
    event.preventDefault()

    const typed = currentInput.trim()
    setCurrentInput('')
    if (!typed) return

    setCommandHistory((prev) => {
      const next = prev[prev.length - 1] === typed ? prev : [...prev, typed]
      return next.slice(-50)
    })
    setHistoryIndex(null)

    // Capture cwd before execution so history keeps the original prompt path.
    const cwdBeforeCommand = cwd
    const promptBeforeCommand = formatPrompt(cwdBeforeCommand)

    const result = executeCommand(typed, { cwd: cwdBeforeCommand, setCwd })

    if (!result) return

    if (result.action === 'clear') {
      setHistory([])
      return
    }

    setHistory((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        prompt: promptBeforeCommand,
        command: typed,
        output: result.output ?? [],
        isError: result.isError ?? false,
      },
    ])
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (commandHistory.length === 0) return

      const nextIndex =
        historyIndex === null ? commandHistory.length - 1 : Math.max(historyIndex - 1, 0)
      setHistoryIndex(nextIndex)
      setCurrentInput(commandHistory[nextIndex])
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (historyIndex === null) return

      const nextIndex = historyIndex + 1
      if (nextIndex > commandHistory.length - 1) {
        setHistoryIndex(null)
        setCurrentInput('')
        return
      }
      setHistoryIndex(nextIndex)
      setCurrentInput(commandHistory[nextIndex])
      return
    }

    if (event.key === 'Tab') {
      event.preventDefault()
      // Completes command names or path args for ls/cd/cat (single match only).
      const completed = completeInputLine(currentInput, COMMAND_NAMES, cwd)
      if (completed) {
        setCurrentInput(completed)
      }
    }
  }

  return (
    <main className="terminal-page">
      <section className="terminal-window" aria-label="Interactive CV terminal">
        <header className="terminal-header">
          <span className="terminal-title">Terminal - reader@angelika-cv</span>
          <span className="terminal-chrome" aria-hidden="true">
            _ [] X
          </span>
        </header>

        <div className="terminal-body">
          <p className="terminal-line">Welcome to Angelika&apos;s interactive CV terminal.</p>
          <p className="terminal-line">To see available commands, type &quot;help&quot; and press Enter.</p>

          <div className="terminal-history" aria-live="polite">
            {history.map((entry) => (
              <div className="history-entry" key={entry.id}>
                <p className="terminal-prompt-line">
                  <span className="prompt-label">{entry.prompt}</span>{' '}
                  <span>{entry.command}</span>
                </p>
                {entry.output.map((line, index) => (
                  <p
                    key={`${entry.id}-${index}`}
                    className={entry.isError ? 'terminal-output error' : 'terminal-output'}
                  >
                    {renderOutputLine(line)}
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
              ref={inputRef}
              className="terminal-input"
              type="text"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
              autoFocus
              value={currentInput}
              onChange={(event) => setCurrentInput(event.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Terminal command input"
            />
          </form>
        </div>
      </section>
    </main>
  )
}

export default App
