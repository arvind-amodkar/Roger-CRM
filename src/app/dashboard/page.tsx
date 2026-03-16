export const dynamic = 'force-dynamic'
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [teamCount, setTeamCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(profile)
      const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
      setTeamCount(count || 0)
      setLoading(false)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Loading ROGER CRM...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-900 text-white flex flex-col">
        <div className="p-6 border-b border-indigo-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">ROGER</h1>
              <p className="text-indigo-300 text-xs">CRM Platform</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { label: 'Dashboard', icon: '▦', active: true },
            { label: 'Contacts', icon: '👥', active: false },
            { label: 'Leads', icon: '🎯', active: false },
            { label: 'Deals', icon: '💼', active: false },
            { label: 'Tasks', icon: '✅', active: false },
            { label: 'Reports', icon: '📊', active: false },
            { label: 'Team', icon: '🏢', active: false },
            { label: 'Settings', icon: '⚙️', active: false },
          ].map((item) => (
            <div key={item.label} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-colors ${item.active ? 'bg-indigo-600 text-white' : 'text-indigo-300 hover:bg-indigo-800 hover:text-white'}`}>
              <span className="text-base">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </nav>
        <div className="p-4 border-t border-indigo-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{profile?.full_name || 'User'}</p>
              <p className="text-indigo-300 text-xs capitalize">{profile?.role || 'rep'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full text-left text-indigo-300 hover:text-white text-sm px-2 py-1.5 rounded hover:bg-indigo-800 transition-colors">
            Sign out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-500 text-sm">Welcome back, {profile?.full_name || user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full capitalize">{profile?.role || 'rep'}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Team Members', value: teamCount, color: 'bg-indigo-500', icon: '👥' },
              { label: 'Active Leads', value: 0, color: 'bg-emerald-500', icon: '🎯' },
              { label: 'Open Deals', value: 0, color: 'bg-amber-500', icon: '💼' },
              { label: 'Tasks Due', value: 0, color: 'bg-rose-500', icon: '✅' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">{stat.icon}</span>
                  <div className={`w-2 h-2 rounded-full ${stat.color}`}></div>
                </div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-2">ROGER CRM is live! 🎉</h3>
            <p className="text-indigo-200 mb-6">Your team workspace is ready. Start by inviting your team members and setting up your sales pipeline.</p>
            <div className="flex flex-wrap gap-3">
              <button className="bg-white text-indigo-600 font-semibold px-5 py-2.5 rounded-lg hover:bg-indigo-50 transition-colors text-sm">
                Invite Team Members
              </button>
              <button className="bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-indigo-400 transition-colors text-sm">
                Add First Contact
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
