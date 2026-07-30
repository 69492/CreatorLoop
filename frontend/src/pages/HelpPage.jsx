import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { HiArrowLeft, HiChevronDown, HiMail, HiExternalLink, HiLightBulb } from 'react-icons/hi'

const FAQS = [
  {
    q: 'What is CreatorLoop?',
    a: 'CreatorLoop is an AI-powered content production platform. Give it one idea and it produces full content packages — scripts, posts, outlines, and platform-specific adaptations — in seconds.',
  },
  {
    q: 'How does the AI pipeline work?',
    a: 'The 5-stage pipeline first analyses your idea, brainstorms angles, writes a full content draft, optimises it for your target platform, then applies a final creative polish pass. Each stage builds on the last.',
  },
  {
    q: 'Which platforms are supported?',
    a: 'YouTube, LinkedIn, Instagram, Blog, X / Twitter, and Podcast. More platforms are in development.',
  },
  {
    q: 'Are my projects saved automatically?',
    a: 'Yes. The content editor auto-saves every time you make a change. You can also export your projects as JSON, TXT, or Markdown at any time.',
  },
  {
    q: 'Can I edit the generated content?',
    a: 'Absolutely. Every project has a full rich-text editor. You can rewrite, restructure, or expand any section before exporting.',
  },
  {
    q: 'Is my data private?',
    a: 'Yes. Your projects are tied to your account and only visible to you. We do not train on your content.',
  },
  {
    q: 'What AI model powers CreatorLoop?',
    a: 'CreatorLoop uses Groq-hosted LLaMA 3 for ultra-fast inference. The multi-stage pipeline calls the model multiple times — once per stage — to build rich, structured output.',
  },
  {
    q: 'Can I sign in with Google?',
    a: 'Yes. Use the "Continue with Google" option on the sign-in or sign-up page.',
  },
]

const SHORTCUTS = [
  { keys: ['Enter'],        action: 'Confirm / submit current step' },
  { keys: ['Escape'],       action: 'Close modal or cancel action' },
  { keys: ['Tab'],          action: 'Move focus to next element' },
  { keys: ['Shift', 'Tab'], action: 'Move focus to previous element' },
  { keys: ['←', '→'],      action: 'Navigate wizard steps (when focused)' },
]

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-150"
      style={{ border: '1px solid var(--color-border)' }}
    >
      <button
        type="button"
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        style={{ background: open ? 'var(--color-elevated)' : 'var(--color-surface)' }}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-white pr-4">{q}</span>
        <HiChevronDown
          size={16}
          className="text-slate-500 shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'none' }}
        />
      </button>
      {open && (
        <div
          className="px-5 pb-4 animate-fade-in"
          style={{ background: 'var(--color-elevated)', borderTop: '1px solid var(--color-border)' }}
        >
          <p className="text-sm text-slate-400 leading-relaxed pt-3">{a}</p>
        </div>
      )}
    </div>
  )
}

export default function HelpPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto space-y-8 animate-fade-in">

      {/* Back */}
      <Link
        to="/workspace"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-white transition-colors"
      >
        <HiArrowLeft size={15} />
        Back to Workspace
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Help &amp; Support</h1>
        <p className="text-sm text-slate-500 mt-0.5">Guides, shortcuts, and contact information.</p>
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { emoji: '📖', title: 'Getting Started', desc: 'Learn how to use CreatorLoop in minutes', anchor: '#faq' },
          { emoji: '🎯', title: 'Best Practices', desc: 'Tips for richer, more useful AI output', anchor: '#faq' },
          { emoji: '⌨️', title: 'Keyboard Shortcuts', desc: 'Power user shortcuts for every action', anchor: '#shortcuts' },
        ].map((item) => (
          <a
            key={item.title}
            href={item.anchor}
            className="block p-4 rounded-xl transition-all duration-150 focus-visible:outline-none"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'var(--color-elevated)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.background = 'var(--color-surface)' }}
          >
            <div className="text-2xl mb-2">{item.emoji}</div>
            <p className="text-sm font-semibold text-white mb-0.5">{item.title}</p>
            <p className="text-xs text-slate-500">{item.desc}</p>
          </a>
        ))}
      </div>

      {/* FAQ */}
      <div id="faq">
        <h2 className="text-base font-semibold text-white mb-4">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {FAQS.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>

      {/* Keyboard shortcuts */}
      <Card id="shortcuts">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          ⌨️ Keyboard Shortcuts
        </h2>
        <div className="space-y-3">
          {SHORTCUTS.map((s) => (
            <div key={s.action} className="flex items-center justify-between gap-4">
              <span className="text-sm text-slate-400">{s.action}</span>
              <div className="flex items-center gap-1 shrink-0">
                {s.keys.map((key) => (
                  <kbd
                    key={key}
                    className="px-2 py-0.5 text-xs font-mono font-semibold text-slate-300 rounded-md"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Contact */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(255,122,26,0.06) 0%, rgba(45,212,191,0.04) 100%)',
          border: '1px solid rgba(255,122,26,0.15)',
        }}
      >
        <div className="text-3xl mb-3">💬</div>
        <h3 className="text-white font-semibold mb-2">Still have questions?</h3>
        <p className="text-sm text-slate-500 mb-5 max-w-xs mx-auto">
          Reach out and we'll get back to you as quickly as possible.
        </p>
        <a href="mailto:support@creatorloop.ai">
          <Button variant="secondary" size="md">
            <HiMail size={15} />
            Contact Support
          </Button>
        </a>
      </div>
    </div>
  )
}
