import React, {useEffect, useState} from 'react'
import { supabase } from './supabaseClient'

export default function Dashboard({user, profile}){
  const [summary, setSummary] = useState(null)
  const [txns, setTxns] = useState([])
  const [tasks, setTasks] = useState([])
  const [deposited, setDeposited] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load(){
      const userId = user.id
      const { data: tx } = await supabase.from('transactions').select('*').eq('user_id', userId).order('created_at',{ascending:false}).limit(200)
      let earned = 0, balance = 0, withdrawn = 0
      (tx || []).forEach(t => {
        const amt = parseFloat(t.amount)
        if (amt > 0) earned += amt
        balance += amt
        if (t.type === 'withdrawal' && t.status==='completed') withdrawn += Math.abs(amt)
      })
      setSummary({ lifetime_earned: earned, current_balance: balance, total_withdrawn: withdrawn })
      setTxns(tx || [])
      const { data: taskData } = await supabase.from('tasks').select('*').eq('active', true).order('created_at',{ascending:false}).limit(50)
      setTasks(taskData || [])
      const { data: dep } = await supabase.from('transactions').select('*').eq('user_id', userId).eq('type','deposit').limit(1)
      setDeposited((dep || []).length > 0)
    }
    load()
    const sub = supabase.channel('public:transactions').on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => load()).subscribe()
    return ()=> sub.unsubscribe()
  },[user])

  async function completeTask(task){
    const { error } = await supabase.from('transactions').insert([{ user_id: user.id, type:'task', amount: parseFloat(task.reward), meta:{task_id: task.id}, status:'completed' }])
    if (error) return alert(error.message)
    alert('Task completed! Reward added to your balance.')
  }

  async function requestWithdraw(){
    const phone = prompt('Enter withdraw phone/account number (e.g., 03XXXXXXXXX)')
    if (!phone) return
    const amount = prompt('Amount to withdraw (e.g., 10.00)')
    if (!amount) return
    const intAmt = parseFloat(amount)
    if (isNaN(intAmt) || intAmt<=0) return alert('Invalid amount')
    if (intAmt > Number(summary.current_balance)) return alert('Insufficient balance')
    const { error } = await supabase.from('transactions').insert([{ user_id: user.id, type:'withdrawal', amount: -Math.abs(intAmt), meta:{phone}, status:'pending' }])
    if (error) return alert(error.message)
    alert('Withdrawal requested (pending). Admin will approve.')
  }

  async function makeDeposit(e){
    e.preventDefault()
    const amount = parseFloat(e.target.amount.value)
    const file = e.target.proof.files[0]
    if (!amount || isNaN(amount) || amount <= 0) { alert('Invalid amount'); return }

    if (!file) return alert('Please upload screenshot as proof')
    setUploading(true)
    // upload file to supabase storage 'deposit-proofs'
    const fileName = `${user.id}_${Date.now()}_${file.name}`
    const { data: uploadData, error: uploadErr } = await supabase.storage.from('deposit-proofs').upload(fileName, file)
    if (uploadErr) { setUploading(false); return alert('Upload error: '+uploadErr.message) }
    const url = uploadData.path
    // create pending deposit transaction
    const { error } = await supabase.from('transactions').insert([{ user_id: user.id, type:'deposit', amount: parseFloat(amount), screenshot_url: url, status:'pending' }])
    setUploading(false)
    if (error) return alert(error.message)
    alert('Deposit request submitted — admin will verify.')
  }

  return (
    <div className="container">
      <header className="header">
        <h1>KingProfit</h1>
        <div className="user">{profile?.display_name || user?.email}</div>
      </header>

      <section className="cards">
        <div className="card">
          <div className="label">Lifetime earned</div>
          <div className="value">{summary ? summary.lifetime_earned.toFixed(2) : '0.00'}</div>
        </div>
        <div className="card">
          <div className="label">Current balance</div>
          <div className="value">{summary ? summary.current_balance.toFixed(2) : '0.00'}</div>
        </div>
        <div className="card">
          <div className="label">Total withdrawn</div>
          <div className="value">{summary ? summary.total_withdrawn.toFixed(2) : '0.00'}</div>
        </div>
      </section>

      <div style={{marginTop:12}}>
        <button className="btn" onClick={requestWithdraw}>Request Withdraw</button>
      </div>

  <h3 style={{marginTop:18}}>Deposit (JazzCash / Easypaisa)</h3>
  <form onSubmit={makeDeposit} className="card">
    <div style={{marginBottom:8}}>Select method: <strong>JazzCash</strong> / <strong>Easypaisa</strong></div>
    <div style={{marginBottom:8}}><label>Amount:</label><input name="amount" type="number" step="0.01" /></div>
    <div style={{marginBottom:8}}><label>Upload screenshot (payment proof):</label><input name="proof" type="file" accept="image/*" /></div>
    <div><button className="btn" type="submit" disabled={uploading}>{uploading ? 'Uploading...' : 'Submit Deposit'}</button></div>
  </form>

  <h3 style={{marginTop:18}}>Available Tasks</h3>
  <div>
    {tasks.map(t => (
      <div key={t.id} className="card" style={{marginBottom:8}}>
        <div style={{fontWeight:600}}>{t.title} — Reward: {Number(t.reward).toFixed(2)}</div>
        <div style={{marginTop:6}}>{t.description}</div>
        <div style={{marginTop:8}}><button className="btn" onClick={()=>completeTask(t)}>Complete Task</button></div>
      </div>
    ))}
    {tasks.length===0 && <div className="muted">No tasks available yet.</div>}
  </div>

  <h3 style={{marginTop:18}}>Recent transactions</h3>
  <table className="tx">
    <thead><tr><th>Date</th><th>Type</th><th>Amount</th><th>Status</th></tr></thead>
    <tbody>
      {txns.map(t => (
        <tr key={t.id}>
          <td>{new Date(t.created_at).toLocaleString()}</td>
          <td>{t.type}</td>
          <td>{Number(t.amount).toFixed(2)}</td>
          <td>{t.status}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
  )
}
