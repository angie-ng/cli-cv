import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { COMMAND_NAMES, executeCommand } from './commands'
import { completeInputLine } from './commands/shared/complete'
import { HOME_PATH } from './commands/shared/vfs'
import './App.css'

const URL_IN_TEXT = /https?:\/\/[^\s]+/gi
const DEFAULT_WIDTH = 900
const DEFAULT_HEIGHT = 560
const MIN_WIDTH = 320
const MIN_HEIGHT = 280
const PAGE_PADDING = 48

const RESIZE_HANDLES = [
  { edge: 'n', cursor: 'ns-resize' },
  { edge: 's', cursor: 'ns-resize' },
  { edge: 'e', cursor: 'ew-resize' },
  { edge: 'w', cursor: 'ew-resize' },
  { edge: 'ne', cursor: 'nesw-resize' },
  { edge: 'nw', cursor: 'nwse-resize' },
  { edge: 'se', cursor: 'nwse-resize' },
  { edge: 'sw', cursor: 'nesw-resize' },
]

function formatPrompt(cwd) {
  // "~" means the reader home directory, just like a real shell.
  const pathPart = cwd === HOME_PATH ? '~' : cwd
  return `reader@angelika-cv:${pathPart}$`
}

function getMaxSize() {
  return {
    maxW: Math.max(MIN_WIDTH, window.innerWidth - PAGE_PADDING),
    maxH: Math.max(MIN_HEIGHT, window.innerHeight - PAGE_PADDING),
  }
}

function clampSize(width, height) {
  const { maxW, maxH } = getMaxSize()
  return {
    width: Math.min(Math.max(width, MIN_WIDTH), maxW),
    height: Math.min(Math.max(height, MIN_HEIGHT), maxH),
  }
}

function sizeFromDelta(edge, startWidth, startHeight, dx, dy) {
  let width = startWidth
  let height = startHeight
  if (edge.includes('e')) width = startWidth + dx
  if (edge.includes('w')) width = startWidth - dx
  if (edge.includes('s')) height = startHeight + dy
  if (edge.includes('n')) height = startHeight - dy
  return clampSize(width, height)
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

function outputLineText(line) {
  return typeof line === 'object' && line !== null ? line.text : line
}

function outputLineIsError(line, entryIsError) {
  return typeof line === 'object' && line !== null && 'isError' in line
    ? Boolean(line.isError)
    : entryIsError
}

function App() {
  const [currentInput, setCurrentInput] = useState('')
  const [history, setHistory] = useState([])
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(null)
  // Start inside the read-only reader home.
  const [cwd, setCwd] = useState(HOME_PATH)
  const [isMaximized, setIsMaximized] = useState(false)
  const [size, setSize] = useState(() => clampSize(DEFAULT_WIDTH, DEFAULT_HEIGHT))
  const inputRef = useRef(null)
  const bodyRef = useRef(null)
  const resizeRef = useRef(null)
  const delayedTimersRef = useRef({ ids: [] })

  const promptLabel = useMemo(() => formatPrompt(cwd), [cwd])

  const focusInput = () => {
    inputRef.current?.focus()
  }

  const scrollToBottom = () => {
    const body = bodyRef.current
    if (body) {
      body.scrollTop = body.scrollHeight
    }
  }

  useLayoutEffect(() => {
    scrollToBottom()
  }, [history])

  useEffect(() => {
    const timers = delayedTimersRef.current
    return () => {
      timers.ids.forEach((timer) => clearTimeout(timer))
    }
  }, [])

  useEffect(() => {
    const onResize = () => {
      setSize((prev) => clampSize(prev.width, prev.height))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const onPointerMove = (event) => {
      const session = resizeRef.current
      if (!session) return
      setSize(
        sizeFromDelta(
          session.edge,
          session.startWidth,
          session.startHeight,
          event.clientX - session.startX,
          event.clientY - session.startY,
        ),
      )
    }

    const onPointerUp = () => {
      if (!resizeRef.current) return
      resizeRef.current = null
      document.body.classList.remove('is-resizing-terminal')
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()

    const typed = currentInput.trim()
    setCurrentInput('')
    focusInput()
    scrollToBottom()
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

    if (result.action === 'delayed') {
      const entryId = crypto.randomUUID()
      setHistory((prev) => [
        ...prev,
        {
          id: entryId,
          prompt: promptBeforeCommand,
          command: typed,
          output: [],
          isError: false,
        },
      ])

      let waitMs = 0
      ;(result.steps ?? []).forEach((step) => {
        waitMs += step.delayMs ?? 0
        const timer = setTimeout(() => {
          setHistory((prev) =>
            prev.map((entry) =>
              entry.id === entryId
                ? {
                    ...entry,
                    output: [
                      ...entry.output,
                      { text: step.text, isError: step.isError },
                    ],
                  }
                : entry,
            ),
          )
        }, waitMs)
        delayedTimersRef.current.ids.push(timer)
      })
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

  const handleBodyPointerDown = (event) => {
    if (event.target.closest('a, button, input')) return
    if (window.getSelection()?.toString()) return
    focusInput()
  }

  const handleResizePointerDown = (edge, event) => {
    if (isMaximized) return
    event.preventDefault()
    event.stopPropagation()
    resizeRef.current = {
      edge,
      startX: event.clientX,
      startY: event.clientY,
      startWidth: size.width,
      startHeight: size.height,
    }
    document.body.classList.add('is-resizing-terminal')
  }

  const windowClassName = [
    'terminal-window',
    isMaximized ? 'is-maximized' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <main className="terminal-page">
      <section
        className={windowClassName}
        aria-label="Interactive CV terminal"
        style={isMaximized ? undefined : { width: size.width, height: size.height }}
      >
        <header className="terminal-header">
          <span className="terminal-title">Terminal - reader@angelika-cv</span>
          <button
            type="button"
            className="terminal-maximize"
            aria-label={isMaximized ? 'Restore terminal size' : 'Maximize terminal'}
            onClick={() => setIsMaximized((prev) => !prev)}
          >
            {isMaximized ? (
              <span className="maximize-icon restore" aria-hidden="true" />
            ) : (
              <span className="maximize-icon" aria-hidden="true" />
            )}
          </button>
        </header>

        <div
          className="terminal-body"
          ref={bodyRef}
          onPointerDown={handleBodyPointerDown}
        >
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
                    className={
                      outputLineIsError(line, entry.isError)
                        ? 'terminal-output error'
                        : 'terminal-output'
                    }
                  >
                    {renderOutputLine(outputLineText(line))}
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

        {!isMaximized &&
          RESIZE_HANDLES.map(({ edge, cursor }) => (
            <div
              key={edge}
              className={`resize-handle resize-${edge}`}
              style={{ cursor }}
              onPointerDown={(event) => handleResizePointerDown(edge, event)}
            />
          ))}
      </section>
    </main>
  )
}

export default App
