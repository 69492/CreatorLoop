import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/useToast'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import {
  HiUser, HiLockClosed, HiCog, HiArrowLeft, HiCheck,
  HiBell, HiColorSwatch, HiShieldCheck,
} from 'react-icons/hi'

const TABS = [
  { id: 'profile', label: 'Profile', icon: <HiUser size={15} /> },
  { id: 'password', label: 'Password', icon: <HiLockClosed size={15} /> },
  { id: 'notifications', label: 'Notifications', icon: <HiBell size={15} /> },
  { id: 'appearance', label: 'Appearance', icon: <HiColorSwatch size={15} /> },
  { id: 'security', label: 'Security', icon: <HiShieldCheck size={15} /> },
]

export default function SettingsPage() {
  const { user, updateProfile, changePassword, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading]     = useState(false)

  // Profile form
  const [fullName, setFullName]   = useState(user?.full_name ?? '')

  // Password form
  const [currentPass, setCurrentPass]   = useState('')
  const [newPass, setNewPass]           = useState('')
  const [confirmPass, setConfirmPass]   = useState('')

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateProfile({ full_name: fullName })
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error(err.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (newPass !== confirmPass) {
      toast.error('New passwords do not match')
      return
    }
    if (newPass.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      await changePassword(currentPass, newPass)
      toast.success('Password changed successfully')
      setCurrentPass(''); setNewPass(''); setConfirmPass('')
    } catch (err) {
      toast.error(err.message || 'Password change failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLogoutAll = () => {
    logout()
    navigate('/', { replace: true })
    toast.info('Signed out from all sessions')
  }

  if (!user) return null

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

      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your account preferences and security.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-5">
        {/* Sidebar tabs */}
        <nav className="sm:w-44 shrink-0" aria-label="Settings navigation">
          <div className="space-y-0.5">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  activeTab === tab.id
                    ? 'bg-brand-purple/15 text-white border border-brand-purple/25'
                    : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <span className={activeTab === tab.id ? 'text-brand-purple-light' : 'text-gray-600'}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0">

          {/* ── Profile ── */}
          {activeTab === 'profile' && (
            <Card className="border-white/8 animate-fade-in">
              <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
                <HiUser size={16} className="text-gray-500" />
                Profile Information
              </h2>
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="input-base opacity-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-600 mt-1">Email cannot be changed after account creation.</p>
                </div>
                <div>
                  <label htmlFor="settings-name" className="block text-xs font-semibold text-gray-400 mb-1.5">Full Name</label>
                  <input
                    id="settings-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Auth Method</label>
                  <div className="input-base opacity-60 cursor-not-allowed">
                    {user.google_id ? '🔗 Google OAuth' : '📧 Email & Password'}
                  </div>
                </div>
                <Button type="submit" variant="primary" size="sm" loading={loading}>
                  <HiCheck size={14} />
                  Save Changes
                </Button>
              </form>
            </Card>
          )}

          {/* ── Password ── */}
          {activeTab === 'password' && (
            <Card className="border-white/8 animate-fade-in">
              <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
                <HiLockClosed size={16} className="text-gray-500" />
                Change Password
              </h2>
              {user.google_id && !user.hashed_password ? (
                <div className="p-4 rounded-xl bg-brand-blue/8 border border-brand-blue/20">
                  <p className="text-sm text-gray-300">
                    Your account uses Google OAuth. Password management is handled by Google.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Current Password</label>
                    <input
                      type="password"
                      value={currentPass}
                      onChange={(e) => setCurrentPass(e.target.value)}
                      placeholder="••••••••"
                      className="input-base"
                      autoComplete="current-password"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">New Password</label>
                    <input
                      type="password"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder="Min 8 characters"
                      className="input-base"
                      autoComplete="new-password"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      placeholder="Repeat new password"
                      className="input-base"
                      autoComplete="new-password"
                    />
                  </div>
                  <Button type="submit" variant="primary" size="sm" loading={loading}
                    disabled={!currentPass || !newPass || !confirmPass}>
                    <HiCheck size={14} />
                    Update Password
                  </Button>
                </form>
              )}
            </Card>
          )}

          {/* ── Notifications ── */}
          {activeTab === 'notifications' && (
            <Card className="border-white/8 animate-fade-in">
              <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
                <HiBell size={16} className="text-gray-500" />
                Notification Preferences
              </h2>
              <div className="space-y-4">
                {[
                  { label: 'Generation complete', desc: 'Notify when AI pipeline finishes', enabled: true },
                  { label: 'Save reminders', desc: 'Remind to save unsaved results', enabled: false },
                  { label: 'Weekly summary', desc: 'Receive a weekly activity digest', enabled: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-white/3 border border-white/5">
                    <div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                    <div className={`w-10 h-5 rounded-full transition-colors ${item.enabled ? 'bg-brand-purple' : 'bg-white/10'} relative cursor-pointer`}
                         onClick={() => toast.info('Notification settings — coming soon')}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${item.enabled ? 'left-5' : 'left-0.5'}`} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-4">Full notification controls coming soon.</p>
            </Card>
          )}

          {/* ── Appearance ── */}
          {activeTab === 'appearance' && (
            <Card className="border-white/8 animate-fade-in">
              <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
                <HiColorSwatch size={16} className="text-gray-500" />
                Appearance
              </h2>
              <div className="p-4 rounded-xl bg-white/3 border border-white/5">
                <p className="text-sm font-medium text-white mb-1">Theme</p>
                <p className="text-xs text-gray-500 mb-3">CreatorLoop uses a premium dark theme by default.</p>
                <div className="flex gap-3">
                  {[
                    { label: 'Dark', active: true, preview: 'bg-navy-900' },
                    { label: 'Light', active: false, preview: 'bg-gray-100' },
                    { label: 'System', active: false, preview: 'bg-gradient-to-r from-navy-900 to-gray-100' },
                  ].map((t) => (
                    <button key={t.label} type="button" onClick={() => toast.info('Theme switching — coming soon')}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${t.active ? 'border-brand-purple/50 bg-brand-purple/10' : 'border-white/8 hover:border-white/15'}`}>
                      <div className={`w-12 h-8 rounded-lg ${t.preview} border border-white/10`} />
                      <span className="text-xs text-gray-400">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* ── Security ── */}
          {activeTab === 'security' && (
            <Card className="border-white/8 animate-fade-in">
              <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
                <HiShieldCheck size={16} className="text-gray-500" />
                Security
              </h2>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-white/3 border border-white/5">
                  <p className="text-sm font-medium text-white mb-1">Active Sessions</p>
                  <p className="text-xs text-gray-500 mb-3">You are currently signed in on this device.</p>
                  <Button variant="danger" size="sm" onClick={handleLogoutAll}>
                    Sign Out Everywhere
                  </Button>
                </div>
                <div className="p-4 rounded-xl bg-white/3 border border-white/5">
                  <p className="text-sm font-medium text-white mb-1">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-500">Add an extra layer of security to your account.</p>
                  <div className="mt-3">
                    <span className="text-[10px] font-bold text-gray-600 bg-navy-700 border border-white/8 px-2 py-1 rounded uppercase tracking-wider">
                      Coming Soon
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
