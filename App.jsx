import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Dashboard from './Dashboard'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleLogin(e) {
    e.preventDefault()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) alert(error.message)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setSession(null)
  }

  if (loading) return <div>Loading...</div>

  if (!session)
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0b0b0b', color:'#fff' }}>
        <form onSubmit={handleLogin} style={{ width:320, background:'#111', padding:20, borderRadius:12 }}>
          <h2 style={{ color:'#c59a2f', marginBottom:12 }}>KingProfit — Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width:'100%', padding:10, borderRadius:8, marginBottom:8 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width:'100%', padding:10, borderRadius:8, marginBottom:12 }}
          />
          <button
            type="submit"
            style={{ width:'100%', padding:10, borderRadius:8, background:'#c59a2f', border:'none', cursor:'pointer' }}
          >
            Login
          </button>
        </form>
      </div>
    )

  return (
    <div>
      <button onClick={handleLogout} style={{position:'absolute',top:10,right:10}}>Logout</button>
      <Dashboard user={session.user} profile={{display_name: session.user.email}} />
    </div>
  )
}
