import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/useToast'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import {
  HiUser, HiMail, HiCalendar, HiCollection, HiDocumentText,
  HiGlobe, HiPencilAlt, HiArrowLeft, HiCamera, HiStar,
} from 'react-icons/hi'
import { useProjects } from '@/hooks/useProjects'
import { useEffect } from 'react'

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

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate('/workspace')}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-white transition-colors"
      >
        <HiArrowLeft size={15} />
        Back
      </button>

      {/* Profile hero */}
      <Card className="relative overflow-hidden border-white/8 bg-gradient-to-br from-navy-800/80 to-navy-900/90">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-brand-purple/10 rounded-full filter blur-[80px]" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={displayName}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white/10"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-white text-2xl font-bold border-2 border-white/10">
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
                <button type="button" onClick={() => { setNameValue(user.full_name ?? ''); setEditing(true) }} className="text-gray-600 hover:text-gray-300 transition-colors">
                  <HiPencilAlt size={15} />
                </button>
              </div>
            )}
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <HiMail size={13} />
              {user.email}
            </p>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <Badge variant={user.google_id ? 'blue' : 'default'}>
                {user.google_id ? 'Google Account' : 'Email Account'}
              </Badge>
              {user.is_verified && <Badge variant="success">Verified</Badge>}
              <span className="text-xs text-gray-600 flex items-center gap-1">
                <HiCalendar size={12} />
                Joined {fmtDate(user.created_at)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: <HiCollection size={17} />, value: stats.total_projects, label: 'Projects', color: 'text-brand-purple-light', bg: 'bg-brand-purple/10 border-brand-purple/15' },
            { icon: <HiDocumentText size={17} />, value: stats.total_words.toLocaleString(), label: 'Words Generated', color: 'text-brand-blue-light', bg: 'bg-brand-blue/10 border-brand-blue/15' },
            { icon: <HiGlobe size={17} />, value: stats.platforms_used.length, label: 'Platforms Used', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/15' },
            { icon: <HiStar size={17} />, value: stats.platforms_used[0] || '—', label: 'Top Platform', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/15' },
          ].map((item) => (
            <div key={item.label} className="glass-card p-4 flex flex-col gap-2">
              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${item.bg} ${item.color}`}>
                {item.icon}
              </div>
              <div className="text-lg font-bold text-white capitalize">{item.value}</div>
              <div className="text-xs text-gray-600">{item.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Account details */}
      <Card className="border-white/8">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <HiUser size={15} className="text-gray-500" />
          Account Details
        </h2>
        <div className="space-y-3">
          {[
            { label: 'Email', value: user.email },
            { label: 'Name', value: user.full_name || 'Not set' },
            { label: 'Auth Method', value: user.google_id ? 'Google OAuth' : 'Email & Password' },
            { label: 'Account Status', value: 'Active' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
              <span className="text-xs font-semibold text-gray-500">{item.label}</span>
              <span className="text-sm text-gray-200">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-white/8">
          <Link to="/settings">
            <Button variant="secondary" size="sm">
              <HiPencilAlt size={14} />
              Manage Settings
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
