import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Dashboard from './Dashboard'
import AdminPanel from './AdminPanel'

export default function App(){
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(r => { if (mounted) setUser(r.data.session?.user ?? null) })
    const { data: sub } = supabase.auth.onAuthStateChange((evt, session) => setUser(session?.user ?? null))
    return () => { mounted = false; sub.subscription.unsubscribe() }
  },[])

  useEffect(() => {
    async function loadProfile(){
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data || null)
    }
    loadProfile()
  },[user])

  if (!user) return <AuthUI />
  if (!profile) return <div className="center">Loading profile...</div>
  if (profile.is_admin) return <AdminPanel profile={profile} user={user} />
  return <Dashboard user={user} profile={profile} />
}

function AuthUI(){
  const [email, setEmail] = useState('')
  async function signIn() {
    if (!email) return alert('Enter email')
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) return alert(error.message)
    alert('Magic link sent — check your email.')
  }
  return (
    <div className="center">
      <div className="card auth">
        <h2>KingProfit</h2>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <div style={{marginTop:10}}>
          <button className="btn" onClick={signIn}>Send magic link</button>
        </div>
        <p className="muted">No password — login via email link.</p>
      </div>
    </div>
  )
}
