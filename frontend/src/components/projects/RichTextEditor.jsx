import { useState, useRef } from 'react'

/**
 * Minimal rich-text editor built on contentEditable.
 *
 * Supported commands: bold, italic, h2, h3, ul, ol
 * onChange(html) — called with the full innerHTML on each keystroke.
 *
 * Props:
 *   value       initial HTML string
 *   onChange    (html: string) => void
 *   placeholder string
 *   className   extra classes for the outer wrapper
 */
export default function RichTextEditor({ value, onChange, placeholder = 'Start typing…', className = '' }) {
  const editorRef = useRef(null)
  const [focused, setFocused] = useState(false)

  const exec = (cmd, arg = null) => {
    document.execCommand(cmd, false, arg)
    editorRef.current?.focus()
    emitChange()
  }

  const emitChange = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const toolbarButtons = [
    { title: 'Bold',          cmd: 'bold',          label: <strong>B</strong> },
    { title: 'Italic',        cmd: 'italic',         label: <em>I</em> },
    { title: 'Heading 2',     cmd: 'formatBlock',    arg: 'h2', label: 'H2' },
    { title: 'Heading 3',     cmd: 'formatBlock',    arg: 'h3', label: 'H3' },
    { title: 'Bullet List',   cmd: 'insertUnorderedList', label: '• List' },
    { title: 'Numbered List', cmd: 'insertOrderedList',   label: '1. List' },
    { title: 'Paragraph',     cmd: 'formatBlock',    arg: 'p',  label: '¶' },
  ]

  return (
    <div className={`flex flex-col rounded-xl border border-white/10 overflow-hidden ${focused ? 'border-brand-purple/50 ring-1 ring-brand-purple/30' : ''} ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-0.5 p-2 bg-navy-700/50 border-b border-white/10">
        {toolbarButtons.map((btn) => (
          <button
            key={btn.title}
            title={btn.title}
            onMouseDown={(e) => {
              e.preventDefault()
              exec(btn.cmd, btn.arg)
            }}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Editable area */}
      <div className="relative">
        {!value && !focused && (
          <div className="absolute top-4 left-4 text-gray-600 text-sm pointer-events-none select-none">
            {placeholder}
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          dangerouslySetInnerHTML={{ __html: value }}
          onInput={emitChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="
            min-h-[180px] p-4 text-sm text-gray-200 leading-relaxed
            focus:outline-none
            [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-3 [&_h2]:mb-1
            [&_h3]:text-sm  [&_h3]:font-semibold [&_h3]:text-gray-200 [&_h3]:mt-2 [&_h3]:mb-0.5
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-0.5
            [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-0.5
            [&_strong]:text-white [&_em]:text-gray-300
          "
        />
      </div>
    </div>
  )
}
