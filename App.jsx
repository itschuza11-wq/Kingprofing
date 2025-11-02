import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import Dashboard from './Dashboard'
import Admin from './Admin'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return alert(error.message)
    navigate('/dashboard')
  }

  async function handleSignup(e) {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) return alert(error.message)
    alert('Signup successful! Now login to continue.')
  }

  return (
    <div className="login-container">
      <h1>KingProfit Login</h1>
      <form>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <div className="btns">
          <button onClick={handleLogin} disabled={loading}>{loading ? 'Loading...' : 'Login'}</button>
          <button onClick={handleSignup} disabled={loading}>Sign Up</button>
        </div>
      </form>
    </div>
  )
}

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user || null)
    }
    getUser()
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <LoginPage />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  )
}

export default App
