import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/useToast'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import {
  HiUser, HiMail, HiCalendar, HiCollection, HiDocumentText,
  HiGlobe, HiPencilAlt, HiArrowLeft, HiStar,
} from 'react-icons/hi'
import { useProjects } from '@/hooks/useProjects'

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : '—'

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const { toast } = useToast()
  const { stats, fetchProjects } = useProjects()
  const navigate = useNavigate()

  const [editing, setEditing]       = useState(false)
  const [loading, setLoading]       = useState(false)
  const [nameValue, setNameValue]   = useState(user?.full_name ?? '')

  useEffect(() => { fetchProjects({ perPage: 1 }) }, [fetchProjects])

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateProfile({ full_name: nameValue })
      toast.success('Profile updated')
      setEditing(false)
    } catch (err) {
      toast.error(err.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  const displayName = user.full_name || user.email.split('@')[0]
  const initials = (user.full_name || displayName)
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const STAT_ITEMS = [
    {
      icon: <HiCollection size={17} />,
      value: stats?.total_projects ?? '—',
      label: 'Projects',
      color: '#FF9A4D',
      bg: 'rgba(255,122,26,0.08)',
      border: 'rgba(255,122,26,0.15)',
    },
    {
      icon: <HiDocumentText size={17} />,
      value: stats ? stats.total_words.toLocaleString() : '—',
      label: 'Words Generated',
      color: '#5EEAD4',
      bg: 'rgba(45,212,191,0.08)',
      border: 'rgba(45,212,191,0.15)',
    },
    {
      icon: <HiGlobe size={17} />,
      value: stats ? stats.platforms_used.length : '—',
      label: 'Platforms Used',
      color: '#60a5fa',
      bg: 'rgba(59,130,246,0.08)',
      border: 'rgba(59,130,246,0.15)',
    },
    {
      icon: <HiStar size={17} />,
      value: stats?.platforms_used[0] || '—',
      label: 'Top Platform',
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.08)',
      border: 'rgba(245,158,11,0.15)',
    },
  ]

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate('/workspace')}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-white transition-colors"
      >
        <HiArrowLeft size={15} />
        Back
      </button>

      {/* Profile hero */}
      <div
        className="relative overflow-hidden rounded-2xl p-6"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 0 40px rgba(255,122,26,0.04)',
        }}
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full filter blur-[80px]"
               style={{ background: 'rgba(255,122,26,0.06)' }} />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={displayName}
                className="w-20 h-20 rounded-2xl object-cover"
                style={{ border: '2px solid rgba(255,255,255,0.1)' }}
              />
            ) : (
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #FF7A1A 0%, #2DD4BF 100%)',
                  border: '2px solid rgba(255,255,255,0.1)',
                }}
              >
                {initials}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="flex items-center gap-2 mb-2">
                <input
                  autoFocus
                  type="text"
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false) }}
                  className="input-base max-w-xs"
                  placeholder="Your full name"
                />
                <Button variant="primary" size="sm" onClick={handleSave} loading={loading}>Save</Button>
                <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-white tracking-tight truncate">{displayName}</h1>
                <button
                  type="button"
                  onClick={() => { setNameValue(user.full_name ?? ''); setEditing(true) }}
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <HiPencilAlt size={15} />
                </button>
              </div>
            )}
            <p className="text-sm text-slate-400 flex items-center gap-2 mb-3">
              <HiMail size={13} className="text-slate-600" />
              {user.email}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={user.google_id ? 'teal' : 'default'}>
                {user.google_id ? 'Google Account' : 'Email Account'}
              </Badge>
              {user.is_verified && <Badge variant="success">Verified</Badge>}
              <span className="text-xs text-slate-500 flex items-center gap-1.5 ml-1">
                <HiCalendar size={11} />
                Member since {fmtDate(user.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STAT_ITEMS.map((item) => (
            <div
              key={item.label}
              className="card p-4 flex flex-col gap-2"
            >
              <div
                className="w-8 h-8 rounded-xl border flex items-center justify-center"
                style={{ background: item.bg, borderColor: item.border, color: item.color }}
              >
                {item.icon}
              </div>
              <div className="text-lg font-bold text-white capitalize">{item.value}</div>
              <div className="text-xs text-slate-500">{item.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Account details */}
      <Card>
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <HiUser size={15} className="text-slate-500" />
          Account Information
        </h2>
        <div className="space-y-0">
          {[
            { label: 'Email Address', value: user.email },
            { label: 'Display Name', value: user.full_name || 'Not set' },
            { label: 'Sign-in Method', value: user.google_id ? 'Google OAuth 2.0' : 'Email & Password' },
            { label: 'Account Status', value: 'Active' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-3 last:border-0"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{item.label}</span>
              <span className="text-sm text-slate-200 font-medium">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-4 flex items-center gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <Link to="/settings">
            <Button variant="secondary" size="sm">
              <HiPencilAlt size={14} />
              Manage Settings
            </Button>
          </Link>
          <span className="text-xs text-slate-600">Profile edits save instantly.</span>
        </div>
      </Card>
    </div>
  )
}
